import { useContext, useEffect, useMemo } from 'react';
import { GlobalContext } from '@/GlobalContext.tsx';

import Point from '../Elements/Point'

interface PropsType {
    hidden: boolean
}

export default function Cursor(props:PropsType): JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { cursor, datapoints, map, mapIsReady, highlightRange } = globalContext.strava

    const lngLat = useMemo<[number, number] | null>(() => {
        if (datapoints === null) return null
        if (cursor === null) return null
        const d = datapoints[cursor]
        if (d === null) return null
        if (d.lat === null || d.lon === null) return null
        return [d.lon ?? 0, d.lat ?? 0]
    }, [cursor, datapoints])

    useEffect(() => {
        // Update cursor object on map)
        if (!mapIsReady) {
            console.log('map not ready')
            return
        }
        if (!lngLat) return
        const cursorSource = map.getSource('cursor')
        if (!cursorSource) {
            console.log('cursor source not found')
            return
        }
        if (highlightRange === null ) {
            map.flyTo({
                center: lngLat,
            })
        }
    }, [mapIsReady, cursor, lngLat, highlightRange, map])

    return <>
        <Point name='cursor' lngLat={lngLat ?? [0, 0]} hidden={props.hidden} color={'#3887be'} />
    </>
}
