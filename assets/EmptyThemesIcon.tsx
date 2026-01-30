import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

interface EmptyThemesIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function EmptyThemesIcon({ 
  width = 200, 
  height = 200,
  color = '#94A3B8' 
}: EmptyThemesIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 200" fill="none">
      {/* Стопка книг/карточек */}
      <G opacity="0.3">
        <Rect x="40" y="120" width="80" height="60" rx="4" fill={color} />
        <Rect x="45" y="110" width="80" height="60" rx="4" fill={color} opacity="0.6" />
        <Rect x="50" y="100" width="80" height="60" rx="4" fill={color} opacity="0.4" />
      </G>
      
      {/* Увеличительное стекло */}
      <G>
        <Circle cx="140" cy="80" r="30" stroke={color} strokeWidth="6" fill="none" />
        <Path 
          d="M 160 100 L 180 120" 
          stroke={color} 
          strokeWidth="6" 
          strokeLinecap="round"
        />
      </G>
      
      {/* Иконка "плюс" в центре стекла */}
      <Path 
        d="M 140 65 L 140 95 M 125 80 L 155 80" 
        stroke={color} 
        strokeWidth="4" 
        strokeLinecap="round"
        opacity="0.5"
      />
    </Svg>
  );
}
