import { useEffect, useContext } from 'react';
import { GlobalContext } from '@/GlobalContext';

import Hideable from './Hideable.js'

interface PropsType {
    hidden: boolean
    name: string
    coordinates: [number, number][]
    color?: string
    lineWidth?: number
}

export default function Line({name, ...props}:PropsType):JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { map, mapIsReady } = globalContext.strava

    useEffect(() => {
        if (!mapIsReady) return
        const existing_source = map.getSource(name)
        if (existing_source) return
        map.addSource(name, {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: []
                }
            }
        })
        map.addLayer({
            id: name,
            type: 'line',
            source: name,
            paint: {
                'line-width': props.lineWidth ?? 3,
                'line-color': props.color ?? '#8a8a8a'
            }
        })
    }, [mapIsReady, map, props.color, props.lineWidth, name])

    useEffect(() => {
        if (!mapIsReady) return
        const source = map.getSource(name)
        if (!source) return
        source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: props.coordinates
            }
        })
    }, [mapIsReady, map, props.coordinates, name])

    return <>
        <Hideable name={name} hidden={props.hidden} />
    </>
}
