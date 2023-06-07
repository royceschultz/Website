import { useEffect, useContext, useMemo } from 'react';
import { GlobalContext } from '@/GlobalContext';

import Line from '../Elements/Line'

interface PropsType {
    hidden: boolean
}

export default function Route(props:PropsType): JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { map, mapIsReady, datapoints } = globalContext.strava

    const route = useMemo<Array<[number, number]> | null>(() => {
        if (!datapoints) return null
        return datapoints
            .filter((d) => d.lat !== null && d.lon !== null)
            .map((d) => [d.lon ?? 0, d.lat ?? 0])
    }, [datapoints])

    useEffect(() => {
        // Zoom to route on update
        if (!mapIsReady) return
        const routeSource = map.getSource('route')
        if (!routeSource) return
        if (route === null) return
        if (route.length === 0) return
        const lats = route.map((c) => c[1])
        const lons = route.map((c) => c[0])
        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)
        const minLon = Math.min(...lons)
        const maxLon = Math.max(...lons)
        const leftPadding = document.getElementById('graphDrawer')?.offsetWidth ?? 0
        map.fitBounds([[minLon, minLat], [maxLon, maxLat]], {
            padding: {
                left: leftPadding + 20,
                top: 20,
                right: 20,
                bottom: 20
            }
        })
    }, [mapIsReady, map, route])

    return <>
        <Line name='route' coordinates={route ?? []} hidden={props.hidden}/>
    </>
}
