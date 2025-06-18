import { Card } from 'antd';

interface CueCardProps {
  title: string;
  content: string;
}

export default function CueCard({ title, content }: CueCardProps) {
  return (
    <Card style={{ marginBottom: 12, borderRadius: 8 }}>
      <h4>{title}</h4>
      <p>{content}</p>
    </Card>
  );
} 