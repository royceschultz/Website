import { useState } from 'react'

import ReactPlot from './GraphComponents/ReactPlot'
import { DatapointType } from '@/GlobalContext'

export default function Graphs(){
    const [xField, setXField] = useState<keyof DatapointType>('time')
    return <div
            // className='h-full overflow-y-scroll'
            style={{
                userSelect: 'none',
                paddingBottom: '1em',
                color: 'white'
            }}>
        <div>
            <div
                onClick={() => setXField('time')}
                className={`inline-block cursor-pointer ${xField === 'time' ? 'border-b-2 border-white' : ''}`}>
                Time
            </div>
            <div onClick={() => setXField('rideTime')}
                className={`inline-block cursor-pointer ${xField === 'rideTime' ? 'border-b-2 border-white' : ''}`}>
                Ride Time
            </div>
            <div onClick={() => setXField('distance')}
            className={`inline-block cursor-pointer ${xField === 'distance' ? 'border-b-2 border-white' : ''}`}>
                Distance
            </div>
        </div>
        <ReactPlot title='Elevation' xField={xField} yField='ele' color='rgb(38, 32, 130)'/>
        <ReactPlot title='Speed' xField={xField} yField='speed' color='rgb(38, 32, 130)' />
        <ReactPlot title='Power' xField={xField} yField='power' color='rgb(95,54,196)' />
        <ReactPlot title='Heartrate' xField={xField} yField='hr' color='rgb(179,39,66)' />
        <ReactPlot title='Cadence' xField={xField} yField='cad' color='rgb(38, 32, 130)' />
    </div>
}
