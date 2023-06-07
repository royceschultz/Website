import { DatapointType } from "@/GlobalContext";

interface XYZCoordinate {
    x: number,
    y: number,
    z: number
}

interface DatapointPlusType extends DatapointType {
    dist_diff?: number,
    xyzPosition?: XYZCoordinate,
}

export const parseGPX = (content:string):Array<DatapointType> => {
    let parser = new DOMParser();
    let xmlData = parser.parseFromString(content, "text/xml")
    let datapoints = Array.from(xmlData.getElementsByTagName('trkpt')).map((point):DatapointPlusType => {
        // Use Tree Traversal to get all the data
        // Leaves are the data fields
        let stack:any[] = []
        const fields:DatapointPlusType = {}
        // Initialize search from root
        Array.from(point.children).forEach((child) => stack.push(child))
        while (stack.length > 0) {
            const child = stack.pop()
            if (child.children.length > 0) {
                Array.from(child.children).forEach((c) => {
                    stack.push(c)
                })
            } else {
                let d = child.innerHTML
                const name:string = child.localName
                if (name === 'time') {
                    d = new Date(d)
                } else {
                    d = parseFloat(d)
                }
                fields[name] = d
            }
        }
        const latAtt = point.getAttribute('lat')
        const lonAtt = point.getAttribute('lon')
        if (latAtt != null || lonAtt != null) {
            fields.lat = parseFloat(latAtt ?? '')
            fields.lon = parseFloat(lonAtt ?? '')
        }
        return fields  
    })
    const sphericalToCartesian = (lat:number, lon:number, ele:number) => {
        const phi = (90 - lat) * Math.PI / 180
        const theta = (lon + 180) * Math.PI / 180
        const r = ele + 6371000
        const x = r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.sin(phi) * Math.sin(theta)
        const z = r * Math.cos(phi)
        return {x, y, z}
    }
    datapoints = datapoints.map((d, i) => {
        return {
            ...d,
            index: i,
            rideTime: i == 0 ? 0 : (d.time.getTime() - datapoints[0].time.getTime()) / 1000,
            xyzPosition: sphericalToCartesian(d.lat, d.lon, d.ele)
        }
    })
    const distance = (p1:XYZCoordinate, p2:XYZCoordinate):number => {
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const dz = p1.z - p2.z
        return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }
    datapoints = datapoints.map((d, i) => {
        const dist_m = i == 0 ? 0 : distance(d.xyzPosition, datapoints[i - 1].xyzPosition)
        const dt = i == 0 ? 0 : d.time.getTime() - datapoints[i - 1].time.getTime()
        const speed_mps = dt == 0 ? 0 : dist_m / (dt / 1000)
        const speed_kph = speed_mps * 3.6
        return {
            ...d,
            dist_diff: dist_m,
            speed: speed_kph,
        }
    })
    let totalDist = 0
    datapoints.forEach((d) => {
        d.distance = totalDist / 1000
        totalDist += d.dist_diff ?? 0
    })
    return datapoints.map((d):DatapointType => {
        return {
            index: d.index,
            time: d.time,
            rideTime: d.rideTime,
            lat: d.lat,
            lon: d.lon,
            ele: d.ele,
            hr: d.hr,
            power: d.power,
            cad: d.cad,
            distance: d.distance,
            speed: d.speed,
            temp: d.temp,
        }
    })
}
