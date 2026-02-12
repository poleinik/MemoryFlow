import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
`;

type Props = {
  width?: number | string;
  height?: number | string;
  color?: string;
};

export default function ArrowBackIcon({
  width = 24,
  height = 24,
  color = 'currentColor',
}: Props) {
  const svg = xml.replace(/currentColor/g, color);
  return <SvgXml xml={svg} width={width} height={height} />;
}
