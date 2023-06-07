import { useState, useEffect, useContext } from 'react'

import { GlobalContext, DatapointType } from '@/GlobalContext.tsx'

interface PropsType {
    dimensions: {width: number, height: number},
    xScale: any,
    xField: keyof DatapointType,
}

interface HighlightRectType {
    x: number,
    y: number,
    width: number,
    height: number,
    display: string,
    fill?: string,
}

export default function HighlightRect({dimensions, xScale, xField}:PropsType):JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { highlightRange, datapoints } = globalContext.strava

    const [highlightRect, setHighlightRect] = useState<HighlightRectType>({
        x: 10, y: 10, width: 10, height: 10,
        display: 'none'
    })

    useEffect(() => {
        if (datapoints === null) return
        if (highlightRange === null) {
            setHighlightRect((prev) => {return {...prev, display: 'none'}})
            return
        }
        const [startIdx, endIdx] = highlightRange
        if (endIdx === null) return
        const start = datapoints[Math.min(startIdx, endIdx)]
        const end = datapoints[Math.max(startIdx, endIdx)]
        if (start == null || end == null) return
        const xStart = xScale(start[xField])
        const xEnd = xScale(end[xField])
        const xMin = Math.min(xStart, xEnd)
        const xMax = Math.max(xStart, xEnd)
        setHighlightRect({
            x: xMin,
            y: 0,
            width: xMax - xMin,
            height: dimensions.height,
            display: 'block',
            fill: 'rgba(197,197,197,0.1)'
        })
    }, [highlightRange, xScale, xField, dimensions, datapoints])

    return <>
        <rect {...highlightRect} />
    </>
}
