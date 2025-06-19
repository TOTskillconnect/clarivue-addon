import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService, APICallbacks } from '../services/apiService';
import { Question, Cue, AISuggestion, MeetingContext } from '../utils/mockData';

interface UseRealTimeAPIOptions {
  meetingContext: MeetingContext | null;
  fallbackToMockData?: boolean;
}

interface UseRealTimeAPIReturn {
  questions: Question[];
  cues: Cue[];
  aiSuggestions: AISuggestion[];
  meetingStage: 'start' | 'middle' | 'end';
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  
  // Actions
  sendUserInteraction: (interaction: {
    type: 'question_copied' | 'cue_applied' | 'ai_suggestion_used';
    itemId: string;
    metadata?: any;
  }) => Promise<void>;
  updateParticipants: (participants: any[]) => Promise<void>;
  sendTranscriptUpdate: (transcript: string) => Promise<void>;
  reconnect: () => Promise<void>;
}

export const useRealTimeAPI = ({ 
  meetingContext, 
  fallbackToMockData = true 
}: UseRealTimeAPIOptions): UseRealTimeAPIReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [cues, setCues] = useState<Cue[]>([]);
  const [aiSuggestions, setAISuggestions] = useState<AISuggestion[]>([]);
  const [meetingStage, setMeetingStage] = useState<'start' | 'middle' | 'end'>('start');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const sessionIdRef = useRef<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // API callbacks for handling real-time updates
  const apiCallbacks: APICallbacks = {
    onQuestionsUpdate: useCallback((newQuestions: Question[]) => {
      setQuestions(newQuestions);
    }, []),
    
    onCuesUpdate: useCallback((newCues: Cue[]) => {
      setCues(newCues);
    }, []),
    
    onAISuggestionsUpdate: useCallback((newSuggestions: AISuggestion[]) => {
      setAISuggestions(newSuggestions);
    }, []),
    
    onMeetingStageChange: useCallback((stage: 'start' | 'middle' | 'end') => {
      setMeetingStage(stage);
    }, []),
    
    onError: useCallback((errorMessage: string) => {
      setError(errorMessage);
      setConnectionStatus('error');
      setIsConnected(false);
    }, [])
  };

  // Initialize connection when meeting context is available
  useEffect(() => {
    if (!meetingContext) return;

    const initializeConnection = async () => {
      setIsLoading(true);
      setConnectionStatus('connecting');
      setError(null);

      try {
        const sessionId = await apiService.initializeRealTimeConnection(
          meetingContext,
          apiCallbacks
        );
        
        sessionIdRef.current = sessionId;
        setIsConnected(true);
        setConnectionStatus('connected');
        
        console.log('Real-time API connection established:', sessionId);
      } catch (error) {
        console.error('Failed to initialize real-time API:', error);
        setError('Failed to connect to AI backend');
        setConnectionStatus('error');
        setIsConnected(false);
        
        // Fallback to mock data if enabled
        if (fallbackToMockData) {
          console.log('Falling back to mock data');
          loadMockData();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeConnection();

    // Cleanup on unmount or context change
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      apiService.closeConnection();
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };
  }, [meetingContext, fallbackToMockData]);

  // Load mock data as fallback
  const loadMockData = useCallback(() => {
    // Import mock data functions
    import('../utils/mockData').then(({ 
      getQuestionsForMeeting, 
      getCuesForStage, 
      mockAISuggestions 
    }) => {
      if (meetingContext) {
        setQuestions(getQuestionsForMeeting(meetingContext.type, 'start'));
        setCues(getCuesForStage('active'));
        setAISuggestions(mockAISuggestions.slice(0, 3));
        setMeetingStage('start');
      }
    });
  }, [meetingContext]);

  // Action functions
  const sendUserInteraction = useCallback(async (interaction: {
    type: 'question_copied' | 'cue_applied' | 'ai_suggestion_used';
    itemId: string;
    metadata?: any;
  }) => {
    if (!isConnected) {
      console.warn('Cannot send interaction - not connected to API');
      return;
    }
    
    try {
      await apiService.sendUserInteraction(interaction);
    } catch (error) {
      console.error('Failed to send user interaction:', error);
    }
  }, [isConnected]);

  const updateParticipants = useCallback(async (participants: any[]) => {
    if (!isConnected) return;
    
    try {
      await apiService.updateParticipants(participants);
    } catch (error) {
      console.error('Failed to update participants:', error);
    }
  }, [isConnected]);

  const sendTranscriptUpdate = useCallback(async (transcript: string) => {
    if (!isConnected) return;
    
    try {
      await apiService.sendTranscriptUpdate(transcript);
    } catch (error) {
      console.error('Failed to send transcript update:', error);
    }
  }, [isConnected]);

  const reconnect = useCallback(async () => {
    if (!meetingContext) return;
    
    setIsLoading(true);
    setConnectionStatus('connecting');
    
    try {
      await apiService.closeConnection();
      const sessionId = await apiService.initializeRealTimeConnection(
        meetingContext,
        apiCallbacks
      );
      
      sessionIdRef.current = sessionId;
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
    } catch (error) {
      console.error('Reconnection failed:', error);
      setError('Reconnection failed');
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [meetingContext]);

  return {
    questions,
    cues,
    aiSuggestions,
    meetingStage,
    isConnected,
    isLoading,
    error,
    connectionStatus,
    sendUserInteraction,
    updateParticipants,
    sendTranscriptUpdate,
    reconnect
  };
}; 