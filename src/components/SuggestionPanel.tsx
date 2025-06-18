import { Tabs } from 'antd';
import QuestionCard from './QuestionCard';
import CueCard from './CueCard';

const { TabPane } = Tabs;

export default function SuggestionPanel() {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Questions" key="1">
        <QuestionCard question="What are the main challenges?" />
        <QuestionCard question="Discuss the timeline next" />
      </TabPane>
      <TabPane tab="Suggestions" key="2">
        <div style={{ padding: 16 }}>
          <p>AI-powered suggestions coming soon...</p>
        </div>
      </TabPane>
      <TabPane tab="Cues" key="3">
        <CueCard 
          title="Active Listening" 
          content="Focus on understanding before responding. Ask clarifying questions." 
        />
        <CueCard 
          title="Time Management" 
          content="Keep discussions on track and respect meeting time limits." 
        />
      </TabPane>
    </Tabs>
  );
} 