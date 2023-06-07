import { useContext, useEffect } from 'react';
import { GlobalContext } from '@/GlobalContext';

interface PropsType {
    hidden: boolean
    name: string
}

export default function Hideable({hidden, name}:PropsType):JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { map, mapIsReady } = globalContext.strava

    useEffect(() => {
        if (!mapIsReady) return
        const existing_layer = map.getLayer(name)
        if (!existing_layer) return
        map.setLayoutProperty(name, 'visibility', hidden ? 'none' : 'visible')
    }, [hidden, mapIsReady, map, name])
    return <></>
}
