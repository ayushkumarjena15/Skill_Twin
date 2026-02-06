"use client"

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from "recharts"
import { motion } from "framer-motion"

interface CompositionChartProps {
    data: {
        name: string
        score: number
        fill: string
    }[]
}

export function CompositionChart({ data }: CompositionChartProps) {
    // Transform data for Radar Chart if needed, or use as is.
    // We need a single "subject" key for the axis names.
    const chartData = data.map(item => ({
        subject: item.name,
        A: item.score,
        fullMark: 100
    }))

    const CustomTick = ({ payload, x, y, textAnchor, stroke, radius }: any) => {
        return (
            <g className="recharts-layer recharts-polar-angle-axis-tick">
                <text
                    x={x}
                    y={y}
                    dy={payload.coordinate > 0 ? 0 : 10} // Simple adjustment
                    textAnchor={textAnchor}
                    fill="#a1a1aa" // zinc-400
                    fontSize={10}
                    fontFamily="var(--font-mono)"
                    fontWeight="bold"
                    className="uppercase tracking-wider"
                >
                    {payload.value}
                </text>
            </g>
        );
    };

    return (
        <div className="h-[300px] w-full relative">
            {/* Animated background pulse */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-48 h-48 bg-violet-500/10 rounded-full blur-3xl"
                />
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid gridType="polygon" stroke="#27272a" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={(props) => <CustomTick {...props} />}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Score"
                        dataKey="A"
                        stroke="#8b5cf6" // violet-500
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                        isAnimationActive={true}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg shadow-xl text-xs">
                                        <p className="font-semibold text-white mb-1">{payload[0].payload.subject}</p>
                                        <p className="font-mono text-violet-400">
                                            Score: <span className="font-bold">{payload[0].value}</span>/100
                                        </p>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}
