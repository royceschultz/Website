import { useRef, useEffect, useContext } from 'react'
// import 'mapbox-gl/dist/mapbox-gl.css';
import _ from 'lodash';

import RouteMode from './MapComponents/RouteMode/RouteMode.jsx'
import OverviewMode from './MapComponents/OverviewMode/OverviewMode.js'

import { GlobalContext } from '@/GlobalContext.tsx';
import { initMap } from './Modules/mapManager.js'

export default function Map() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const globalContext = useContext(GlobalContext)
    const {
        mode, setMode,
        map, setMap,
        mapIsReady, setMapIsReady
    } = globalContext.strava

    useEffect(() => {
        // Handle Component Mount and Unmount
        if (containerRef.current == null) return
        if (map == null) {
            setMap(initMap())
            return
        }
        if (!map.loaded()) {
            map.on('load', () => setMapIsReady(true))
        } else {
            setMapIsReady(true)
        }
    }, [containerRef, map, setMap, setMapIsReady])

    useEffect(() => {
        if (containerRef.current == null) return
        if (!mapIsReady) return
        // Look for mapbox in hidden div, move if found
        const hidden_div = document.getElementById('hidden')
        const mapbox = hidden_div?.querySelector('#mapbox')
        const container = containerRef.current
        if (mapbox != null) { // If Found, move map to visible div
            console.log('Map found in hidden div')
            container.innerHTML = ''
            container.appendChild(mapbox)
        }
        return () => {
            console.log('Unmounting map')
            // Move map to a hidden div so that it doesn't get unmounted
            const mapbox = container.querySelector('#mapbox')
            if (mapbox == null) return
            document.getElementById('hidden')?.appendChild(mapbox)
        }
    }, [mapIsReady, containerRef])

    useEffect(() => {
        // Handle MapBox Initialized
        if (!mapIsReady) return
        if (containerRef.current === null) return
        // Resize map when viewport changes
        const resizeObserver = new ResizeObserver(_.debounce(() => map.resize(), 1000 / 120))
        resizeObserver.observe(containerRef.current);
        map.on('zoom', (e:any) => {
            if (e.originalEvent?.type === 'wheel') {
                if (map.getZoom() < 6) {
                    setMode('far_out')
                    // MapManager.setMode('far out')
                    // hide route, show points
                } else {
                    setMode('default')
                }
            }
        })
        map.on('error', (e:any) => {
            console.log('Map error')
            console.log(e)
        })
        return () => {
            resizeObserver.disconnect()
        }
    }, [mapIsReady, map, setMode])

    return <div className='h-full w-full relative'>
        <div className='h-full w-full' ref={ containerRef }>
            {/* 
                Div with id = 'mapbox' exists externally in app component.
                Fixes issue when Map component unmounts while Map object is loading,
                resulting in lost reference to mapbox.
                Div persists in hidden div so that it doesn't get unmounted.
                Mapbox charges per map load.
            */}
        </div>
        <div className='absolute h-full w-full top-0 left-0 pointer-events-none'>
            <RouteMode hidden={mode!=='default'} />
            <OverviewMode hidden={mode!=='far_out'} />
        </div>
    </div>
}
