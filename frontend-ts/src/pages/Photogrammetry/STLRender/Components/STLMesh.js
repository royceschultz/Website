import * as THREE from 'three'
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { getScene } from './Scene.js'

export class STLMesh {
    constructor () {
        this.mesh = null;
        this.geometry = null;
        this.material = new THREE.MeshPhongMaterial({ color: 0xd5d5d5, specular: 0x494949, shininess: 200 });
    }

    async loadSTL (stlUrl) {
        return new Promise((resolve, reject) => {
            const onLoad = (geometry) => {
                const mesh = new THREE.Mesh(geometry, this.material)
                // Center model
                mesh.geometry.center()
                mesh.position.set(0, 0, 0)
                // Scale model
                const target_size = 1
                mesh.geometry.computeBoundingSphere()
                const scale = target_size / mesh.geometry.boundingSphere.radius
                mesh.scale.set(scale, scale, scale)
                this.mesh = mesh;
                this.geometry = geometry;
                resolve()
            }
            const onError = (error) => {
                reject(error)
            }
            const loader = new STLLoader();
            loader.load(stlUrl, onLoad, undefined, onError)
        })
    }
}
