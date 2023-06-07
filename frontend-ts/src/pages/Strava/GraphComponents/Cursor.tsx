import { useState, useEffect, useContext } from 'react'

import { GlobalContext, DatapointType } from '@/GlobalContext.tsx'

interface PropsType {
    data: Array<any>,
    xScale: any,
    xField: keyof DatapointType,
    yScale: any,
    yField: keyof DatapointType,
    color?: string,
}

export default function Cursor({data, xScale, xField, yScale, yField, ...props }:PropsType):JSX.Element{
    const globalContext = useContext(GlobalContext)
    const { cursor, datapoints } = globalContext.strava

    const [cursorCircle, setCursorCircle] = useState({
        cx: 0, cy: 0, r: 5,
        display: 'none',
        fill: props.color ?? 'red',
    })
    const [yValue, setYValue] = useState<number | null>(null)

    useEffect(() => {
        if (cursor == null || data.length == 0) {
            setCursorCircle((prev) => {return { ...prev, display: 'none' }})
            return
        }
        if (datapoints === null) return
        const idx = cursor
        const d = datapoints[idx]
        // Find element in data closest to cursor
        const p = data.reduce((acc, curr) => {
            const x = d[xField]
            if (acc == null) {
                if (x === undefined) return null
                return {
                    point: curr,
                    dist: Math.abs(curr[xField] - x)
                }
            }
            if (x === undefined) return acc
            const dist = Math.abs(curr[xField] - x)
            if (dist < acc.dist) {
                return {
                    point: curr,
                    dist
                }
            }
            return acc
        }, null).point
        if (p == null) return
        const x = xScale(p[xField])
        const y = yScale(p[yField])
        setCursorCircle({
            cx: x, cy: y, r: 5,
            display: 'block', fill: props.color ?? 'blue',
        })
        setYValue(p[yField])
    }, [cursor, data, datapoints, xScale, yScale, xField, yField])

    const textOffset:number = 10

    return <>
        <circle {...cursorCircle} style={{filter: 'brightness(110%) contrast(120%) hue-rotate(30deg)'}} />
        <text x={cursorCircle.cx ?? 0 + textOffset} y={cursorCircle.cy ?? 0 - textOffset} fontSize='heavy' textAnchor='middle'
            style={{
                'fill': 'white',
            }}
        >
            {yValue?.toFixed(0)}
        </text>
    </>
}
