import React, { useState, useCallback, ReactNode } from 'react';

export const GlobalContext = React.createContext<GlobalContextType>({})

interface GlobalContextType {
    strava: {
        mode: string,
        setMode: (mode:string) => void,
        datapoints: Array<DatapointType>|null,
        setDatapoints: (datapoints:Array<DatapointType>|null) => void,
        cursor: number|null,
        setCursor: (cursor:number|null) => void,
        setCursorByFraction: (fraction:number) => void,
        setCursorByTime: (time:Date) => void,
        getCursorFraction: () => number,
        cursorIsFrozen: boolean,
        setCursorIsFrozen: (cursorIsFrozen:boolean) => void,
        highlightRange: [number, number] | null,
        setHighlightRange: (highlightRange:[number, number] | null) => void,
        zoomRange: [number, number] | null,
        setZoomRange: (zoomRange:[number, number] | null) => void,
        map: any,
        setMap: (map:any) => void,
        mapIsReady: boolean,
        setMapIsReady: (mapIsReady:boolean) => void,
        toolStates: any,
        setToolStates: (toolStates:any) => void,
        setToolState: (tool:string, state:string) => void,
        activeRoute: string|null,
        setActiveRoute: (activeRoute:string|null) => void,
    }
}

interface PropsType {
    children: ReactNode
}

export interface DatapointType {
    index: number,
    time: Date,
    rideTime?: number,
    lat?: number, lon?: number, ele?: number,
    hr?: number, power?: number, cad?: number,
    distance?: number,
    speed?: number,
    temp?: number,
}

export default function GlobalContextProvider({ children }:PropsType):JSX.Element{
    const [stravaDatapoints, setStravaDatapoints] = useState<Array<DatapointType>|null>([])
    const [stravaCursor, setStravaCursor] = useState<number|null>(null)
    const [stravaCursorIsFrozen, setStravaCursorIsFrozen] = useState<boolean>(false)
    const [stravaHighlightRange, setStravaHighlightRange] = useState<[number, number]|null>(null)
    const [stravaZoomRange, setStravaZoomRange] = useState<[number, number] | null>(null)
    const [stravaMode, setStravaMode] = useState<string>('default')
    const [stravaMap, setStravaMap] = useState(null)
    const [stravaMapIsReady, setStravaMapIsReady] = useState<boolean>(false)
    const [stravaToolStates, setStravaToolStates] = useState({})
    const stravaSetToolState = useCallback((tool:string, state:string) => setStravaToolStates((prev) => {return {...prev, [tool]: state}}), [setStravaToolStates])
    const [stravaActiveRoute, setStravaActiveRoute] = useState<string|null>(null)

    const handleSetCursor = (x:number|null) => {
        if (stravaCursorIsFrozen) {
            console.log('cursor frozen')
            return
        }
        setStravaCursor(x)
    }

    return <GlobalContext.Provider value={{
        strava: {
            mode: stravaMode,
            setMode: setStravaMode,
            datapoints: stravaDatapoints,
            setDatapoints: setStravaDatapoints,
            cursor: stravaCursor,
            setCursor: handleSetCursor,
            setCursorByFraction: (f:number) => {
                if (stravaDatapoints === null) throw(new Error('stravaDatapoints is null'))
                const l = stravaDatapoints.length
                const c = Math.floor(f * (l - 1))
                handleSetCursor(c)
            },
            setCursorByTime: (t:Date) => {
                if (stravaDatapoints === null) throw(new Error('stravaDatapoints is null'))
                let c = 0
                for (let i = 0; i < stravaDatapoints.length; i++) {
                    const x = stravaDatapoints[i].time
                    if (x === undefined) continue
                    if (x > t) break
                    c = i
                }
                handleSetCursor(c)
            },
            getCursorFraction: () => {
                if (stravaDatapoints === null) throw(new Error('stravaDatapoints is null'))
                if (stravaCursor === null) throw(new Error('stravaCursor is null'))
                const l = stravaDatapoints.length
                const c = stravaCursor
                return c / (l - 1)
            },
            cursorIsFrozen: stravaCursorIsFrozen,
            setCursorIsFrozen: setStravaCursorIsFrozen,
            highlightRange: stravaHighlightRange,
            setHighlightRange: setStravaHighlightRange,
            zoomRange: stravaZoomRange,
            setZoomRange: setStravaZoomRange,
            map: stravaMap,
            setMap: setStravaMap,
            mapIsReady: stravaMapIsReady,
            setMapIsReady: setStravaMapIsReady,
            toolStates: stravaToolStates,
            setToolStates: setStravaToolStates,
            setToolState: stravaSetToolState,
            activeRoute: stravaActiveRoute,
            setActiveRoute: setStravaActiveRoute,
        }
    }}>
        {children}
    </GlobalContext.Provider>
}
