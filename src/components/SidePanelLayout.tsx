import React from 'react';
import { Card, Typography, Badge, Space } from 'antd';

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
      backgroundColor: '#fff',
      borderLeft: '1px solid #e8e8e8',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Compact Header */}
      <div style={{ 
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fafafa'
      }}>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Space size={8}>
            <span style={{ fontSize: 16 }}>{config.icon}</span>
            <Text strong style={{ color: config.color }}>
              Clarivue
            </Text>
            <Badge 
              status={isConnected ? 'success' : 'error'} 
              size="small"
            />
          </Space>
          
          {meetingInfo && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              {meetingInfo.participantCount || '6'} participants • {platform}
            </Text>
          )}
        </Space>
      </div>

      {/* Scrollable Content */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        padding: '8px'
      }}>
        {children}
      </div>
    </div>
  );
} 