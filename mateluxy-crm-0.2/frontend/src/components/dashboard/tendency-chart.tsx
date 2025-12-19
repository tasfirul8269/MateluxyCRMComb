'use client';

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

const data = [
    { name: 'Jan', value: 180 },
    { name: 'Feb', value: 200 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 240 },
    { name: 'May', value: 190 },
    { name: 'Jun', value: 250 },
    { name: 'Jul', value: 150 },
    { name: 'Aug', value: 310 },
    { name: 'Sep', value: 200 },
    { name: 'Oct', value: 260 },
    { name: 'Nov', value: 350 },
    { name: 'Dec', value: 190 },
    { name: 'Jan', value: 280 },
    { name: 'Jan', value: 360 }, // Extra point for trend
];

export function TendencyChart() {
    const [activeTab, setActiveTab] = useState<'selling' | 'renting'>('selling');

    return (
        <div className="bg-white p-6 rounded-[20px] border border-[#EDF1F7] mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-[18px] font-bold text-[#1A1A1A]">Property Selling Tendency UAE</h3>
                <div className="flex bg-[#F7F9FC] p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('selling')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'selling'
                            ? 'bg-white text-[#1A1A1A] shadow-sm'
                            : 'text-[#8F9BB3] hover:text-[#1A1A1A]'
                            }`}
                    >
                        Selling tendency
                    </button>
                    <button
                        onClick={() => setActiveTab('renting')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'renting'
                            ? 'bg-white text-[#1A1A1A] shadow-sm'
                            : 'text-[#8F9BB3] hover:text-[#1A1A1A]'
                            }`}
                    >
                        Renting tendency
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 0,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0BA5EC" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#0BA5EC" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#EDF1F7" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#8F9BB3', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#8F9BB3', fontSize: 12 }}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#0BA5EC"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
