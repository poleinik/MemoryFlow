import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="brain" aria-hidden="true">
	<path d="M12 18V5"></path>
	<path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"></path>
	<path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"></path>
	<path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"></path>
	<path d="M18 18a4 4 0 0 0 2-7.464"></path>
	<path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"></path>
	<path d="M6 18a4 4 0 0 1-2-7.464"></path>
	<path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"></path>
</svg>
`;

type Props = {
  width?: number | string;
  height?: number | string;
  color?: string;
};

export default function BrainIcon({
  width = 24,
  height = 24,
  color = 'currentColor',
}: Props) {
  const svg = xml.replace(/currentColor/g, color);
  return <SvgXml xml={svg} width={width} height={height} />;
}
