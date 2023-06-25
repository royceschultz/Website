import React, { useState, useEffect, useRef } from 'react'
import styles from './STLRenderStyles.module.css'
import * as THREE from 'three'

import { getCamera } from './Components/Camera.js'
import { getScene } from './Components/Scene.js'
import { getRenderer, RenderNewCanvas } from './Components/Renderer.js'
import { STLMeshManager } from './Components/STLMeshManager.js'
import { addAnimation, removeAnimation, stopAnimate, restartAnimate} from './Components/Animate.js'

import CanvasOverlay from './Components/CanvasOverlay/CanvasOverlay.jsx'

var scene = null;
var camera = null;
var renderer = null;

function STLRender({stlUrl, ...props}) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    const init = () => {
        RenderNewCanvas(canvasRef.current)
        renderer = getRenderer()
        scene = getScene()
        camera = getCamera()
    }
    
    useEffect(() => {
        if (containerRef.current == null) return;
        if (canvasRef.current == null) return;
        init()
        const handle_resize = () => {
            const viewportWidth = containerRef.current.clientWidth
            const viewportHeight = containerRef.current.clientHeight
            camera.aspect = viewportWidth / viewportHeight
            camera.updateProjectionMatrix();
            renderer.setSize(viewportWidth, viewportHeight)
            renderer.render(scene, camera);
        }
        window.addEventListener('resize', handle_resize)

        const resizeObserver = new ResizeObserver(() => handle_resize())
        resizeObserver.observe(containerRef.current);

        addAnimation('render', () => {
            renderer.render(scene, camera)
        })
        restartAnimate()

        return () => {
            console.log('unmount')
            stopAnimate()
            window.removeEventListener('resize', handle_resize)
            resizeObserver.disconnect();
            if (renderer) {
                renderer.dispose()
            }
        }
    }, [canvasRef, containerRef])

    useEffect(() => {
        STLMeshManager.loadSTL('main', stlUrl)
    }, [stlUrl])

    return <div id='CanvasContainer' className={styles.CanvasContainer} ref={containerRef}>
        <canvas className={styles.Canvas} ref={canvasRef} />
        <CanvasOverlay />
    </div>
}

export default STLRender;
