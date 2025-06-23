import { useState } from 'react';
import { Select, Card, Space, Typography } from 'antd';
import ZoomApp from './zoom/ZoomApp';
import TeamsApp from './teams/TeamsApp';
import MeetApp from './meet/MeetApp';

const { Text } = Typography;

function App() {
  const path = window.location.pathname;
  const [selectedPlatform, setSelectedPlatform] = useState<string>('zoom');

  // Platform-specific routing for production
  if (path.includes('zoom')) return <ZoomApp />;
  if (path.includes('teams')) return <TeamsApp />;
  if (path.includes('meet')) return <MeetApp />;

  // Development mode: Show platform selector in a compact way
  const renderPlatformApp = () => {
    switch (selectedPlatform) {
      case 'zoom':
        return <ZoomApp />;
      case 'teams':
        return <TeamsApp />;
      case 'meet':
        return <MeetApp />;
      default:
        return <ZoomApp />;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      backgroundColor: '#F7FAFC' // gray.50 from Clarivue design system
    }}>
      {/* Mock video meeting area */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10
        }}>
          <Card 
            size="small" 
            style={{ 
              minWidth: 200,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid #EDF2F7' // gray.100
            }}
          >
            <Space direction="vertical" size={4}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src="/clarivue-logo-new.png" 
                  alt="Clarivue" 
                  style={{
                    height: 16,
                    width: 'auto',
                    marginRight: 8
                  }}
                />
                <Text strong style={{ color: '#1076D1' }}> {/* Primary blue */}
                  Demo
                </Text>
              </div>
              <Select
                value={selectedPlatform}
                onChange={setSelectedPlatform}
                style={{ width: '100%' }}
                size="small"
                options={[
                  { value: 'zoom', label: '📹 Zoom' },
                  { value: 'teams', label: '💼 Teams' },
                  { value: 'meet', label: '🎥 Meet' }
                ]}
              />
              <Text type="secondary" style={{ 
                fontSize: 11,
                color: '#718096' // gray.500 from design system
              }}>
                Side panel addon demo
              </Text>
            </Space>
          </Card>
        </div>
        
        {/* Mock video tiles */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 200px)',
          gap: 16,
          padding: 20
        }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ 
              width: 200,
              height: 150,
              backgroundColor: '#2D3748', // gray.700 from design system
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 12,
              border: '1px solid #4A5568' // gray.600
            }}>
              👤 Participant {i}
            </div>
          ))}
        </div>
      </div>
      
      {/* Side Panel */}
      {renderPlatformApp()}
    </div>
  );
}

export default App; 