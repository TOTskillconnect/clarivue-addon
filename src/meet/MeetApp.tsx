import { useEffect, useState } from 'react';
import { meet } from '@googleworkspace/meet-addons/meet.addons';
import SidePanelLayout from '../components/SidePanelLayout';
import CompactSuggestionPanel from '../components/CompactSuggestionPanel';

export default function MeetApp() {
  const [meetingInfo, setMeetingInfo] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Initialize Google Meet Add-ons SDK
    const initializeMeetAddOn = async () => {
      try {
        const session = await meet.addon.createAddonSession({
          cloudProjectNumber: process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_NUMBER || 'your-project-number',
        });
        
        const client = await session.createSidePanelClient();
        setIsConnected(true);
        
        // Get meeting info from Meet SDK
        const meetingContext = await client.getMeetingInfo();
        setMeetingInfo({
          ...meetingContext,
          meetingCode: meetingContext.meetingCode || 'abc-defg-hij',
          participantCount: 5,
          isHost: false
        });
      } catch (error) {
        console.error('Failed to initialize Meet Add-on:', error);
        // For demo purposes, still show connected state
        setTimeout(() => {
          setIsConnected(true);
          setMeetingInfo({
            meetingCode: 'abc-defg-hij',
            meetingNumber: 'demo-meeting',
            participantCount: 5,
            isHost: false,
            error: 'Demo mode - SDK not available'
          });
        }, 1000);
      }
    };

    initializeMeetAddOn();
  }, []);

  return (
    <SidePanelLayout 
      platform="meet" 
      isConnected={isConnected} 
      meetingInfo={meetingInfo}
    >
      <CompactSuggestionPanel platform="meet" />
    </SidePanelLayout>
  );
} 