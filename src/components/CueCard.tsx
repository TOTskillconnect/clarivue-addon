import { Card, Button, Space, Tag, Tooltip, Typography } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Cue } from '../utils/mockData';

const { Text } = Typography;

interface CueCardProps {
  cue: Cue;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export default function CueCard({ 
  cue, 
  onToggleFavorite, 
  isFavorite = false 
}: CueCardProps) {
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
            <span style={{ fontSize: 16 }}>{cue.icon}</span>
            <Text strong>{cue.title}</Text>
          </Space>
          {onToggleFavorite && (
            <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
              <Button
                type="text"
                size="small"
                icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                onClick={() => onToggleFavorite(cue.id)}
              />
            </Tooltip>
          )}
        </Space>
        
        <Text>{cue.content}</Text>
        
        <Space wrap>
          <Tag color="blue">{cue.category}</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {cue.trigger}
          </Text>
        </Space>
      </Space>
    </Card>
  );
} 