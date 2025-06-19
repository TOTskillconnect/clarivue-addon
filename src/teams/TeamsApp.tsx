import { useEffect, useState } from 'react';
import * as microsoftTeams from '@microsoft/teams-js';
import SidePanelLayout from '../components/SidePanelLayout';
import CompactSuggestionPanel from '../components/CompactSuggestionPanel';

export default function TeamsApp() {
  const [meetingInfo, setMeetingInfo] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    microsoftTeams.app.initialize().then(() => {
      setIsConnected(true);
      console.log('Teams initialized');
      
      // Simulate getting Teams context
      setTimeout(() => {
        setMeetingInfo({
          meetingId: 'teams-meeting-456',
          chatId: 'team-chat-789',
          userRole: 'organizer',
          meetingType: 'Scheduled',
          participantCount: 8,
          isHost: true
        });
      }, 1000);
    }).catch(error => {
      console.error('Teams initialization failed:', error);
      // For demo purposes, still show connected state
      setTimeout(() => {
        setIsConnected(true);
        setMeetingInfo({
          meetingId: 'teams-demo-456',
          participantCount: 8,
          isHost: true
        });
      }, 1000);
    });
  }, []);

  return (
    <SidePanelLayout 
      platform="teams" 
      isConnected={isConnected} 
      meetingInfo={meetingInfo}
    >
      <CompactSuggestionPanel platform="teams" />
    </SidePanelLayout>
  );
} 