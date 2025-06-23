import React from 'react';
import { Card, Typography, Badge, Space, Divider } from 'antd';
import ToneIndicator from './ToneIndicator';

const { Text } = Typography;

interface SidePanelLayoutProps {
  children: React.ReactNode;
  platform: 'zoom' | 'teams' | 'meet';
  isConnected: boolean;
  meetingInfo?: any;
}

const platformConfig = {
  zoom: { icon: '📹', name: 'Zoom', color: '#2D8CFF' },
  teams: { icon: '💼', name: 'Teams', color: '#6264A7' },
  meet: { icon: '🎥', name: 'Meet', color: '#0F9D58' }
};

export default function SidePanelLayout({ 
  children, 
  platform, 
  isConnected, 
  meetingInfo 
}: SidePanelLayoutProps) {
  const config = platformConfig[platform];
  
  return (
    <div style={{ 
      width: '350px',
      height: '100vh',
      backgroundColor: '#ffffff',
      borderLeft: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header with Clarivue Branding */}
      <div style={{ 
        padding: '16px 20px 12px 20px',
        borderBottom: '1px solid #EDF2F7',
        backgroundColor: '#F7FAFC'
      }}>
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          {/* Official Clarivue Logo */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <img 
              src="/clarivue-logo-new.png" 
              alt="Clarivue" 
              style={{
                height: 20,
                width: 'auto',
                marginRight: 8
              }}
            />
            <Badge 
              status={isConnected ? 'success' : 'error'} 
              size="small"
              style={{ marginLeft: 4 }}
            />
          </div>
          
          {/* Connection Info */}
          {meetingInfo && (
            <Text type="secondary" style={{ 
              fontSize: 11,
              color: '#718096'
            }}>
              {meetingInfo.participantCount || '6'} participants • {config.name}
            </Text>
          )}
        </Space>
        
        <Divider style={{ 
          margin: '12px 0 0 0',
          borderColor: '#E2E8F0'
        }} />
      </div>

      {/* Tone Indicator Section */}
      <div style={{ 
        padding: '16px 20px',
        borderBottom: '1px solid #EDF2F7',
        backgroundColor: '#F7FAFC'
      }}>
        <ToneIndicator />
      </div>

      {/* Scrollable Content - Questions & Cues Tabs */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        padding: '0'
      }}>
        {children}
      </div>
    </div>
  );
} 