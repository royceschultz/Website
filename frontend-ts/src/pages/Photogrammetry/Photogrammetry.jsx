import React, { useState, useEffect, useRef } from 'react';
import STLRender from './STLRender/STLRender.jsx'

import VerticalDivide from '@components/VerticalDivide';

import styles from './Photogrammetry.module.css'

function Photogrammetry() {
    const [activeUrl, setActiveUrl] = useState('test.stl')
    const containerRef = useRef(null)

    const models = [
        {
            'type': 'stl',
            'name': 'test',
            'stlUrl': 'test.stl',
            'image': '/test.jpg',
        }, {
            'type': 'stl',
            'name': 'test2',
            'stlUrl': 'test2.stl',
            'image': '/test2.jpg',
        }, {
            'type': 'stl',
            'name': 'test3',
            'stlUrl': 'test3.stl',
            'image': '/test3.jpg',
        }, {
            'type': 'folder',
            'name': 'test4',
            'image': '/test4.jpg',
        }
    ]

    const browser = (
        <div className={styles.Browser}>
            {
                models.map((model, index) => {
                    return <div className={styles.BrowserButton} onClick={() => setActiveUrl(model.stlUrl)}>
                        <img src={model.image} />
                        <p>{model.name}</p>
                    </div>
                })
            }
        </div>
    )

    return (<div className={styles.Container} ref={containerRef}>
        <VerticalDivide left={browser} right={<STLRender stlUrl={activeUrl} />} />
    </div>)
}

export default Photogrammetry;
