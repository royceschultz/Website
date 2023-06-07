import * as THREE from 'three'

class ChunkFetch {
    async init (url) {
        const response = await fetch(url);
        const reader = response.body.getReader();
        this.reader = reader
        this.contentLength = +response.headers.get('Content-Length');
        this.receivedLength = 0 // received that many bytes at the moment
        this.readLength = 0 // read that many bytes at the moment

        this.chunks = []
        this.current_chunk = -1
        this.current_chunk_pointer_index = -1

        this.is_loading = true
        this.is_parsing = true

        this.load()
        this.parse()
    }

    async load () {
        while (true) {
            const { done, value } = await this.reader.read();
            if (done) {
                break
            }
            this.chunks.push(value)
            this.receivedLength += value.length

            // console.log(`Received ${this.receivedLength} of ${this.contentLength} (${this.receivedLength / this.contentLength}%)`)
        }
        this.is_loading = false
        console.log('Done loading')
    }

    async read(empty_buffer) {
        const n = empty_buffer.length
        if (this.current_chunk_pointer_index == -1) {
            while (this.chunks.length == 0) {
                // On init, wait for chunks to load
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            this.current_chunk = 0
            this.current_chunk_pointer_index = 0
        }
        let read_bytes = n
        let write_bytes = 0
        while (read_bytes > 0) {
            const chunk_size = this.chunks[this.current_chunk].length
            const chunk_remaining = chunk_size - this.current_chunk_pointer_index
            if (chunk_remaining <= read_bytes) {
                // read the rest of the current chunk
                for(let i = 0; i < chunk_remaining; i++) {
                    empty_buffer[write_bytes] = this.chunks[this.current_chunk][this.current_chunk_pointer_index]
                    write_bytes += 1
                    this.current_chunk_pointer_index += 1
                }
                read_bytes -= chunk_remaining
                this.current_chunk_pointer_index += chunk_remaining

                const next_chunk = this.current_chunk + 1
                while (next_chunk >= this.chunks.length && this.is_loading) {
                    // Wait for next chunk to load
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                if (next_chunk >= this.chunks.length) {
                    // No more chunks to read
                    return { buffer: empty_buffer, done: true }
                }
                this.current_chunk = next_chunk
                this.current_chunk_pointer_index = 0
            } else {
                // Can read the rest of the bytes from the current chunk
                for(let i = 0; i < read_bytes; i++) {
                    empty_buffer[write_bytes] = this.chunks[this.current_chunk][this.current_chunk_pointer_index]
                    write_bytes += 1
                    this.current_chunk_pointer_index += 1
                }
                read_bytes = 0
            }
        }
        return { buffer: empty_buffer, done: false }
    }

    async parse() {
        const header = new Uint8Array(80)
        const n_triangles_buffer = new Uint8Array(4)
        
        let res = await this.read(header)
        res = await this.read(n_triangles_buffer)
        this.n_triangles = new Uint32Array(n_triangles_buffer.buffer)[0]

        this.vertices = new Float32Array(this.n_triangles * 3 * 3)
        this.normals = new Float32Array(this.n_triangles * 3 * 3)

        let n_p = 0

        const triangle_buffer = new Uint8Array(50)
        for (let i = 0; i < this.n_triangles; i++) {
            res = await this.read(triangle_buffer)
            const parsed = new Float32Array(triangle_buffer.slice(0, 48).buffer)
            const normal = parsed.slice(0, 3)
            const v1 = parsed.slice(3, 6)
            const v2 = parsed.slice(6, 9)
            const v3 = parsed.slice(9, 12)
            // const attr = new Uint16Array(triangle_buffer.slice(48, 50).buffer)

            const vs = [v1, v2, v3]
            let n = 0
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    this.vertices[n_p + n] = vs[j][k]
                    this.normals[n_p + n] = normal[k]
                    n += 1
                }
            }
            n_p += 9
        }
        this.is_parsing = false
        console.log('Done parsing')
    }
}

export class MultiPartSTL {
    constructor () {}

    async init () {
        const reader = new ChunkFetch()
        await reader.init('./test3.stl')
        this.reader = reader

        let header_buffer = new Uint8Array(80)
        let res = await reader.read(header_buffer)

        let n_triangles_buffer = new Uint8Array(4)
        res = await reader.read(n_triangles_buffer)
        this.n_triangles = new Uint32Array(res.buffer.buffer)[0]

        console.log('n_triangles')
        console.log(this.n_triangles)
    }

    async getGeometry(n) {
        while (this.reader.is_parsing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.reader.vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(this.reader.normals, 3));
        return geometry
    }
}
