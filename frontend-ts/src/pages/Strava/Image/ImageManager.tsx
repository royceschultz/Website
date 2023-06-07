import { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '@/GlobalContext'

import Image from './SuperImage'
import Point from '../MapComponents/Elements/Point'

interface PropsType {
    hidden: boolean
}

export default function ImageManager(props:PropsType): JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { cursor, datapoints } = globalContext.strava

    const [activeImage, setActiveImage] = useState(0)

    const images = [
        {
            src: 'TBP-01.jpg',
            cursorIndex: 3600,
        }, {
            src: 'TBP-02.jpg',
            cursorIndex: 9600,
        }, {
            src: 'TBP-03.jpg',
            cursorIndex: 15600,
        }
    ]

    const getLngLatByIndex = (index:number):[number, number] | null => {
        if (datapoints == null) return null
        const d = datapoints[index]
        if (d == null) return null
        if (d.lat == null || d.lon == null) return null
        return [d.lon, d.lat]
    }

    useEffect(() => {
        if (cursor === null) return
        // find index with minimum distance to d
        let minIndex = 0
        let minDistance = 1e10
        for (let i = 0; i < images.length; i++) {
            const distance = Math.abs(images[i].cursorIndex - cursor)
            if (distance < minDistance) {
                minDistance = distance
                minIndex = i
            }
        }
        setActiveImage(minIndex)
    }, [cursor])

    return <>
        <Image src={images[activeImage].src} />
        {images.map((image, i) => <>
            <Point name={`image-point-${i}`}
                lngLat={getLngLatByIndex(image.cursorIndex) ?? [0, 0]} hidden={props.hidden}
                color={i === activeImage ? '#f7b901' : '#106b32'}
            />
        </>)}
    </>
}
