import { useEffect } from 'react';
import zoomSdk from '@zoom/appssdk';
import SuggestionPanel from '../components/SuggestionPanel';

export default function ZoomApp() {
  useEffect(() => {
    zoomSdk.config({ capabilities: ['getMeetingContext'] });
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Live Meeting Assistant</h2>
      <SuggestionPanel />
    </div>
  );
} 