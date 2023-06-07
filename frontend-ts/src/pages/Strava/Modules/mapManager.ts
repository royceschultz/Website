import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOXGL_TOKEN

if (!mapboxgl.accessToken) {
    throw new Error('Mapbox token not found. Please set it in .env file.')
}

console.log('mapboxgl.accessToken', mapboxgl.accessToken)
console.log('meta', import.meta.env)

export const initMap = (container_id='mapbox') => {
    console.log('Initializing map')
    const map = new mapboxgl.Map({
        container: container_id, // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [-122.483696, 37.833818], // starting position [lng, lat]
        zoom: 9 // starting zoom
    })
    return map
}
