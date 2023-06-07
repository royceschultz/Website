import DragableImage from '@/pages/Strava/Image/DragableImage.jsx';
import ImageModal from '@/pages/Strava/Image/ImageModal.jsx';

interface PropsType {
    src?: string
}

export default function Image(props: PropsType): JSX.Element {
    const src = props.src ?? 'TBP-01.jpg'

    return <>
        <DragableImage src={src}/>
        <ImageModal src={src} />
    </>
}
