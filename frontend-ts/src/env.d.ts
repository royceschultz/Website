/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MAPBOXGL_TOKEN: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
