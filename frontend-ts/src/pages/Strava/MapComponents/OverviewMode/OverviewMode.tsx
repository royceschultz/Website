import { useEffect, useContext, useMemo } from 'react'
import { GlobalContext } from '@/GlobalContext.tsx'

export default function OverviewMode ({ ...props }) {
    const globalContext = useContext(GlobalContext)
    const { map, mapIsReady, setActiveRoute } = globalContext.strava

    const points = useMemo(() => [{
        name: 'TBP',
        lat: 39.7,
        lng: -105,
    }, {
        name: '5BBT',
        lat: 40.7,
        lng: -74,
    }, {
        name: 'SD_Clouds',
        lat: 32.7,
        lng: -117.16,
    }], [])

    useEffect(() => {
        if (!mapIsReady) return
        const existing_source = map.getSource('points')
        if (existing_source) return
        map.addSource('points', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: points.map((p) => {
                    return {
                        type: 'Feature',
                        properties: {
                            name: p.name,
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [p.lng, p.lat]
                        }
                    }
                })
            }
        })
        map.addLayer({
            id: 'points',
            type: 'circle',
            source: 'points',
            paint: {
                'circle-radius': 10,
                'circle-color': '#3887be'
            }
        })
    }, [mapIsReady, map, points])

    useEffect(() => {
        if (!mapIsReady) return
        if (!props.hidden) return
        // Get current center of map
        const center = map.getCenter()
        console.log('center', center)
        // Find closest point to center
        const closest = points.reduce((prev, curr) => {
            if (prev === null) return curr
            const prev_distance = Math.sqrt(Math.pow(prev.lng - center.lng, 2) + Math.pow(prev.lat - center.lat, 2))
            const curr_distance = Math.sqrt(Math.pow(curr.lng - center.lng, 2) + Math.pow(curr.lat - center.lat, 2))
            return prev_distance < curr_distance ? prev : curr
        })
        console.log('closest', closest)
        setActiveRoute(closest.name)
    }, [props.hidden, mapIsReady, map, points, setActiveRoute])

    useEffect(() => {
        if (!mapIsReady) return
        if (props.hidden) {
            map.setLayoutProperty('points', 'visibility', 'none')
        } else {
            map.setLayoutProperty('points', 'visibility', 'visible')
        }
    }, [props.hidden, mapIsReady, map])

    return <>
    </>
}
