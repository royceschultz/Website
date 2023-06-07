import { useEffect, useContext, useMemo } from 'react';
import { GlobalContext } from '@/GlobalContext.tsx';

import Line from '../Elements/Line.jsx'

interface PropsType {
    hidden: boolean
}

export default function ZoomRoute(props:PropsType): JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { map, mapIsReady, datapoints, zoomRange, highlightRange } = globalContext.strava

    const route = useMemo<Array<[number, number]> | null>(() => {
        if (!mapIsReady) return null
        if (datapoints === null) return null
        if (zoomRange === null) return null
        const m = Math.min(...zoomRange)
        const n = Math.max(...zoomRange)
        return datapoints
            .slice(m, n)
            .filter((d) => d.lat && d.lon)
            .map((d):[number, number] => [d.lon ?? 0, d.lat ?? 0])
    }, [mapIsReady, datapoints, zoomRange])

    useEffect(() => {
        // Update route object on map
        if (!mapIsReady) return
        if (route === null) return
        const routeSource = map.getSource('zoom-route')
        if (!routeSource) return
        const lats = route.map((c):number => c[1])
        const lons = route.map((c) => c[0])
        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)
        const minLon = Math.min(...lons)
        const maxLon = Math.max(...lons)
        const leftPadding = document.getElementById('graphDrawer')?.offsetWidth ?? 0
        map.fitBounds([
            [minLon, minLat],
            [maxLon, maxLat]
        ], {
            padding: {
                left: leftPadding + 20,
                top: 20,
                right: 20,
                bottom: 20
            }
        })
    }, [mapIsReady, map, zoomRange, datapoints, highlightRange, route])

    return <>
        <Line name='zoom-route' coordinates={route ?? []} hidden={props.hidden} color={'#0303bf'}/>
    </>
}
