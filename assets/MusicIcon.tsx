import React from 'react'
import { SvgXml } from 'react-native-svg'

const xml = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>

`

type Props = {
    width?: number | string
    height?: number | string
    color?: string
}

export default function MusicIcon({ width = 24, height = 24, color = 'currentColor' }: Props) {
    const svg = xml.replace(/currentColor/g, color)
    return <SvgXml xml={svg} width={width} height={height} />
}