let started = false;
let stopAnimate_flag = false
let pauseAnimate_flag = false
let animations = {}

export const animate = async () => {
    if (stopAnimate_flag) {
        console.log('animation stopped')
        started = false
        return
    }
    if (pauseAnimate_flag) {
        console.log('animation paused')
        requestAnimationFrame(animate)
        return
    }
    for (const key in animations) {
        animations[key]()
    }
    requestAnimationFrame(animate)
}

export const stopAnimate = () => {
    stopAnimate_flag = true
}

export const startAnimate = () => {
    console.log('starting animate')
    if (started) {
        console.log('already started')
        return
    }
    started = true
    animate()
}

export const restartAnimate = () => {
    console.log('restarting animate')
    if (!stopAnimate_flag) return
    stopAnimate_flag = false
    pauseAnimate_flag = false
    startAnimate()
}


export const pauseAnimate = () => {
    pauseAnimate_flag = true
}

export const resumeAnimate = () => {
    pauseAnimate_flag = false
}

export const addAnimation = (name, animation) => {
    if (name in animations) {
        console.log('WARNING: animation already in animations')
        console.log('Skipping animation')
        return
    }
    animations[name] = animation
}

export const removeAnimation = (name) => {
    delete animations[name]
}
