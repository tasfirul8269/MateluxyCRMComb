'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';

const data = [
    { name: 'Jan', residential: 20, commercial: 100 },
    { name: 'Feb', residential: 120, commercial: 80 },
    { name: 'Mar', residential: 90, commercial: 160 },
    { name: 'Apr', residential: 200, commercial: 130 },
    { name: 'May', residential: 140, commercial: 180 },
];

const data2 = [
    { name: 'Jan', residential: 20, commercial: 120 },
    { name: 'Feb', residential: 140, commercial: 60 },
    { name: 'Mar', residential: 100, commercial: 150 },
    { name: 'Apr', residential: 220, commercial: 180 },
    { name: 'May', residential: 180, commercial: 210 },
];

interface CategoryChartProps {
    title: string;
    data: any[];
}

function CategoryChart({ title, data }: CategoryChartProps) {
    const [showResidential, setShowResidential] = useState(true);
    const [showCommercial, setShowCommercial] = useState(true);

    return (
        <div className="bg-white p-6 rounded-[20px] border border-[#EDF1F7] flex-1">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-[16px] font-bold text-[#1A1A1A]">{title}</h3>
                <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={`res-${title}`}
                            checked={showResidential}
                            onCheckedChange={(c) => setShowResidential(!!c)}
                            className="border-[#0BA5EC] data-[state=checked]:bg-[#0BA5EC]"
                        />
                        <label
                            htmlFor={`res-${title}`}
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#8F9BB3]"
                        >
                            Residential
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={`com-${title}`}
                            checked={showCommercial}
                            onCheckedChange={(c) => setShowCommercial(!!c)}
                            className="border-[#0BA5EC] data-[state=checked]:bg-[#0BA5EC]"
                        />
                        <label
                            htmlFor={`com-${title}`}
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#8F9BB3]"
                        >
                            Commercial
                        </label>
                    </div>
                </div>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                    >
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
                            domain={[0, 300]}
                            ticks={[0, 60, 120, 180, 240, 300]}
                        />
                        <Tooltip />
                        {showResidential && (
                            <Line
                                type="monotone"
                                dataKey="residential"
                                stroke="#EF4444"
                                strokeWidth={3}
                                dot={{ r: 0 }}
                                activeDot={{ r: 4 }}
                            />
                        )}
                        {showCommercial && (
                            <Line
                                type="monotone"
                                dataKey="commercial"
                                stroke="#FFCDD2"
                                strokeWidth={3}
                                strokeDasharray="5 5"
                                dot={{ r: 0 }}
                                activeDot={{ r: 4 }}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function CategoryCharts() {
    return (
        <div className="flex flex-col md:flex-row gap-6 mb-8">
            <CategoryChart title="For buy" data={data} />
            <CategoryChart title="For Rent" data={data2} />
        </div>
    );
}
