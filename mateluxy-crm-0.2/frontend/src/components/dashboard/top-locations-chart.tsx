'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const data = [
    { name: 'Burj Khalifa', offPlan: 170, forRent: 100, forSell: 80 },
    { name: 'Jabel Ali', offPlan: 60, forRent: 180, forSell: 40 },
    { name: 'Dubai Marina', offPlan: 80, forRent: 60, forSell: 90 },
    { name: 'Dubai Mall', offPlan: 110, forRent: 50, forSell: 40 },
];

export function TopLocationsChart() {
    const [viewBy, setViewBy] = useState('listing');
    const [filters, setFilters] = useState({
        offPlan: true,
        forRent: true,
        forSell: true,
    });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                    <p className="font-bold mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }}></div>
                            <span>{entry.name}: {entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-8 rounded-[20px] border border-[#EDF1F7] mb-8">
            <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-8">Top Locations</h3>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <RadioGroup defaultValue="listing" onValueChange={setViewBy} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="listing" id="listing" className="text-[#EF4444] border-[#EF4444]" />
                        <Label htmlFor="listing" className="font-medium text-[#1A1A1A] cursor-pointer">By Listing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="impression" id="impression" className="border-gray-300" />
                        <Label htmlFor="impression" className="font-medium text-[#8F9BB3] cursor-pointer">By Impression</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="leads" id="leads" className="border-gray-300" />
                        <Label htmlFor="leads" className="font-medium text-[#8F9BB3] cursor-pointer">By Leads</Label>
                    </div>
                </RadioGroup>

                <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="offPlan"
                            checked={filters.offPlan}
                            onCheckedChange={(c) => setFilters(prev => ({ ...prev, offPlan: !!c }))}
                            className="border-[#0EA5E9] data-[state=checked]:bg-[#0EA5E9] data-[state=checked]:border-[#0EA5E9] rounded-[4px]"
                        />
                        <Label htmlFor="offPlan" className="text-sm font-medium text-[#64748B] cursor-pointer">Off Plan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="forRent"
                            checked={filters.forRent}
                            onCheckedChange={(c) => setFilters(prev => ({ ...prev, forRent: !!c }))}
                            className="border-[#7DD3FC] data-[state=checked]:bg-[#7DD3FC] data-[state=checked]:border-[#7DD3FC] rounded-[4px]"
                        />
                        <Label htmlFor="forRent" className="text-sm font-medium text-[#64748B] cursor-pointer">For Rent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="forSell"
                            checked={filters.forSell}
                            onCheckedChange={(c) => setFilters(prev => ({ ...prev, forSell: !!c }))}
                            className="border-[#BAE6FD] data-[state=checked]:bg-[#BAE6FD] data-[state=checked]:border-[#BAE6FD] rounded-[4px]"
                        />
                        <Label htmlFor="forSell" className="text-sm font-medium text-[#64748B] cursor-pointer">For Sell</Label>
                    </div>
                </div>
            </div>

            <div className="h-[250px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                        barSize={24}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#EDF1F7" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 13, fontWeight: 500 }}
                            width={100}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        {filters.offPlan && <Bar dataKey="offPlan" name="Off Plan" stackId="a" fill="#039BE5" radius={[0, 0, 0, 0]} />}
                        {filters.forRent && <Bar dataKey="forRent" name="For Rent" stackId="a" fill="#4FC3F7" radius={[0, 0, 0, 0]} />}
                        {filters.forSell && <Bar dataKey="forSell" name="For Sell" stackId="a" fill="#B3E5FC" radius={[0, 10, 10, 0]} />}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom Legend */}
            <div className="flex justify-center gap-10">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-[2px] bg-[#039BE5]"></div>
                    <span className="text-sm font-medium text-[#64748B]">Off Plan</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-[2px] bg-[#4FC3F7]"></div>
                    <span className="text-sm font-medium text-[#64748B]">For Rent</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-[2px] bg-[#B3E5FC]"></div>
                    <span className="text-sm font-medium text-[#64748B]">For Sell</span>
                </div>
                <div className="ml-auto text-sm font-medium text-[#0BA5EC] cursor-pointer">
                    All Locations
                </div>
            </div>
        </div>
    );
}
