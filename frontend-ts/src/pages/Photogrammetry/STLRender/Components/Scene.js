import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'

import { getCamera } from './Camera.js'
import { getRenderer } from './Renderer.js'
import { addAnimation } from './Animate.js'

let scene = null
let stats = null

export const init = () => {
    if (scene) return
    scene = new THREE.Scene();
    const camera = getCamera()
    const renderer = getRenderer()
    addSceneLighting()
    addStatsPanel()
}

export const getScene = () => {
    if (!scene) init()
    return scene
}

const addSceneLighting = () => {
    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    // Add directional lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(0, -1, 1);
    scene.add(directionalLight2);
}

const addStatsPanel = () => {
    stats = new Stats()
    stats.domElement.style.cssText = 'position:absolute;bottom:0px;left:0px;'
    document.getElementById('CanvasContainer').appendChild(stats.dom)       
    addAnimation('update stats', () => stats?.update())
}
