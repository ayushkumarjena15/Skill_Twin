"use client"

import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from "recharts"

interface SkillRadialChartProps {
  data: {
    name: string
    score: number
    fill: string
  }[]
}

export function SkillRadialChart({ data }: SkillRadialChartProps) {
  return (
    <div className="h-[300px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="40%" 
          cy="50%" 
          innerRadius="30%" 
          outerRadius="100%" 
          barSize={20} 
          data={data}
        >
          <RadialBar
            background={{ fill: '#f3f4f6' }}
            dataKey="score"
            cornerRadius={10}
            label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={{
              top: '50%',
              right: 0,
              transform: 'translate(0, -50%)',
              lineHeight: '24px'
            }}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#333'
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}