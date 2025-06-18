import ZoomApp from './zoom/ZoomApp';
import TeamsApp from './teams/TeamsApp';

function App() {
  const path = window.location.pathname;

  if (path.includes('zoom')) return <ZoomApp />;
  if (path.includes('teams')) return <TeamsApp />;
  return <div>Unsupported platform</div>;
}

export default App; 