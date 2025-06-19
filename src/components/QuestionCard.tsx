import { Card, Button, Space, Tag, Tooltip } from 'antd';
import { CopyOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Question } from '../utils/mockData';

interface QuestionCardProps {
  question: Question;
  onCopy?: (text: string) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export default function QuestionCard({ 
  question, 
  onCopy, 
  onToggleFavorite, 
  isFavorite = false 
}: QuestionCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'default';
    }
  };

  return (
    <Card 
      size="small"
      style={{ 
        marginBottom: 12, 
        borderRadius: 8,
        border: isFavorite ? '2px solid #ff4d4f' : undefined
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <span style={{ fontSize: 16 }}>{question.icon}</span>
            <span style={{ fontWeight: 500 }}>{question.text}</span>
          </Space>
          <Space>
            {onToggleFavorite && (
              <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                <Button
                  type="text"
                  size="small"
                  icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                  onClick={() => onToggleFavorite(question.id)}
                />
              </Tooltip>
            )}
            {onCopy && (
              <Tooltip title="Copy question">
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => onCopy(question.text)}
                />
              </Tooltip>
            )}
          </Space>
        </Space>
        
        <Space>
          <Tag color={getPriorityColor(question.priority)}>
            {question.priority}
          </Tag>
          <Tag>{question.category}</Tag>
          <Tag color="blue">{question.timing}</Tag>
        </Space>
      </Space>
    </Card>
  );
} 