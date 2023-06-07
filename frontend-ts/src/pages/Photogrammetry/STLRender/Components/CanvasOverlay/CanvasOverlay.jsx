import React, { useState, useEffect } from 'react'
import styles from './CanvasOverlay.module.css'
import { addAnimation, removeAnimation } from '../Animate.js';
import { STLMeshManager } from '../STLMeshManager';

import Autorotate from './Buttons/Autorotate.jsx'

function CanvasOverlay() {

    return <div className={styles.CanvasOverlay}>
        <Autorotate name='main' />
    </div>
}

export default CanvasOverlay
