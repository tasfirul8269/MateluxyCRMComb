import React from 'react';
import { Facebook, Instagram, Globe } from 'lucide-react';

function LeadBar({
    icon,
    color,
    value,
    max,
}: {
    icon: React.ReactNode;
    color: string;
    value: number;
    max: number;
}) {
    const percentage = (value / max) * 100;

    return (
        <div className="flex items-center gap-5 mb-5 last:mb-0">
            <div className="w-6 flex justify-center shrink-0">
                {icon}
            </div>
            <div className="flex-1">
                <div className="h-4 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                </div>
            </div>
            <span className="text-[14px] font-bold text-[#1A1A1A] w-12 text-right">{value}</span>
        </div>
    );
}

export function LeadStats() {
    return (
        <div className="bg-white p-6 rounded-[20px] border border-[#EDF1F7]">
            <h3 className="text-[#8F9BB3] text-sm font-medium mb-6">Leads</h3>
            <div className="space-y-2">
                <LeadBar
                    icon={<Facebook className="w-6 h-6 text-[#1877F2] fill-current" />}
                    color="#1877F2"
                    value={1202}
                    max={1500}
                />
                <LeadBar
                    icon={<Instagram className="w-6 h-6 text-[#E1306C]" />}
                    color="#E1306C" // Using solid color for progress bar to match clean design
                    value={601}
                    max={1500}
                />
                <LeadBar
                    icon={
                        <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                    }
                    color="#000000"
                    value={892}
                    max={1500}
                />
                <LeadBar
                    // Using a Generic Red Icon for the last one (Website/Other)
                    // Currently reusing Globe but making it Red
                    icon={<div className="w-6 h-6 rounded-full border-2 border-[#EF4444] flex items-center justify-center text-[#EF4444] font-bold text-[10px]">
                        Web
                    </div>}
                    color="#EF4444"
                    value={765}
                    max={1500}
                />
            </div>
        </div>
    );
}
