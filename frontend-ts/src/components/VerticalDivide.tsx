import { useEffect, useState } from 'react'
import styles from './VerticalDivide.module.css'

interface PropsType {
    left: JSX.Element,
    right: JSX.Element,
    defaultSize?: number,
    closeLeft?: boolean,
}

export default function VerticalDivide({left, right, ...props}: PropsType): JSX.Element {
    const [size, setSize] = useState(props.defaultSize || 300)
    const [dragging, setDragging] = useState(false)

    const handleMouseDown = () => {
        setDragging(true)
    }

    const handleMouseUp = () => {
        setDragging(false)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('mousemove', handleMouseMove)
    }

    const handleMouseMove = (e:MouseEvent) => {
        if (!dragging) return
        setSize(e.clientX)
    }

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove)
        return () => document.removeEventListener('mousemove', handleMouseMove)
    }, [handleMouseMove])

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp)
        return () => document.removeEventListener('mouseup', handleMouseUp)
    }, [handleMouseUp])

    return <div className='h-full w-full flex flex-row'>
        <div
            className={`${props.closeLeft?styles.closed:styles.isOpen}`}
            style={{
                width: `${size}px`,
                overflowY: 'scroll'
        }}>
            {left}
        </div>
        <div
            style={{
                width: '10px',
                backgroundColor: 'gray',
                cursor: 'col-resize',
                overflowY: 'scroll'
            }}
            onMouseDown={handleMouseDown}
        />
        <div className='grow'>
            {right}
        </div>
    </div>
}
