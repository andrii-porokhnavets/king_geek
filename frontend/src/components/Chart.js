import React from 'react';
import moment from "moment";

import { LineChart, Line, CartesianGrid, Legend, XAxis, YAxis, Tooltip } from 'recharts';

function Chart(props) {
    return (
        <LineChart width={800} height={400} data={props.data} margin={{
            top: 15, right: 30, left: 20, bottom: 15,
        }}>
            <Line type="monotone" dataKey="confirmed" stroke="#8884d8" />
            <Line type="monotone" dataKey="active" stroke="#82ca9d" />
            <Line type="monotone" dataKey="recovered" stroke="red" />
            <Line type="monotone" dataKey="deaths" stroke="black" />
            <XAxis dataKey="date" tickFormatter={tickItem =>  moment(tickItem).format('MM-DD')}/>
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip/>
            <Legend />
        </LineChart>
    )
}

export default Chart;
