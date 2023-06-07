import React, { useEffect, useState } from 'react'
import { STLMeshManager } from '../../STLMeshManager.js'
import { addAnimation, removeAnimation } from '../../Animate.js';
import OverlayButton from '../OverlayButton.jsx';

export default function Autorotate({name}) {
    const [autorotate, setAutorotate] = useState(true)

    const animation = () => {
        const mesh = STLMeshManager.getSTL(name)
        if (mesh && mesh.mesh) {
            mesh.mesh.rotation.y += 0.01
        }
    }

    useEffect(() => {
        if (autorotate) {
            addAnimation(`stlrotate${name}`, animation)
        } else {
            removeAnimation(`stlrotate${name}`)
        }
    }, [autorotate])


    return <OverlayButton active={autorotate} onClick={() => setAutorotate(!autorotate)}>
        Autorotate
    </OverlayButton>
}

// class AutorotateManagerClass {
//     constructor() {
//         this.animations = []
//     }

//     begin_rotation(name) {
//         const animationName = `stlrotate${name}`
//         addAnimation(animationName, () => {
//             const mesh = STLMeshManager.getSTL(name)
//             if (mesh && mesh.mesh) {
//                 mesh.mesh.rotation.y += 0.01
//             }
//         })
//     }

//     stop_rotation(name) {
//         const animationName = `stlrotate${name}`
//         removeAnimation(animationName)
//     }
// }

// export const AutorotateManager = new AutorotateManagerClass()
