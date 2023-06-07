import { useMemo } from 'react'
import * as d3 from 'd3'

import { DatapointType } from '@/GlobalContext'

interface PropsType {
    data: Array<any>,
    xScale: any,
    yScale: any,
    xField: keyof DatapointType,
    yField: keyof DatapointType,
    color?: string,
}

export default function Line({ data, xScale, yScale, xField, yField, ...props}:PropsType):JSX.Element {
    const lineGenerator = useMemo(() => d3.line()
        .x(d => xScale(d[xField]))
        .y(d => yScale(d[yField]))
    , [xScale, yScale, xField, yField])
    return <>
        <path
            fill='none'
            stroke={props.color || 'blue'}
            stroke-width='1'
            d={lineGenerator(data ?? [])}
        />
    </>
}
