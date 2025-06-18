import { useEffect } from 'react';
import * as microsoftTeams from '@microsoft/teams-js';
import SuggestionPanel from '../components/SuggestionPanel';

export default function TeamsApp() {
  useEffect(() => {
    microsoftTeams.app.initialize().then(() => {
      console.log('Teams initialized');
    });
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Live Meeting Assistant</h2>
      <SuggestionPanel />
    </div>
  );
} 