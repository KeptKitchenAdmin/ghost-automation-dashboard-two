'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { month: 'Jan', affiliate: 12000, service: 8000, total: 20000 },
  { month: 'Feb', affiliate: 15000, service: 12000, total: 27000 },
  { month: 'Mar', affiliate: 18000, service: 15000, total: 33000 },
  { month: 'Apr', affiliate: 22000, service: 18000, total: 40000 },
  { month: 'May', affiliate: 25000, service: 22000, total: 47000 },
  { month: 'Jun', affiliate: 28350, service: 19500, total: 47850 },
]

export default function RevenueChart() {
  return (
    <div className="professional-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Revenue Trends</h3>
          <p className="text-gray-400 text-sm mt-1">Monthly performance comparison</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Affiliate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Service</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Total</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            labelStyle={{ color: '#D1D5DB' }}
          />
          <Line 
            type="monotone" 
            dataKey="affiliate" 
            stroke="#8B4B5C" 
            strokeWidth={3}
            dot={{ fill: '#8B4B5C', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#8B4B5C' }}
          />
          <Line 
            type="monotone" 
            dataKey="service" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#3B82F6' }}
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#10B981" 
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#10B981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}