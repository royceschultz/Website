import { useEffect, useContext, useMemo } from 'react'
import { GlobalContext } from '@/GlobalContext'

import { parseGPX } from './Modules/parseGPX'

interface FileLookupType {
    [name: string]: string
}

export default function RouteManager(): JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { activeRoute, setActiveRoute, setDatapoints, setCursor, setHighlightRange, toolStates, setToolState, map, mapIsReady } = globalContext.strava

    const files = useMemo<FileLookupType>(() => { return {
        'TBP': '/strava/TBP.gpx',
        '5BBT': '/strava/5BBT.gpx',
        'SD_Clouds': '/strava/SD_Clouds.gpx',
    }}, [])

    useEffect(() => {
        if (!activeRoute) return
        if (toolStates.routeManager === 'loading') return
        const routeUrl = files[activeRoute]
        // Stop reload on re-mount
        if (toolStates.routeManagerLoadedFile === routeUrl) return
        const handleFileFetch = async (url:string) => {
            const res = await fetch(url)
            const content = await res.text()
            const data = parseGPX(content)
            setDatapoints(data)
            setCursor(null)
            setHighlightRange(null)
        }
        setToolState('routeManager', 'loading')
        handleFileFetch(routeUrl).then(() => {
            setToolState('routeManager', 'ready')
            setToolState('routeManagerLoadedFile', routeUrl)
        })
    }, [activeRoute, map, setToolState, files, setCursor, setDatapoints, setHighlightRange, toolStates.routeManagerLoadedFile])
    useEffect(() => {
        if (!mapIsReady) return
        const state = toolStates.routeManager
        if (state === 'ready') {
            map.scrollZoom.enable()
        } else {
            map.scrollZoom.disable()
        }
    }, [toolStates.routeManager, map, mapIsReady])

    const FileManager = () => <div className='flex flex-row'>
        {Object.keys(files).map((name) => {
            return <button key={name}
                className='m-1' onClick={() => setActiveRoute(name)}
            >
                <div className='bg-slate-700 rounded-md p-1 hover:bg-blue-500'>
                    {name}
                </div>
            </button>
        })}
    </div>

    return <>
        <FileManager />
    </>
}
