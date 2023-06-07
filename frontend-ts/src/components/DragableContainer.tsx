import React, { useState, useRef, useEffect } from 'react'

interface PropTypes {
    defaultBottom?: number,
    defaultTop?: number,
    defaultRight?: number,
    defaultLeft?: number,
    hidden?: boolean,
    overlay?: JSX.Element,
    children?: JSX.Element,
}

export default function DragableComponent(props: PropTypes): JSX.Element {
    const [dimensions, setDimensions] = useState({
        bottom: props.defaultBottom ?? undefined,
        top: props.defaultTop ?? (props.defaultBottom ? undefined : 30),
        right: props.defaultRight ?? undefined,
        left: props.defaultLeft ?? (props.defaultRight ? undefined : 30),
    })

    const ref = useRef<HTMLDivElement | null>(null)

    const ensureWithinBounds = () => {
        if (ref.current == null) return
        if (ref.current.parentElement == null) return
        const parentDims = ref.current.parentElement.getBoundingClientRect()
        const bbox = ref.current.getBoundingClientRect()
        if (bbox.height == 0) return
        let left = bbox.left ?? parentDims.width - bbox.right - bbox.width
        let top = bbox.top - parentDims.top ?? parentDims.height - bbox.bottom - bbox.height
        console.log(`left: ${left}, top: ${top}`)
        console.log(`parentDims: ${JSON.stringify(parentDims)}`)
        console.log(`bbox: ${JSON.stringify(bbox)}`)
        if (left < 0) left = 0
        if (top < 0) top = 0
        if (left + bbox.width > parentDims.width) left = parentDims.width - bbox.width
        if (top + bbox.height > parentDims.height) top = parentDims.height - bbox.height
        setDimensions(() => {
            return {
                left: left,
                top: top,
                right: undefined,
                bottom: undefined,
            }
        })
    }

    useEffect(() => {
        if (ref.current == null) return
        if (ref.current.parentElement == null) return
        const observer = new ResizeObserver(() => {
            ensureWithinBounds()
        })
        observer.observe(ref.current.parentElement)
        return () => {
            observer.disconnect()
        }
    }, [ref])

    return <div className='absolute h-full w-full top-0 left-0 pointer-events-none'>
        <div style={{
            position: 'absolute',
            ...dimensions,
            zIndex: 20,
            display: props.hidden ? 'none' : 'block',
        }}
            ref={ref}
        >
            <div style={{
                    userSelect: 'none',
                    cursor: 'move',
                    pointerEvents: 'auto',
                }}
                onMouseDown={(event:React.MouseEvent) => {
                    if (ref.current == null) return
                    if (ref.current.parentElement == null) return
                    const startX = event.pageX
                    const startY = event.pageY
                    const parentDims = ref.current.parentElement.getBoundingClientRect()
                    const bbox = ref.current.getBoundingClientRect()
                    const startLeft = bbox.left ?? parentDims.width - bbox.right - bbox.width
                    const startTop = bbox.top - parentDims.top ?? parentDims.height - bbox.bottom - bbox.height

                    const handleMouseMove = (event:MouseEvent) => {
                        // TODO: Prevent default isn't working
                        // Variable changes, but I guess not in time?
                        event.preventDefault()
                        const deltaX = event.pageX - startX
                        const deltaY = event.pageY - startY
                        let left = startLeft + deltaX
                        let top = startTop + deltaY
                        if (left < 0) left = 0
                        if (top < 0) top = 0
                        if (left + bbox.width > parentDims.width) left = parentDims.width - bbox.width
                        if (top + bbox.height > parentDims.height) top = parentDims.height - bbox.height
                        setDimensions(() => {
                            return {
                                left: left,
                                top: top,
                                right: undefined,
                                bottom: undefined,
                            }
                        })
                    }
                    const handleMouseUp = () => {
                        window.removeEventListener('mousemove', handleMouseMove)
                        window.removeEventListener('mouseup', handleMouseUp)
                    }
                    window.addEventListener('mousemove', handleMouseMove)
                    window.addEventListener('mouseup', handleMouseUp)
                }}>
                {props.children}
            </div>
            <div className='w-full h-full'>
                <div className='pointer-events-auto'>
                    {props.overlay}
                </div>
            </div>
        </div>
    </div>
}
