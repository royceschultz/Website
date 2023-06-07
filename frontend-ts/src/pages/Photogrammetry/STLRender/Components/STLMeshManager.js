import { getScene } from './Scene.js'

import { STLMesh } from './STLMesh.js'

class STLMeshManagerClass {
    constructor () {
        this.meshes = {}
    }

    async loadSTL (name, stlUrl) {
        const model = new STLMesh()
        await model.loadSTL(stlUrl)
        if (this.meshes[name] != null) {
            getScene().remove(this.meshes[name].mesh)
        }
        this.meshes[name] = model
        getScene().add(model.mesh)

    }

    removeSTL (name) {
        if (this.meshes[name] == null) return
        getScene().remove(this.meshes[name].mesh)
        delete this.meshes[name]
    }

    getSTL (name) {
        return this.meshes[name]
    }
}

export const STLMeshManager = new STLMeshManagerClass()
