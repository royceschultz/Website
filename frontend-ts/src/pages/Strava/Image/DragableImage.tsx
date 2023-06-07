import { useContext } from 'react';
import DragableContainer from '@components/DragableContainer';

import { GlobalContext } from '@/GlobalContext';

interface PropTypes {
    src: string,
}

export default function DragableImage({src}:PropTypes): JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { toolStates, setToolState } = globalContext.strava

    const state = toolStates.dragableImage ?? 'inactive'
    const isActive = (state === 'active')

    const Overlay = () => <>
        <button style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
        }}
        className='bg-gray-500 hover:bg-gray-800 text-gray-200 font-bold py-1 px-2 m-1 rounded'
        onClick={() => setToolState('dragableImage', 'inactive')}
        >
            {/* Close Button */}
            &#9747;
        </button>
        <button style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
        }}
        className='bg-gray-500 hover:bg-gray-800 text-gray-200 font-bold py-1 px-2 m-1 rounded'
        onClick={() => setToolState('imageModal', 'active')}
        >
            {/* Expand Modal Button */}
            &#9166;
        </button>
    </>

    return <DragableContainer
        defaultRight={30} defaultTop={30}
        hidden={!isActive}
        overlay={<Overlay />}
    >
        <img src={src}
            alt='Dragable'
            style={{
                width: '300px',
                minWidth: '300px',
                pointerEvents: 'none',
                borderRadius: '10px',
            }}
        />
    </DragableContainer>
}
