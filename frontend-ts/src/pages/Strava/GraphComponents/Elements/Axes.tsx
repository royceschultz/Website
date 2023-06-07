import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface PropsType {
    xScale: any,
    yScale: any,
    dimensions: {
        width: number,
        height: number,
        marginLeft: number,
        marginRight: number,
        marginTop: number,
        marginBottom: number,
    }
}

export default function Axes({ xScale, yScale, dimensions }:PropsType):JSX.Element {
    const divRef = useRef(null)
    const { width, height, marginLeft, marginBottom } = dimensions
    
    useEffect(() => {
        if (divRef.current == null) return
        d3.select(divRef.current).selectAll('.axes').remove()
        const axes_group = d3.select(divRef.current).append('g')
            .attr('class', 'axes')
        // x-axis
        axes_group.append('g')
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0))
        // y-axis
        axes_group.append('g')
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(yScale).ticks(height / 40))
    }, [divRef, xScale, yScale, width])
    return <g ref={divRef} />
}
