import { useEffect, useState, useCallback } from 'react';
import zoomSdk from '@zoom/appssdk';
import SidePanelLayout from '../components/SidePanelLayout';
import SimplifiedSuggestionPanel from '../components/SimplifiedSuggestionPanel';

export default function ZoomApp() {
  const [meetingInfo, setMeetingInfo] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [zoomClient, setZoomClient] = useState<any>(null);
  
  const cleanup = useCallback(() => {
    if (zoomClient) {
      // Remove event listeners if needed
      console.log('Cleaning up Zoom SDK listeners');
    }
  }, [zoomClient]);
  
  useEffect(() => {
    // Initialize Zoom Apps SDK
    const initializeZoomApp = async () => {
      try {
        const configResponse = await zoomSdk.config({
          version: '0.16',
          capabilities: [
            'getMeetingContext',
            'getMeetingParticipants', 
            'getMeetingJoinUrl',
            'getUserContext',
            'showNotification',
            'onMeetingConfigChanged',
            'onActiveSpeakerChange'
          ]
        });
        
        console.log('Zoom SDK configured:', configResponse);
        setZoomClient(zoomSdk);
        setIsConnected(true);
        
        // Get meeting context
        const meetingContext = await zoomSdk.getMeetingContext();
        console.log('Meeting context:', meetingContext);
        
        // Get participant info
        const participants = await zoomSdk.getMeetingParticipants();
        console.log('Participants:', participants);
        
        // Get user context for role info
        const userContext = await zoomSdk.getUserContext();
        console.log('User context:', userContext);
        
        setMeetingInfo({
          meetingID: meetingContext.meetingID || 'zoom-meeting-123',
          meetingTopic: meetingContext.meetingTopic || 'Zoom Meeting',
          participantCount: participants?.participants?.length || 6,
          isHost: userContext.role === 'host',
          clientVersion: configResponse.clientVersion,
          runningContext: configResponse.runningContext,
          participantUUID: userContext.participantUUID
        });
        
        // Listen for meeting events
        zoomSdk.onMeetingConfigChanged((event: any) => {
          console.log('Meeting config changed:', event);
        });
        
        zoomSdk.onActiveSpeakerChange((event: any) => {
          console.log('Active speaker changed:', event);
        });
        
      } catch (error) {
        console.error('Failed to initialize Zoom Apps SDK:', error);
        // For demo purposes, still show connected state
        setTimeout(() => {
          setIsConnected(true);
          setMeetingInfo({
            meetingUUID: 'zoom-demo-123',
            meetingNumber: 'demo-meeting',
            participantCount: 6,
            isHost: false,
            error: 'Demo mode - SDK not available'
          });
        }, 1000);
      }
    };

    initializeZoomApp();
    
    // Cleanup function
    return cleanup;
  }, [cleanup]);

  return (
    <SidePanelLayout 
      platform="zoom" 
      isConnected={isConnected} 
      meetingInfo={meetingInfo}
    >
      <SimplifiedSuggestionPanel platform="zoom" />
    </SidePanelLayout>
  );
} 