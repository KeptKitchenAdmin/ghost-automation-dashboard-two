'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'Viral Hits', value: 0, color: '#8B4B5C' },
  { name: 'High Engagement', value: 0, color: '#10B981' },
  { name: 'Medium Performance', value: 0, color: '#3B82F6' },
  { name: 'Low Performance', value: 0, color: '#6B7280' },
]

export default function ContentPerformanceChart() {
  return (
    <div className="professional-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Content Distribution</h3>
          <p className="text-gray-400 text-sm mt-1">Performance breakdown</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            formatter={(value: number) => [`${value}%`, '']}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-400">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-300">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}