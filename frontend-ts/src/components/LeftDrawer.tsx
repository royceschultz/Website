import { useState, useEffect, useCallback } from 'react'

interface PropsType {
    id: string
    defaultWidth?: number
    closed?: boolean,
    children: JSX.Element | JSX.Element[]
}

export default function LeftDrawer (props: PropsType): JSX.Element {
    const [width, setWidth] = useState(props.defaultWidth ?? 640)
    const [dragging, setDragging] = useState(false)

    const handleMouseMove = useCallback((e:MouseEvent) => {
        e.preventDefault()
        setWidth(e.clientX + 5)
    }, [setWidth])

    const handleMouseUp = useCallback(() => {
        setDragging(false)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
    }, [handleMouseMove])

    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [handleMouseUp, handleMouseMove])

    return <div className='absolute z-10 h-full w-full flex flex-row'
        id={props.id}
        style={{
            width: props.closed ? '0px' : `${width}px`,
            transition: dragging ? '' : 'width 0.5s',
            backgroundColor: 'rgba(90, 90, 90, 0.80)',
        }}
    >
        <div className='flex-1 overflow-y-scroll'
            style={{
                scrollbarWidth: 'none',  /* Firefox */
                // TODO: Add support for other browsers
            }}
        >
            {props.children}
        </div>
        <div style={{
            width: '10px', height: '100%',
            backgroundColor: 'rgb(90, 90, 90)',
            cursor: 'col-resize',
        }}
            onMouseDown={() => {
                setDragging(true)
                window.addEventListener('mousemove', handleMouseMove)
                window.addEventListener('mouseup', handleMouseUp)
            }}
        >

        </div>
    </div>
}
