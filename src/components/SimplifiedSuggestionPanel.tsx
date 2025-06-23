import React, { useState, useEffect } from 'react';
import { Tabs, Badge, Button, Space, Typography } from 'antd';
import { 
  QuestionCircleOutlined, 
  BulbOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import QuestionCard from './QuestionCard';
import CueCard from './CueCard';
import { 
  getQuestionsForMeeting, 
  getCuesForStage, 
  Question,
  Cue
} from '../utils/mockData';

const { Text } = Typography;

interface SimplifiedSuggestionPanelProps {
  platform?: 'zoom' | 'teams' | 'meet';
}

export default function SimplifiedSuggestionPanel({ platform = 'meet' }: SimplifiedSuggestionPanelProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [cues, setCues] = useState<Cue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load data
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      // Load questions for current meeting context
      const relevantQuestions = getQuestionsForMeeting('standup', 'middle');
      setQuestions(relevantQuestions.slice(0, 4)); // Limit to 4 for cleaner UI
      
      // Load conversation cues
      const relevantCues = getCuesForStage('active');
      setCues(relevantCues.slice(0, 3)); // Limit to 3 for cleaner UI
      
      setLoading(false);
    }, 800);
  }, [platform]);

  const handleCopyQuestion = (question: string) => {
    navigator.clipboard.writeText(question);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // Shuffle and reload content
      const refreshedQuestions = getQuestionsForMeeting('team-sync', 'middle');
      setQuestions(refreshedQuestions.slice(0, 4));
      
      const refreshedCues = getCuesForStage('active');
      setCues(refreshedCues.slice(0, 3));
      
      setLoading(false);
    }, 500);
  };

  const tabItems = [
    {
      key: 'questions',
      label: (
        <Space size={4}>
          <QuestionCircleOutlined style={{ color: '#1076D1' }} />
          <span>Questions</span>
          <Badge count={questions.length} size="small" />
        </Space>
      ),
      children: (
        <div style={{ padding: '16px' }}>
          <Space style={{ 
            marginBottom: 12, 
            width: '100%', 
            justifyContent: 'space-between' 
          }}>
            <Text type="secondary" style={{ 
              fontSize: 12,
              color: '#718096' // gray.500 from design system
            }}>
              Smart questions for your meeting
            </Text>
            <Button 
              size="small" 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={loading}
              style={{
                borderColor: '#1076D1',
                color: '#1076D1'
              }}
            />
          </Space>
          
          <div style={{ 
            maxHeight: 'calc(100vh - 320px)', 
            overflowY: 'auto',
            paddingRight: 4
          }}>
            {questions.length > 0 ? (
              questions.map(question => (
                <div key={question.id} style={{ marginBottom: 12 }}>
                  <QuestionCard 
                    question={question}
                    onCopy={handleCopyQuestion}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.includes(question.id)}
                  />
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: 32,
                color: '#A0AEC0' // gray.400 from design system
              }}>
                <Text type="secondary" style={{ color: '#A0AEC0' }}>No questions available</Text>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'cues',
      label: (
        <Space size={4}>
          <BulbOutlined style={{ color: '#5F9DF7' }} />
          <span>Cues</span>
          <Badge count={cues.length} size="small" />
        </Space>
      ),
      children: (
        <div style={{ padding: '16px' }}>
          <Space style={{ 
            marginBottom: 12, 
            width: '100%', 
            justifyContent: 'space-between' 
          }}>
            <Text type="secondary" style={{ 
              fontSize: 12,
              color: '#718096' // gray.500 from design system
            }}>
              Conversation tips for better meetings
            </Text>
            <Button 
              size="small" 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={loading}
              style={{
                borderColor: '#5F9DF7',
                color: '#5F9DF7'
              }}
            />
          </Space>
          
          <div style={{ 
            maxHeight: 'calc(100vh - 320px)', 
            overflowY: 'auto',
            paddingRight: 4
          }}>
            {cues.map(cue => (
              <div key={cue.id} style={{ marginBottom: 12 }}>
                <CueCard 
                  cue={cue}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(cue.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{ height: '100%' }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="small"
        style={{
          height: '100%'
        }}
        tabBarStyle={{
          marginBottom: 0,
          paddingLeft: 16,
          paddingRight: 16,
          borderBottom: '1px solid #EDF2F7' // gray.100 from design system
        }}
      />
    </div>
  );
} 