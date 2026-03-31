import React from 'react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const LineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#4F46E5" 
          strokeWidth={2}
          dot={{ fill: '#4F46E5' }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export default LineChart
