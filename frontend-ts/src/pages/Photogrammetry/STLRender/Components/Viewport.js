export const getViewport = () => {
    return document.getElementById('CanvasContainer').getBoundingClientRect()
}

export const getAspectRatio = () => {
    const container = document.getElementById('CanvasContainer')
    const viewportWidth = container.clientWidth
    const viewportHeight = container.clientHeight
    return viewportWidth / viewportHeight
}
