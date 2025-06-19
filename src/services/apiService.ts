import { Question, Cue, AISuggestion, MeetingContext } from '../utils/mockData';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:8000';

// Types for API communication
export interface MeetingSession {
  sessionId: string;
  platform: 'zoom' | 'teams' | 'meet';
  meetingId: string;
  userId: string;
  timestamp: number;
}

export interface LiveMeetingData {
  questions: Question[];
  cues: Cue[];
  aiSuggestions: AISuggestion[];
  meetingStage: 'start' | 'middle' | 'end';
  participants: any[];
  transcript?: string[];
}

export interface APICallbacks {
  onQuestionsUpdate: (questions: Question[]) => void;
  onCuesUpdate: (cues: Cue[]) => void;
  onAISuggestionsUpdate: (suggestions: AISuggestion[]) => void;
  onMeetingStageChange: (stage: 'start' | 'middle' | 'end') => void;
  onError: (error: string) => void;
}

class APIService {
  private ws: WebSocket | null = null;
  private callbacks: APICallbacks | null = null;
  private sessionId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Initialize WebSocket connection for real-time updates
  async initializeRealTimeConnection(
    meetingContext: MeetingContext, 
    callbacks: APICallbacks
  ): Promise<string> {
    this.callbacks = callbacks;
    
    try {
      // First, register the meeting session with REST API
      const sessionResponse = await fetch(`${API_BASE_URL}/api/meetings/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          platform: meetingContext.platform,
          meetingId: meetingContext.id,
          meetingType: meetingContext.type,
          userId: this.getUserId(),
          timestamp: Date.now()
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create meeting session');
      }

      const session: MeetingSession = await sessionResponse.json();
      this.sessionId = session.sessionId;

      // Then establish WebSocket connection
      await this.connectWebSocket(session.sessionId);
      
      return session.sessionId;
    } catch (error) {
      console.error('Failed to initialize real-time connection:', error);
      this.callbacks?.onError('Failed to connect to AI backend');
      throw error;
    }
  }

  private async connectWebSocket(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${WS_BASE_URL}/ws/meetings/${sessionId}?token=${this.getAuthToken()}`);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected for session:', sessionId);
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleWebSocketMessage(event);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          this.handleWebSocketClose();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'questions_update':
          this.callbacks?.onQuestionsUpdate(data.payload);
          break;
        case 'cues_update':
          this.callbacks?.onCuesUpdate(data.payload);
          break;
        case 'ai_suggestions_update':
          this.callbacks?.onAISuggestionsUpdate(data.payload);
          break;
        case 'meeting_stage_change':
          this.callbacks?.onMeetingStageChange(data.payload.stage);
          break;
        case 'error':
          this.callbacks?.onError(data.payload.message);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private handleWebSocketClose(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        if (this.sessionId) {
          this.connectWebSocket(this.sessionId);
        }
      }, delay);
    } else {
      this.callbacks?.onError('Lost connection to AI backend');
    }
  }

  // Send meeting events to backend
  async sendMeetingEvent(eventType: string, data: any): Promise<void> {
    if (!this.sessionId) {
      console.warn('No active session to send event');
      return;
    }

    try {
      // Send via WebSocket for real-time processing
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'meeting_event',
          sessionId: this.sessionId,
          eventType,
          data,
          timestamp: Date.now()
        }));
      }

      // Also send via REST API for reliability
      await fetch(`${API_BASE_URL}/api/meetings/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          eventType,
          data,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send meeting event:', error);
    }
  }

  // Send participant updates
  async updateParticipants(participants: any[]): Promise<void> {
    await this.sendMeetingEvent('participants_update', { participants });
  }

  // Send transcript/conversation updates
  async sendTranscriptUpdate(transcript: string): Promise<void> {
    await this.sendMeetingEvent('transcript_update', { transcript });
  }

  // Send user interaction events
  async sendUserInteraction(interaction: {
    type: 'question_copied' | 'cue_applied' | 'ai_suggestion_used';
    itemId: string;
    metadata?: any;
  }): Promise<void> {
    await this.sendMeetingEvent('user_interaction', interaction);
  }

  // Close connection
  async closeConnection(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.sessionId) {
      try {
        await fetch(`${API_BASE_URL}/api/meetings/sessions/${this.sessionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.getAuthToken()}`
          }
        });
      } catch (error) {
        console.error('Failed to close session:', error);
      }
      
      this.sessionId = null;
    }
  }

  // Helper methods
  private getAuthToken(): string {
    // Get from localStorage, context, or environment
    return localStorage.getItem('clarivue_auth_token') || 'demo-token';
  }

  private getUserId(): string {
    // Get from user context or localStorage
    return localStorage.getItem('clarivue_user_id') || 'demo-user';
  }
}

export const apiService = new APIService(); 