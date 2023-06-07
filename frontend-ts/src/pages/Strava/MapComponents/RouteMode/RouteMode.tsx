import Cursor from './Cursor'
import Route from './Route'
import HighlightRoute from './HighlightRoute'
import ZoomRoute from './ZoomRoute'
import ImageManager from '../../Image/ImageManager'

interface PropsType {
    hidden?: boolean
}

export default function RouteMode(props:PropsType): JSX.Element {
    const hidden = props.hidden ?? false
    return <>
        <Route hidden={hidden} />
        <ZoomRoute hidden={hidden} />
        <HighlightRoute hidden={hidden} />
        <ImageManager hidden={hidden} />
        <Cursor hidden={hidden} />
    </>
}
