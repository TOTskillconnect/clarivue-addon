import { Card } from 'antd';

interface QuestionCardProps {
  question: string;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Card style={{ marginBottom: 12, borderRadius: 8 }}>
      {question}
    </Card>
  );
} 