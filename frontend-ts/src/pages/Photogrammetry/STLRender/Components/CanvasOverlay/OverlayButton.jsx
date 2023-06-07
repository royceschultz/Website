import styles from './CanvasOverlay.module.css'

export default function OverlayButton ({children, active, onClick}) {
    const getClassName = () => {
        if (active) {
            return `${styles.CanvasOverlayButton} ${styles.CanvasOverlayButtonActive}`
        }
        return `${styles.CanvasOverlayButton} ${styles.CanvasOverlayButtonInactive}`
    }

    return <div className={getClassName()} onClick={() => onClick()}>
        {children}
    </div>
}
