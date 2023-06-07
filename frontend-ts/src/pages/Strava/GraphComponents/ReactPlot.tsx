import React, { useState, useContext, useRef, useEffect, useMemo } from 'react'
import * as d3 from 'd3'
import _ from 'lodash';

import Axes from './Elements/Axes'
import Line from './Elements/Line'
import HighlightRect from './HighlightRect'
import Cursor from './Cursor'

import { GlobalContext, DatapointType } from '@/GlobalContext'

interface PropsType {
    xField: keyof DatapointType,
    yField: keyof DatapointType,
    title?: string,
    color?: string,
    children?: JSX.Element | JSX.Element[],
}

export default function ReactPlot({xField, yField, ...props}:PropsType):JSX.Element {
    const globalContext = useContext(GlobalContext)
    const {
        datapoints,
        cursor, setCursor,
        setHighlightRange,
        zoomRange,
    } = globalContext.strava

    const [width, setWidth] = useState(640)
    const height = 200
    const marginLeft = 40
    const marginRight = 30
    const marginTop = 40
    const marginBottom = 20

    const dimensions = {
        width, height,
        marginLeft, marginRight,
        marginTop, marginBottom
    }
    const [dragging, setDragging] = useState(false)
    const [smoothWindow, setSmoothWindow] = useState(5)

    const plotRef = useRef<SVGSVGElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    const data = useMemo(() => {
        if (datapoints == null) return null
        const d = datapoints.map((d) => {
            return {
                [xField]: d[xField],
                [yField]: d[yField] ?? 0,
            }
        })
        const sparse = []
        let start = 0
        let end = d.length
        if (zoomRange !== null) {
            start = zoomRange[0]
            end = zoomRange[1]
        }
        let step = (end - start) / 1000
        if (step < 1) step = 1
        for (let i = start; i < end; i += step) {
            const idx = Math.floor(i)
            const subarray = d.slice(Math.max(idx - smoothWindow, 0), Math.max(idx, 1))
            const xs = subarray.map((x) => x[xField]).filter((x): x is number => x != null)
            sparse.push({
                // [xField]: subarray[Math.floor(subarray.length / 2)][xField],
                [xField]: Math.max(...xs),
                [yField]: _.mean(subarray.map((x) => x[yField])),
            })
        }
        return sparse
    }, [datapoints, xField, yField, smoothWindow, zoomRange])

    const x = useMemo(() => {
        // TODO: Fix axes unit type
        if (data === null || data.length === 0) {
            return d3.scaleLinear(
                d3.extent(data ?? [], (d:DatapointType) => d[xField]),
                [marginLeft, width - marginRight]
            )
        }
        if ( xField.includes('time') ) {
            return d3.scaleTime(
                d3.extent(data, (d:DatapointType) => d[xField]),
                [marginLeft, width - marginRight]
            )
        }
        return d3.scaleLinear(
            d3.extent(data, (d:DatapointType) => d[xField]),
            [marginLeft, width - marginRight]
        )
        
    }, [data, xField, width])
    const y = useMemo(() => {
        return d3.scaleLinear(
            d3.extent(data ?? [], (d:DatapointType) => d[yField]),
            [height - marginBottom, marginTop]
        )
    }, [data, yField, height])
    
    useEffect(() => {
        // Update width on container resize
        if (containerRef.current == null) return
        const observer = new ResizeObserver(() => {
            if (containerRef.current == null) return
            const { width } = containerRef.current.getBoundingClientRect()
            setWidth(width)
        })
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [containerRef])

    return <div ref={containerRef} className='relative'>
        <div className='absolute'
            style={{ left: 50, top:10 }} >
            <h1>{props.title || 'ReactPlot'}</h1>
        </div>
        <div className='absolute' style={{right:10, top:10, fontSize:12}}>
            <label>Smoothing ({smoothWindow})</label>
            <input type='range' min='1' max='300'
                value={smoothWindow}
                onChange={_.throttle((e:React.ChangeEvent<HTMLInputElement>) => {
                    setSmoothWindow(parseFloat(e.target.value))
                }, 100)} />
        </div>
        <svg ref={plotRef}
            width={width} height={height}
            viewBox={`0,0,${width},${height}`}
            onMouseDown={() => {
                if (cursor === null) return
                setDragging(true)
                setHighlightRange([cursor, cursor])
            }}
            onMouseUp={() => {
                setDragging(false)
                // setCursorIsFrozen((f) => !f)
            }}
            onMouseMove={_.throttle((e:React.MouseEvent) => {
                if (plotRef.current === null) return
                if (e.nativeEvent.defaultPrevented) return
                // TODO: Fix this. Doesn't work when x axis is not time.
                if (datapoints == null){
                    setCursor(null)
                    return
                }
                if (datapoints.length === 0) {
                    setCursor(null)
                    return
                }
                if (dragging) {
                    setHighlightRange((r) => [r[0], cursor])
                }
                // Get mouse position relative to axes
                const { left } = plotRef.current.getBoundingClientRect()
                // Relative to origin of SVG element
                let svgX = e.clientX - left
                if (svgX < marginLeft) {
                    svgX = marginLeft
                }
                if (svgX > width - marginRight) {
                    svgX = width - marginRight
                }
                // Convert to axes coordinates
                const xVal = x.invert(svgX)
                const closestPoint = datapoints.reduce((acc, val) => {
                    if (acc == null) {
                        return {
                            element: val,
                            distance: Math.abs(val[xField] - xVal)
                        }
                    }
                    const distance = Math.abs(val[xField] - xVal)
                    if (distance < acc.distance) {
                        return {
                            element: val,
                            distance
                        }
                    }
                    return acc
                }, null).element
                setCursor(closestPoint.index)
            }, 30)}
        >
            <Line data={data ?? []}
                xScale={x} yScale={y}
                xField={xField} yField={yField}
                color={props.color}
            />
            <g>
                <Cursor
                    data={data ?? []}
                    xScale={x} xField={xField}
                    yScale={y} yField={yField}
                    color={props.color}
                />
                <HighlightRect xScale={x} xField={xField} dimensions={dimensions} />
            </g>
            <Axes xScale={x} yScale={y} dimensions={dimensions} />
            {props.children}
        </svg>
    </div>
}
