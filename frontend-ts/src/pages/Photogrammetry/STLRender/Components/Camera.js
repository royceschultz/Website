import * as THREE from 'three'
import { getAspectRatio } from './Viewport.js'

let camera = null;

export const init = () => {
    if (camera) return
    camera = new THREE.PerspectiveCamera(75, getAspectRatio(), 0.1, 1000);
    camera.position.z = 5
    return camera
}

export const getCamera = () => {
    if (!camera) init()
    return camera
}
