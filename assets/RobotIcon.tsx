import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64" fill="none">
  <!-- Antenna -->
  <circle cx="32" cy="6" r="3.5" fill="#f59e0b"/>
  <rect x="30.5" y="9" width="3" height="7" rx="1.5" fill="#94a3b8"/>

  <!-- Head -->
  <rect x="12" y="16" width="40" height="30" rx="12" fill="#3B82F6"/>
  <rect x="14" y="18" width="36" height="26" rx="10" fill="#60a5fa"/>

  <!-- Eyes -->
  <circle cx="24" cy="31" r="5.5" fill="white"/>
  <circle cx="40" cy="31" r="5.5" fill="white"/>
  <circle cx="25" cy="30" r="2.5" fill="#1e293b"/>
  <circle cx="41" cy="30" r="2.5" fill="#1e293b"/>
  <!-- Eye shine -->
  <circle cx="26.2" cy="28.8" r="1" fill="white"/>
  <circle cx="42.2" cy="28.8" r="1" fill="white"/>

  <!-- Smile -->
  <path d="M25 38 Q32 43 39 38" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>

  <!-- Ears -->
  <rect x="5" y="26" width="7" height="12" rx="3.5" fill="#3B82F6"/>
  <rect x="52" y="26" width="7" height="12" rx="3.5" fill="#3B82F6"/>

  <!-- Body -->
  <rect x="20" y="47" width="24" height="12" rx="6" fill="#3B82F6"/>
  <rect x="22" y="49" width="20" height="8" rx="4" fill="#60a5fa"/>
</svg>
`;

type Props = {
  width?: number | string;
  height?: number | string;
};

export default function RobotIcon({ width = 24, height = 24 }: Props) {
  return <SvgXml xml={xml} width={width} height={height} />;
}
