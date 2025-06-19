# Clarivue Frontend API Integration Guide

## 🎯 Overview

Your Clarivue frontend now has a **production-ready API integration layer** that connects to your backend for real-time AI-powered features during meetings.

## ✅ What's Already Implemented

### 1. **API Service Layer** (`src/services/apiService.ts`)
- **WebSocket Connection**: Real-time bidirectional communication
- **REST API Fallback**: Reliable HTTP endpoints
- **Session Management**: Meeting session lifecycle
- **Error Handling**: Automatic reconnection with exponential backoff
- **Event Streaming**: Live meeting events to backend

### 2. **React Hook** (`src/hooks/useRealTimeAPI.ts`)
- **State Management**: Questions, cues, AI suggestions
- **Connection Status**: Live connection monitoring
- **User Interactions**: Track copy, apply, favorite actions
- **Mock Data Fallback**: Seamless demo mode when backend unavailable

### 3. **Environment Configuration** (`src/config/environment.ts`)
- **Multi-Environment**: Development, staging, production
- **Feature Flags**: Enable/disable real-time features
- **API Endpoints**: Centralized endpoint management
- **Security**: Environment-based configuration

### 4. **Enhanced Components**
- **CompactSuggestionPanel**: Real-time data integration
- **Connection Status**: Visual indicators for API status
- **Interactive Actions**: User interaction tracking
- **Error Handling**: Graceful degradation to demo mode

## 🔌 Backend API Expectations

Your backend should implement these endpoints:

### **WebSocket Connection**
```
WS: /ws/meetings/{sessionId}?token={auth_token}

Message Types:
- questions_update: { type: 'questions_update', payload: Question[] }
- cues_update: { type: 'cues_update', payload: Cue[] }
- ai_suggestions_update: { type: 'ai_suggestions_update', payload: AISuggestion[] }
- meeting_stage_change: { type: 'meeting_stage_change', payload: { stage: 'start'|'middle'|'end' } }
- error: { type: 'error', payload: { message: string } }
```

### **REST Endpoints**
```
POST /api/meetings/sessions
- Create meeting session
- Body: { platform, meetingId, meetingType, userId, timestamp }
- Response: { sessionId, platform, meetingId, userId, timestamp }

POST /api/meetings/events  
- Send meeting events
- Body: { sessionId, eventType, data, timestamp }

DELETE /api/meetings/sessions/{sessionId}
- Close meeting session
```

## 📊 Data Flow Architecture

```
Meeting Platform SDK → Frontend → WebSocket → Backend AI → Real-time Updates
     ↓                    ↓           ↓            ↓              ↓
  [Meeting Data]    [User Actions] [Events]   [AI Processing] [Live Results]
```

### **Frontend → Backend Events**
- `participants_update`: When participants join/leave
- `transcript_update`: Real-time conversation text
- `user_interaction`: Copy, apply, favorite actions
- `meeting_stage_change`: Start, middle, end detection

### **Backend → Frontend Updates**
- `questions_update`: AI-generated contextual questions
- `cues_update`: Conversation cues based on meeting flow
- `ai_suggestions_update`: Live AI insights and recommendations
- `meeting_stage_change`: AI-detected meeting progression

## 🚀 Ready-to-Use Features

### **1. Real-Time Questions**
```typescript
// Questions automatically update based on:
- Meeting type (standup, planning, review)
- Current stage (start, middle, end)
- Conversation context
- Participant behavior
```

### **2. Live Conversation Cues**
```typescript
// Cues triggered by:
- Speaking duration patterns
- Silence detection
- Topic transitions
- Engagement levels
```

### **3. AI Insights**
```typescript
// AI suggestions based on:
- Meeting transcript analysis
- Participant sentiment
- Action item detection
- Follow-up recommendations
```

## 🔧 Environment Setup

Create `.env.local` file:
```bash
# Backend API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_WS_BASE_URL=ws://localhost:8000
REACT_APP_ENABLE_REAL_TIME_API=true

# Platform SDK Configuration  
REACT_APP_GOOGLE_CLOUD_PROJECT_NUMBER=your-project-number

# Optional: AI Provider
REACT_APP_AI_PROVIDER=openai
```

## 📱 Usage in Components

```typescript
import { useRealTimeAPI } from '../hooks/useRealTimeAPI';

const MyComponent = ({ platform }) => {
  const {
    questions,        // Live AI questions
    cues,            // Conversation cues  
    aiSuggestions,   // AI insights
    isConnected,     // Connection status
    sendUserInteraction // Track user actions
  } = useRealTimeAPI({
    meetingContext,
    fallbackToMockData: true
  });

  // Use real-time data in your UI
  return (
    <div>
      {questions.map(q => 
        <QuestionCard 
          question={q}
          onCopy={() => sendUserInteraction({
            type: 'question_copied',
            itemId: q.id
          })}
        />
      )}
    </div>
  );
};
```

## 🎯 Next Steps for Production

### **1. Backend Implementation**
- [ ] WebSocket server with meeting session management
- [ ] AI processing pipeline for real-time analysis
- [ ] Database for session storage and analytics
- [ ] Authentication and authorization

### **2. Environment Configuration**
- [ ] Set up production API endpoints
- [ ] Configure Google Cloud project for Meet SDK
- [ ] Set up monitoring and logging
- [ ] Configure error reporting

### **3. Platform Deployment**
- [ ] Submit to Google Workspace Marketplace (Meet)
- [ ] Deploy to Microsoft Teams App Store
- [ ] Publish Zoom App to Zoom Marketplace

### **4. Advanced Features**
- [ ] User authentication and profiles
- [ ] Meeting analytics and insights
- [ ] Custom AI model training
- [ ] Enterprise admin controls

## 🔒 Security Considerations

- **Authentication**: JWT tokens for API access
- **CORS**: Proper origin restrictions
- **Rate Limiting**: Prevent API abuse
- **Data Privacy**: Meeting data encryption
- **Compliance**: GDPR, CCPA compliance

## 📈 Monitoring & Analytics

The frontend tracks:
- **Connection Quality**: WebSocket reliability
- **User Interactions**: Feature usage patterns
- **Error Rates**: API failure tracking
- **Performance**: Response times and latencies

## 🎉 Result

Your frontend is now **backend-ready** with:
- ✅ Real-time AI integration capabilities
- ✅ Graceful fallback to demo mode
- ✅ Production-ready error handling
- ✅ Scalable architecture for all platforms
- ✅ Comprehensive monitoring and logging

The implementation seamlessly transitions from **demo mode** to **live AI** once your backend is deployed! 🚀 