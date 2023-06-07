import { useContext } from 'react'
import { GlobalContext } from '@/GlobalContext'
import Modal from '@components/Modal'

interface PropsType {
    src: string
}

export default function ImageModal(props: PropsType): JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { toolStates, setToolState } = globalContext.strava
    const state = toolStates.imageModal ?? 'inactive'
    const isActive = (state === 'active')

    return <Modal hidden={!isActive} onClose={() => setToolState('imageModal', 'inactive')}>
        <img src={props.src}
            alt='Modal'
            style={{
                width: '50vw',
                maxHeight: '80vh',
                objectFit: 'contain',
                margin: '10px',
                pointerEvents: 'none',
                borderRadius: '10px',
            }} />
    </Modal>
}
