import React, { useState, useEffect } from 'react';
import { Tabs, Card, Button, Space, Badge, Typography, Tooltip, Alert } from 'antd';
import { 
  QuestionCircleOutlined, 
  BulbOutlined, 
  RobotOutlined,
  CopyOutlined,
  HeartOutlined,
  ReloadOutlined,
  WifiOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import { 
  generateMeetingContext, 
  Question,
  Cue
} from '../utils/mockData';
import { useRealTimeAPI } from '../hooks/useRealTimeAPI';

const { Text } = Typography;

interface CompactSuggestionPanelProps {
  platform: 'zoom' | 'teams' | 'meet';
}

export default function CompactSuggestionPanel({ 
  platform 
}: CompactSuggestionPanelProps) {
  const [meetingContext, setMeetingContext] = useState(generateMeetingContext(platform));
  const [activeTab, setActiveTab] = useState('1');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Use real-time API hook
  const {
    questions,
    cues,
    aiSuggestions,
    meetingStage,
    isConnected,
    isLoading,
    error,
    connectionStatus,
    sendUserInteraction,
    reconnect
  } = useRealTimeAPI({ 
    meetingContext,
    fallbackToMockData: true 
  });

  useEffect(() => {
    setMeetingContext(generateMeetingContext(platform));
  }, [platform]);

  const handleCopyQuestion = async (question: Question) => {
    navigator.clipboard.writeText(question.text);
    await sendUserInteraction({
      type: 'question_copied',
      itemId: question.id,
      metadata: { text: question.text, category: question.category }
    });
  };

  const handleApplyCue = async (cue: Cue) => {
    await sendUserInteraction({
      type: 'cue_applied',
      itemId: cue.id,
      metadata: { title: cue.title, category: cue.category }
    });
  };

  const handleUseAISuggestion = async (suggestionId: string) => {
    await sendUserInteraction({
      type: 'ai_suggestion_used',
      itemId: suggestionId
    });
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const renderConnectionStatus = () => {
    if (isLoading) {
      return (
        <Alert
          message="Connecting to AI backend..."
          type="info"
          showIcon
          style={{ margin: '4px 0', fontSize: 12 }}
        />
      );
    }

    if (error) {
      return (
        <Alert
          message={error}
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={reconnect} icon={<ReloadOutlined />}>
              Retry
            </Button>
          }
          style={{ margin: '4px 0', fontSize: 12 }}
        />
      );
    }

    return (
      <div style={{ padding: '4px 8px', fontSize: 10, color: '#666' }}>
        {isConnected ? (
          <Space size={4}>
            <WifiOutlined style={{ color: '#52c41a' }} />
            <Text style={{ fontSize: 10 }}>AI Connected</Text>
          </Space>
        ) : (
          <Space size={4}>
            <DisconnectOutlined style={{ color: '#ff4d4f' }} />
            <Text style={{ fontSize: 10 }}>Using Demo Data</Text>
          </Space>
        )}
      </div>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {renderConnectionStatus()}
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="small"
        style={{ flex: 1 }}
        items={[
          {
            key: '1',
            label: (
              <Space size={4}>
                <QuestionCircleOutlined />
                <span>Questions</span>
                <Badge count={questions.length} size="small" />
              </Space>
            ),
            children: (
              <div style={{ padding: '0 4px', height: 'calc(100vh - 180px)', overflow: 'auto' }}>
                {questions.slice(0, 4).map(question => (
                  <Card 
                    key={question.id}
                    size="small"
                    style={{ 
                      marginBottom: 8, 
                      fontSize: 12,
                      border: favorites.includes(question.id) ? '2px solid #ff4d4f' : undefined
                    }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 13, fontWeight: 500 }}>
                          {question.icon} {question.text}
                        </Text>
                        <Space size={4}>
                          <Tooltip title="Copy">
                            <Button
                              type="text"
                              size="small"
                              icon={<CopyOutlined style={{ fontSize: 10 }} />}
                              onClick={() => handleCopyQuestion(question)}
                              style={{ padding: 2 }}
                            />
                          </Tooltip>
                          <Tooltip title="Favorite">
                            <Button
                              type="text"
                              size="small"
                              icon={<HeartOutlined style={{ 
                                fontSize: 10,
                                color: favorites.includes(question.id) ? '#ff4d4f' : undefined
                              }} />}
                              onClick={() => handleToggleFavorite(question.id)}
                              style={{ padding: 2 }}
                            />
                          </Tooltip>
                        </Space>
                      </Space>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {question.category} • {question.priority}
                      </Text>
                    </Space>
                  </Card>
                ))}
              </div>
            )
          },
          {
            key: '2',
            label: (
              <Space size={4}>
                <BulbOutlined />
                <span>Cues</span>
                <Badge count={cues.length} size="small" />
              </Space>
            ),
            children: (
              <div style={{ padding: '0 4px', height: 'calc(100vh - 180px)', overflow: 'auto' }}>
                {cues.slice(0, 3).map(cue => (
                  <Card 
                    key={cue.id}
                    size="small"
                    style={{ marginBottom: 8 }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Space>
                        <span style={{ fontSize: 14 }}>{cue.icon}</span>
                        <Text strong style={{ fontSize: 13 }}>{cue.title}</Text>
                      </Space>
                      <Text style={{ fontSize: 12 }}>{cue.content}</Text>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: 10 }}>
                          {cue.category}
                        </Text>
                        <Button 
                          size="small" 
                          type="link" 
                          style={{ fontSize: 10, padding: 0 }}
                          onClick={() => handleApplyCue(cue)}
                        >
                          Apply
                        </Button>
                      </Space>
                    </Space>
                  </Card>
                ))}
              </div>
            )
          },
          {
            key: '3',
            label: (
              <Space size={4}>
                <RobotOutlined />
                <span>AI</span>
                <Badge 
                  count={aiSuggestions.length} 
                  size="small" 
                  status={isConnected ? "processing" : "default"} 
                />
              </Space>
            ),
            children: (
              <div style={{ padding: '0 4px', height: 'calc(100vh - 180px)', overflow: 'auto' }}>
                {aiSuggestions.slice(0, 2).map(suggestion => (
                  <Card 
                    key={suggestion.id}
                    size="small"
                    style={{ marginBottom: 8 }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Space>
                        <Badge status={suggestion.priority === 'high' ? 'error' : 'processing'} />
                        <Text strong style={{ fontSize: 12 }}>{suggestion.title}</Text>
                      </Space>
                      <Text style={{ fontSize: 11 }}>{suggestion.description}</Text>
                      <Button 
                        size="small" 
                        type="primary" 
                        style={{ fontSize: 10, height: 24 }}
                        onClick={() => handleUseAISuggestion(suggestion.id)}
                      >
                        Apply
                      </Button>
                    </Space>
                  </Card>
                ))}
                
                <Card style={{ textAlign: 'center', marginTop: 12 }} bodyStyle={{ padding: 16 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {isConnected ? '🧠 AI analyzing meeting...' : '📝 Demo suggestions'}
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