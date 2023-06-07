import { useState, useMemo, useContext } from 'react'
import * as d3 from 'd3'

import { GlobalContext, DatapointType } from '@/GlobalContext';

export default function Summary(): JSX.Element {
    const globalContext = useContext(GlobalContext)
    const {
        datapoints, mode,
        toolStates,
    } = globalContext.strava

    const [devRefresh, setDevRefresh] = useState(0)

    const summaryData = useMemo(() => {
        if (datapoints == null) return null
        const totalDistance = datapoints.reduce((acc, cur) => Math.max(acc, cur.distance ?? 0), 0)
        // Get extent of time
        const timeRange = d3.extent(datapoints, (d:DatapointType) => d.time)
        // const totalDuration = timeRange[1] - timeRange[0]
        let totalDurationSeconds = 1
        if (timeRange[1] && timeRange[0]) {
            totalDurationSeconds = (timeRange[1] - timeRange[0]) / 1000
        }


        const avgPower = datapoints.reduce((acc, cur) => acc + (cur.power ?? 0), 0) / datapoints.length

        let elevationGain = 0
        let elevationLoss = 0
        for (let i = 1; i < datapoints.length; i++) {
            const d = datapoints[i]
            const prev = datapoints[i - 1]
            if (d === null || prev === null) continue
            if (d.ele === undefined || prev.ele === undefined) continue
            const delta = d.ele - prev.ele
            if (delta > 0) {
                elevationGain += delta
            } else {
                elevationLoss += delta
            }
        }

        let movingTimeSeconds = 0
        let segmentStartTime:Date|null = null
        let currentDelta = 0
        for (let i = 0; i < datapoints.length; i++) {
            if (datapoints[i].time === null) continue
            if (segmentStartTime === null) {
                segmentStartTime = datapoints[i].time
            } else {
                const dt = (datapoints[i].time.getTime() - datapoints[i - 1].time.getTime()) / 1000
                if (dt > 30) {
                    movingTimeSeconds += currentDelta
                    segmentStartTime = datapoints[i].time
                    currentDelta = 0
                } else {
                    currentDelta = (datapoints[i].time.getTime() - segmentStartTime.getTime()) / 1000
                }
            }
        }
        const avgSpeed = totalDistance / (movingTimeSeconds / 3600)


        const seconds2string = (s:number):string => {
            const hours = Math.floor(s / 3600)
            const minutes = Math.floor((s - hours * 3600) / 60)
            const seconds = Math.floor(s - hours * 3600 - minutes * 60)
            return `${hours}h ${minutes}m ${seconds}s`
        }

        const totalDurationString = seconds2string(totalDurationSeconds)
        const movingTimeString = seconds2string(movingTimeSeconds)
        return {
            totalDistance,
            timeRange,
            totalDuration: totalDurationString,
            movingTime: movingTimeString,
            avgSpeed,
            avgPower,
            elevationGain,
            elevationLoss,
        }
    }, [datapoints])

    const Data = (summaryData === null) ? <>null</> : <>
        <p>
            Total Distance: {summaryData.totalDistance.toFixed(1)} km ({(summaryData.totalDistance / 1.609).toFixed(1)} mi)
        </p>
        <p>
            Total Time: {summaryData.totalDuration}
        </p>
        <p>
            Moving Time: {summaryData.movingTime}
        </p>
        <p>
            Average Speed: {summaryData.avgSpeed.toFixed(1)} km/h ({(summaryData.avgSpeed / 1.609).toFixed(1)} mi/h)
        </p>
        <p>
            Average Power: {summaryData.avgPower.toFixed(1)} W
        </p>
        <p>
            Elevation Gain: {summaryData.elevationGain.toFixed(0)} m ({(summaryData.elevationGain * 3.281).toFixed(0)} ft)
        </p>
        <p>
            Elevation Loss: {summaryData.elevationLoss.toFixed(0)} m ({(summaryData.elevationLoss * 3.281).toFixed(0)} ft)
        </p>
        <button onClick={() => setDevRefresh(devRefresh + 1)}>
            Refresh
        </button>
    </>

    return <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '0.5rem',
        display: mode === 'default' ? 'block' : 'none',
    }}>
        {toolStates['routeManager'] === 'ready' ? Data : <p>Loading...</p>}
    </div>
}
