import { useContext, useEffect, useCallback } from 'react';

import { GlobalContext } from '@/GlobalContext.tsx';

import Graphs from './Graphs'
import Map from './Map'
import Summary from './Summary'
import Toolbar from './Toolbar';
import LeftDrawer from '@components/LeftDrawer';
import DragableContainer from '@components/DragableContainer'
import RouteManager from './RouteManager';

import { parseGPX } from './Modules/parseGPX.js'

export default function Strava(): JSX.Element {
    const globalContext = useContext(GlobalContext)
    const {
        datapoints, setDatapoints, setCursor,
        highlightRange, setHighlightRange, mode,
        zoomRange, setZoomRange
    } = globalContext.strava

    const handleFileChange = async (event:any) => {
        const file = Object(event.currentTarget.files)[0];
        if (!file) return
        const content = await file.text();
        const data = parseGPX(content)
        setDatapoints(data)
        setCursor(null)
        setHighlightRange(null)
    }

    const handleSetZoom = useCallback((event:any) => {
        if (event.key === 'z') {
            if (highlightRange !== null) {
                setZoomRange([Math.min(...highlightRange), Math.max(...highlightRange)])
            }
        }
        if (event.key === ' ') {
            event.preventDefault()
            setZoomRange(null)
            setHighlightRange(null)
        }
        if (event.key === 'x') {
            if (zoomRange !== null) {
                if (datapoints === null ) {
                    setZoomRange(null)
                    return
                }
                const range = zoomRange[1] - zoomRange[0]
                const zoomFactor = 0.2
                let start = Math.floor(zoomRange[0] - range * zoomFactor)
                let end = Math.floor(zoomRange[1] + range * zoomFactor)
                if (start < 0) start = 0
                if (end > datapoints.length - 1) end = datapoints.length - 1
                const newRange:[number, number] = [start, end]
                setZoomRange(newRange)
            }
        }
    }, [highlightRange, zoomRange, setZoomRange, setHighlightRange, datapoints])

    useEffect(() => {
        // On keypress 'z', set zoom range to highlight range
        window.addEventListener('keydown', handleSetZoom)
        return () => {
            window.removeEventListener('keydown', handleSetZoom)
        }
    }, [handleSetZoom])

    return <div className='h-full relative'>
        <div className='relative flex-auto w-full h-full min-h-0'>
            <LeftDrawer id='graphDrawer' closed={mode==='far_out'} defaultWidth={420}>
                <div>
                    <input type='file' onChange={handleFileChange} />
                </div>
                <RouteManager />
                <Graphs />
            </LeftDrawer>
            <Map />
            <DragableContainer defaultLeft={420} defaultBottom={1}>
                <Summary />
            </DragableContainer>
            <div className='absolute top-0 right-0 pointer-events-auto'>
                <Toolbar />
            </div>
        </div>
    </div>
}
