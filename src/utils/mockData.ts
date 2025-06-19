// Mock data for simulated meeting scenarios

export interface MeetingContext {
  id: string;
  title: string;
  platform: 'zoom' | 'teams' | 'meet';
  type: 'standup' | 'planning' | 'retrospective' | 'brainstorm' | 'review' | 'all-hands';
  duration: number; // minutes
  participantCount: number;
  participants: string[];
  startTime: Date;
  stage: 'waiting' | 'starting' | 'active' | 'ending';
  isRecording: boolean;
  isScreenSharing: boolean;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  meetingTypes: string[];
  icon: string;
  priority: 'high' | 'medium' | 'low';
  timing: 'start' | 'middle' | 'end' | 'any';
}

export interface Cue {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: string;
  trigger: string;
  meetingStage: string[];
}

export interface AISuggestion {
  id: string;
  type: 'action' | 'reminder' | 'insight' | 'warning';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  platform?: string;
}

// Meeting Scenarios
export const mockMeetingScenarios: MeetingContext[] = [
  {
    id: 'daily-standup',
    title: 'Daily Team Standup',
    platform: 'zoom',
    type: 'standup',
    duration: 15,
    participantCount: 6,
    participants: ['Alice Chen', 'Bob Smith', 'Carol Davis', 'David Lee', 'Emma Wilson', 'Frank Miller'],
    startTime: new Date(),
    stage: 'active',
    isRecording: false,
    isScreenSharing: false
  },
  {
    id: 'sprint-planning',
    title: 'Sprint Planning Session',
    platform: 'teams',
    type: 'planning',
    duration: 120,
    participantCount: 8,
    participants: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Connor', 'Tom Wilson', 'Lisa Zhang', 'Alex Brown', 'Maya Patel'],
    startTime: new Date(),
    stage: 'active',
    isRecording: true,
    isScreenSharing: true
  },
  {
    id: 'quarterly-review',
    title: 'Q4 Performance Review',
    platform: 'meet',
    type: 'review',
    duration: 60,
    participantCount: 12,
    participants: ['CEO Sarah', 'CTO Mike', 'VP Sales Anna', 'VP Product James', 'HR Director Lisa', 'Finance Lead Tom'],
    startTime: new Date(),
    stage: 'active',
    isRecording: true,
    isScreenSharing: false
  }
];

// Dynamic Questions by Meeting Type
export const mockQuestions: Question[] = [
  // Standup Questions
  {
    id: 'q1',
    text: 'What did you accomplish yesterday?',
    category: 'Progress',
    meetingTypes: ['standup'],
    icon: '✅',
    priority: 'high',
    timing: 'start'
  },
  {
    id: 'q2',
    text: 'What are you working on today?',
    category: 'Planning',
    meetingTypes: ['standup'],
    icon: '🎯',
    priority: 'high',
    timing: 'start'
  },
  {
    id: 'q3',
    text: 'Are there any blockers or impediments?',
    category: 'Issues',
    meetingTypes: ['standup'],
    icon: '🚧',
    priority: 'high',
    timing: 'middle'
  },

  // Planning Questions
  {
    id: 'q4',
    text: 'What are our sprint goals?',
    category: 'Objectives',
    meetingTypes: ['planning'],
    icon: '🏆',
    priority: 'high',
    timing: 'start'
  },
  {
    id: 'q5',
    text: 'Do we have all the requirements clear?',
    category: 'Clarity',
    meetingTypes: ['planning'],
    icon: '📋',
    priority: 'medium',
    timing: 'middle'
  },
  {
    id: 'q6',
    text: 'What are the potential risks?',
    category: 'Risk Management',
    meetingTypes: ['planning', 'review'],
    icon: '⚠️',
    priority: 'medium',
    timing: 'middle'
  },

  // Review Questions
  {
    id: 'q7',
    text: 'What metrics are we tracking?',
    category: 'Analytics',
    meetingTypes: ['review'],
    icon: '📊',
    priority: 'high',
    timing: 'start'
  },
  {
    id: 'q8',
    text: 'What lessons have we learned?',
    category: 'Learning',
    meetingTypes: ['review', 'retrospective'],
    icon: '💡',
    priority: 'medium',
    timing: 'end'
  },

  // Universal Questions
  {
    id: 'q9',
    text: 'Does everyone understand the next steps?',
    category: 'Clarity',
    meetingTypes: ['standup', 'planning', 'review', 'brainstorm'],
    icon: '✨',
    priority: 'high',
    timing: 'end'
  },
  {
    id: 'q10',
    text: 'Who will be responsible for follow-ups?',
    category: 'Accountability',
    meetingTypes: ['planning', 'review', 'brainstorm'],
    icon: '👤',
    priority: 'high',
    timing: 'end'
  }
];

