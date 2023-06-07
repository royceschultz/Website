import { useEffect, useContext, useMemo } from 'react';
import { GlobalContext } from '@/GlobalContext.tsx';

import Hideable from '../Elements/Hideable.jsx'
import Line from '../Elements/Line.jsx'

interface PropsType {
    hidden: boolean
}

export default function HighlightRoute(props:PropsType): JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { map, mapIsReady, datapoints, highlightRange } = globalContext.strava

    const route = useMemo<Array<[number, number]> | null>(() => {
        if (!mapIsReady) return null
        if (highlightRange === null) return null
        if (datapoints === null) return null
        const m = Math.min(...highlightRange)
        const n = Math.max(...highlightRange)
        return datapoints
            .slice(m, n)
            .filter((d) => (d.lat !== undefined) && (d.lon !== undefined))
            .map((d):[number, number] => [d.lon ?? 0, d.lat ?? 0])
    }, [mapIsReady, highlightRange, datapoints])

    useEffect(() => {
        // Update route object on map
        if (!mapIsReady) return
        if (route === null) return
        if (route.length === 0) return
        const routeSource = map.getSource('highlight-route')
        if (!routeSource) return
        const lats = route.map((c) => c[1])
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
            },
            linear: true,
        })
    }, [mapIsReady, map, highlightRange, route])

    return <>
        <Hideable hidden={props.hidden} name='highlight-route' />
        <Line name='highlight-route' coordinates={route ?? []} hidden={props.hidden} color={'#ff8000'}/>
    </>
}
