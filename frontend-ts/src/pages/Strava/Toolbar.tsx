import { useContext } from 'react'
import { GlobalContext } from '@/GlobalContext'

interface ButtonPropsType {
    onClick: () => void
    children: JSX.Element | JSX.Element[] | string
}

export default function Toolbar(): JSX.Element {
    const globalContext = useContext(GlobalContext)
    const { setToolState } = globalContext.strava

    const Button = (props:ButtonPropsType) => <div className='absolute top-0 right-0 pointer-events-auto'>
        <button className='bg-red-400 hover:bg-red-800 text-gray-200 font-bold py-2 px-3 m-2 rounded text-3xl'
            onClick={props.onClick}
        >
            {props.children}
        </button>
    </div>
    
    return <div>
        <Button onClick={() => setToolState('dragableImage', 'active')}>
            &#128247;
        </Button>
    </div>
}
