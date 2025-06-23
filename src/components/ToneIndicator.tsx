import React, { useState, useEffect } from 'react';
import { Typography, Space } from 'antd';

const { Text } = Typography;

// Mock tone data - in real implementation, this would come from audio analysis
interface ToneData {
  tone: 'confident' | 'neutral' | 'anxious' | 'positive' | 'tense';
  intensity: number; // 0-100
  timestamp: number;
}

// Updated toneConfig using Clarivue color design system
const toneConfig = {
  confident: { 
    label: 'Confident', 
    color: '#1076D1', // Primary blue from design system
    description: 'Speaker sounds assured and clear'
  },
  neutral: { 
    label: 'Neutral', 
    color: '#718096', // Gray.500 from design system
    description: 'Balanced tone'
  },
  anxious: { 
    label: 'Anxious', 
    color: '#ED8936', // Orange warning color
    description: 'Some tension detected'
  },
  positive: { 
    label: 'Positive', 
    color: '#38A169', // Green success color
    description: 'Enthusiastic and engaged'
  },
  tense: { 
    label: 'Tense', 
    color: '#E53E3E', // Red error color
    description: 'High stress detected'
  }
};

export default function ToneIndicator() {
  const [currentTone, setCurrentTone] = useState<ToneData>({
    tone: 'neutral',
    intensity: 65,
    timestamp: Date.now()
  });

  // Simulate real-time tone updates
  useEffect(() => {
    const interval = setInterval(() => {
      const tones: (keyof typeof toneConfig)[] = ['confident', 'neutral', 'anxious', 'positive', 'tense'];
      const randomTone = tones[Math.floor(Math.random() * tones.length)];
      const randomIntensity = Math.floor(Math.random() * 40) + 30; // 30-70 range
      
      setCurrentTone({
        tone: randomTone,
        intensity: randomIntensity,
        timestamp: Date.now()
      });
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const config = toneConfig[currentTone.tone];
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (currentTone.intensity / 100) * circumference;

  return (
    <div style={{ textAlign: 'center' }}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        {/* Circular Tone Ring */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#EDF2F7"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={config.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.3s ease'
              }}
            />
          </svg>
          
          {/* Center content */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '18px',
              marginBottom: '2px'
            }}>
              🎤
            </div>
            <Text style={{ 
              fontSize: '10px', 
              color: config.color,
              fontWeight: 600
            }}>
              {currentTone.intensity}%
            </Text>
          </div>
        </div>

        {/* Tone Label and Description */}
        <div>
          <Text strong style={{ 
            color: config.color,
            fontSize: 13,
            display: 'block'
          }}>
            {config.label}
          </Text>
          <Text type="secondary" style={{ 
            fontSize: 11,
            lineHeight: 1.3,
            color: '#4A5568' // gray.600 from design system
          }}>
            {config.description}
          </Text>
        </div>

        {/* Live indicator */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 4
        }}>
          <div style={{
            width: 6,
            height: 6,
            backgroundColor: '#E53E3E', // Red error color from design system
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }} />
          <Text type="secondary" style={{ 
            fontSize: 10,
            color: '#718096' // gray.500
          }}>
            LIVE ANALYSIS
          </Text>
        </div>
      </Space>

      <style>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
} 