import { useEffect, useContext } from 'react';

import Hideable from './Hideable';

import { GlobalContext } from '@/GlobalContext';

interface PropsType {
    hidden: boolean
    name: string
    lngLat: [number, number]
    color?: string
    radius?: number
}

export default function Point({name, ...props}:PropsType):JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { mapIsReady, map } = globalContext.strava

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
                    type: 'Point',
                    coordinates: props.lngLat
                }
            }
        })
        map.addLayer({
            id: name,
            type: 'circle',
            source: name,
            paint: {
                'circle-radius': props.radius ?? 10,
                'circle-color': props.color ?? '#c70d0d'
            }
        })
    }, [mapIsReady, map, name, props.lngLat, props.radius, props.color])

    useEffect(() => {
        if (!mapIsReady) return
        const source = map.getSource(name)
        if (!source) return
        source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: props.lngLat
            }
        })
    }, [mapIsReady, map, name, props.lngLat])

    useEffect(() => {
        // Change color
        if (!mapIsReady) return
        const layer = map.getLayer(name)
        if (!layer) return
        map.setPaintProperty(name, 'circle-color', props.color ?? '#c70d0d')
    }, [mapIsReady, map, name, props.color])

    return <>
        <Hideable hidden={props.hidden} name={name} />
    </>
}
