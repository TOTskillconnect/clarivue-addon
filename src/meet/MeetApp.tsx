import { useEffect } from 'react';
import SuggestionPanel from '../components/SuggestionPanel';

export default function MeetApp() {
  useEffect(() => {
    // Initialize Google Meet integration
    if (typeof google !== 'undefined' && google.apps) {
      google.apps.script.run
        .withSuccessHandler((result: any) => {
          console.log('Meet initialized:', result);
        })
        .withFailureHandler((error: any) => {
          console.error('Failed to initialize Meet:', error);
        })
        .getMeetingInfo();
    }
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Meet Assistant</h2>
      <SuggestionPanel />
    </div>
  );
} 