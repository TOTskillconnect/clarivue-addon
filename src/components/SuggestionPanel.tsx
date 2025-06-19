import React, { useState, useEffect } from 'react';
import { Tabs, Card, Button, Space, Badge, Tooltip, Select, Alert, Typography } from 'antd';
import { 
  QuestionCircleOutlined, 
  BulbOutlined, 
  RobotOutlined,
  CopyOutlined,
  HeartOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons';
import QuestionCard from './QuestionCard';
import CueCard from './CueCard';
import { 
  generateMeetingContext, 
  getQuestionsForMeeting, 
  getCuesForStage, 
  mockAISuggestions,
  MeetingContext,
  Question,
  Cue,
  AISuggestion
} from '../utils/mockData';

const { TabPane } = Tabs;
const { Text } = Typography;

interface SuggestionPanelProps {
  platform?: 'zoom' | 'teams' | 'meet';
}

export default function SuggestionPanel({ platform = 'zoom' }: SuggestionPanelProps) {
  const [meetingContext, setMeetingContext] = useState<MeetingContext | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [cues, setCues] = useState<Cue[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [meetingStage, setMeetingStage] = useState<'start' | 'middle' | 'end'>('start');

  // Simulate meeting context loading
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      const context = generateMeetingContext(platform);
      setMeetingContext(context);
      
      // Load questions based on meeting type and stage
      const relevantQuestions = getQuestionsForMeeting(context.type, meetingStage);
      setQuestions(relevantQuestions);
      
      // Load cues based on meeting stage
      const relevantCues = getCuesForStage(context.stage);
      setCues(relevantCues);
      
      // Load AI suggestions
      setSuggestions(mockAISuggestions.slice(0, 3));
      
      setLoading(false);
    }, 1000);
  }, [platform, meetingStage]);

  const handleCopyQuestion = (question: string) => {
    navigator.clipboard.writeText(question);
    // You could add a toast notification here
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleRefreshScenario = () => {
    setLoading(true);
    setTimeout(() => {
      const newContext = generateMeetingContext(platform);
      setMeetingContext(newContext);
      setLoading(false);
    }, 500);
  };

  const getMeetingStageColor = (stage: string) => {
    switch (stage) {
      case 'waiting': return 'default';
      case 'starting': return 'processing';
      case 'active': return 'success';
      case 'ending': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Card loading style={{ minHeight: 400 }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Text type="secondary">Loading meeting context...</Text>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Meeting Context Header */}
      {meetingContext && (
        <Card 
          size="small" 
          style={{ marginBottom: 16 }}
          title={
            <Space>
              <span>📊 Meeting Context</span>
              <Badge 
                status={getMeetingStageColor(meetingContext.stage)} 
                text={meetingContext.stage.toUpperCase()} 
              />
            </Space>
          }
          extra={
            <Space>
              <Select
                size="small"
                value={meetingStage}
                onChange={setMeetingStage}
                options={[
                  { value: 'start', label: '🚀 Start' },
                  { value: 'middle', label: '⚡ Middle' },
                  { value: 'end', label: '🏁 End' }
                ]}
              />
              <Tooltip title="Generate new scenario">
                <Button 
                  size="small" 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefreshScenario}
                />
              </Tooltip>
            </Space>
          }
        >
          <Space wrap>
            <Text><strong>{meetingContext.title}</strong></Text>
            <Text type="secondary">•</Text>
            <Text type="secondary">{meetingContext.participantCount} participants</Text>
            <Text type="secondary">•</Text>
            <Text type="secondary">{meetingContext.duration} min</Text>
            {meetingContext.isRecording && <Badge status="error" text="Recording" />}
            {meetingContext.isScreenSharing && <Badge status="processing" text="Screen Sharing" />}
          </Space>
        </Card>
      )}

      {/* Alert for demo mode */}
      <Alert
        message="Demo Mode"
        description="This is a simulated meeting environment. All data and AI suggestions are for demonstration purposes."
        type="info"
        showIcon
        closable
        style={{ marginBottom: 16 }}
      />

      {/* Main Tabs */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: '1',
            label: (
              <Space>
                <QuestionCircleOutlined />
                Questions
                <Badge count={questions.length} size="small" />
              </Space>
            ),
            children: (
              <div>
                <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                  <Text type="secondary">
                    Smart questions for {meetingContext?.type} meetings
                  </Text>
                  <Button size="small" icon={<SettingOutlined />}>
                    Customize
                  </Button>
                </Space>
                
                {questions.length > 0 ? (
                  questions.map(question => (
                    <QuestionCard 
                      key={question.id}
                      question={question}
                      onCopy={handleCopyQuestion}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.includes(question.id)}
                    />
                  ))
                ) : (
                  <Card style={{ textAlign: 'center', padding: 40 }}>
                    <Text type="secondary">No questions available for this stage</Text>
                  </Card>
                )}
              </div>
            )
          },
          {
            key: '2',
            label: (
              <Space>
                <BulbOutlined />
                Cues
                <Badge count={cues.length} size="small" />
              </Space>
            ),
            children: (
              <div>
                <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                  <Text type="secondary">
                    Conversation cues for better facilitation
                  </Text>
                </Space>
                
                {cues.map(cue => (
                  <CueCard 
                    key={cue.id}
                    cue={cue}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.includes(cue.id)}
                  />
                ))}
              </div>
            )
          },
          {
            key: '3',
            label: (
              <Space>
                <RobotOutlined />
                AI Insights
                <Badge count={suggestions.length} size="small" status="processing" />
              </Space>
            ),
            children: (
              <div>
                <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                  <Text type="secondary">
                    Real-time AI-powered meeting insights
                  </Text>
                </Space>
                
                {suggestions.map(suggestion => (
                  <Card 
                    key={suggestion.id}
                    size="small"
                    style={{ marginBottom: 12 }}
                    type={suggestion.priority === 'high' ? 'inner' : undefined}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        <Badge 
                          status={suggestion.priority === 'high' ? 'error' : 'processing'} 
                        />
                        <Text strong>{suggestion.title}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {suggestion.type}
                        </Text>
                      </Space>
                      <Text>{suggestion.description}</Text>
                      <Space>
                        <Button size="small" type="primary">
                          Apply
                        </Button>
                        <Button size="small">
                          Dismiss
                        </Button>
                      </Space>
                    </Space>
                  </Card>
                ))}
                
                <Card style={{ textAlign: 'center', padding: 20, marginTop: 16 }}>
                  <Text type="secondary">
                    🧠 AI is analyzing meeting patterns...
                  </Text>
                </Card>
              </div>
            )
          }
        ]}
      />
    </div>
  );
} 