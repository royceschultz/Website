import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { getCamera } from './Camera.js'
import { getViewport } from './Viewport.js'

let renderer = null
let controls = null

export const getRenderer = () => {
    if (!renderer) {
        throw new Error('Renderer not initialized')
    }
    return renderer
}

export const RenderNewCanvas = (canvas) => {
    if (renderer) renderer.dispose()
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    })
    renderer.setSize(getViewport().width, getViewport().height)

    controls = new OrbitControls(getCamera(), renderer.domElement)
}