// Conversation Cues
export const mockCues: Cue[] = [
  {
    id: 'c1',
    title: 'Active Listening',
    content: 'Focus on understanding before responding. Ask clarifying questions to ensure you\'ve grasped their point correctly.',
    category: 'Communication',
    icon: '👂',
    trigger: 'When someone is speaking for more than 2 minutes',
    meetingStage: ['active']
  },
  {
    id: 'c2',
    title: 'Time Management',
    content: 'Keep discussions on track and respect meeting time limits. Gently guide conversations back to the agenda.',
    category: 'Facilitation',
    icon: '⏰',
    trigger: 'When meeting exceeds scheduled time',
    meetingStage: ['active', 'ending']
  },
  {
    id: 'c3',
    title: 'Encourage Participation',
    content: 'Invite quieter team members to share their thoughts. Use phrases like "What do you think?" to engage everyone.',
    category: 'Engagement',
    icon: '🗣️',
    trigger: 'When some participants haven\'t spoken',
    meetingStage: ['active']
  },
  {
    id: 'c4',
    title: 'Summarize Key Points',
    content: 'Periodically recap what\'s been discussed to ensure alignment and help participants stay focused.',
    category: 'Clarity',
    icon: '📝',
    trigger: 'Every 15 minutes in long meetings',
    meetingStage: ['active', 'ending']
  },
  {
    id: 'c5',
    title: 'Handle Conflicts',
    content: 'When disagreements arise, acknowledge different viewpoints and guide toward finding common ground.',
    category: 'Conflict Resolution',
    icon: '🤝',
    trigger: 'When tension is detected in conversation',
    meetingStage: ['active']
  },
  {
    id: 'c6',
    title: 'Action Items',
    content: 'Clearly define next steps, assign owners, and set deadlines before ending the meeting.',
    category: 'Follow-up',
    icon: '📋',
    trigger: 'Near end of meeting',
    meetingStage: ['ending']
  }
];

// AI Suggestions
export const mockAISuggestions: AISuggestion[] = [
  {
    id: 's1',
    type: 'reminder',
    title: 'Break Suggestion',
    description: 'Meeting has been running for 45 minutes. Consider a 5-minute break.',
    priority: 'medium',
    timestamp: new Date()
  },
  {
    id: 's2',
    type: 'insight',
    title: 'Engagement Alert',
    description: '3 participants haven\'t spoken yet. Consider using a round-robin format.',
    priority: 'high',
    timestamp: new Date()
  },
  {
    id: 's3',
    type: 'action',
    title: 'Record Action Items',
    description: 'Several tasks were mentioned. Would you like to create action items?',
    priority: 'high',
    timestamp: new Date()
  },
  {
    id: 's4',
    type: 'warning',
    title: 'Time Alert',
    description: 'Meeting scheduled to end in 5 minutes. Consider wrapping up.',
    priority: 'high',
    timestamp: new Date()
  }
];

// Helper functions
export const getQuestionsForMeeting = (meetingType: string, stage: string): Question[] => {
  return mockQuestions.filter(q => 
    q.meetingTypes.includes(meetingType) && 
    (q.timing === stage || q.timing === 'any')
  );
};

export const getCuesForStage = (stage: string): Cue[] => {
  return mockCues.filter(c => c.meetingStage.includes(stage));
};

export const generateMeetingContext = (platform: 'zoom' | 'teams' | 'meet'): MeetingContext => {
  const scenarios = mockMeetingScenarios.filter(s => s.platform === platform);
  return scenarios[Math.floor(Math.random() * scenarios.length)] || mockMeetingScenarios[0];
};

// Simulate platform-specific features
export const getPlatformFeatures = (platform: string) => {
  switch (platform) {
    case 'zoom':
      return {
        canGetParticipants: true,
        canDetectScreenShare: true,
        canAccessRecording: true,
        canGetMeetingInfo: true,
        supportsBreakoutRooms: true
      };
    case 'teams':
      return {
        canGetParticipants: true,
        canDetectScreenShare: true,
        canAccessCalendar: true,
        canGetMeetingTitle: true,
        supportsChannelIntegration: true
      };
    case 'meet':
      return {
        canGetParticipants: false,
        canDetectScreenShare: false,
        canAccessCalendar: true,
        canGetMeetingInfo: true,
        supportsGoogleWorkspace: true
      };
    default:
      return {};
  }
}; 