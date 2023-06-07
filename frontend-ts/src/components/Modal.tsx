interface PropTypes {
    hidden?: boolean,
    onClose?: () => void,
    children?: JSX.Element,
}

export default function Modal(props: PropTypes): JSX.Element {
    return <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 50,
        visibility: props.hidden ? 'hidden' : 'visible',
        // pointerEvents: 'auto',
    }}
    >
        {/* Background Div */}
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            pointerEvents: 'auto',
        }}
            onClick={(e) => {
                console.log(e)
                props.onClose && props.onClose()
            }}
        />
        {/* Content Div */}
        <div className='absolute h-full w-full flex flex-row justify-center items-center'>
            <div className='pointer-events-auto'>
                {props.children}
            </div>
        </div>
        
        
    </div>
}
