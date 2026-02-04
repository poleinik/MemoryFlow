import React from 'react'
import { SvgXml } from 'react-native-svg'

const xml = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2"></rect><line x1="8" x2="16" y1="6" y2="6"></line><line x1="16" x2="16" y1="14" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>
`

type Props = {
    width?: number | string
    height?: number | string
    color?: string
}

export default function CalculatorIcon({ width = 24, height = 24, color = 'currentColor' }: Props) {
    const svg = xml.replace(/currentColor/g, color)
    return <SvgXml xml={svg} width={width} height={height} />
}