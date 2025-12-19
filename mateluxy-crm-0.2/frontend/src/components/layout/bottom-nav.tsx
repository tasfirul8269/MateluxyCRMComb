'use client';

import React from 'react';
import {
    Building2,
    CalendarDays,
    User,
    UserCheck,
    GitBranch,
    History
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
    isVisible?: boolean;
}

export function BottomNav({ isVisible = true }: BottomNavProps) {
    return (
        <div className={cn(
            "absolute bottom-8 left-1/2 z-50 -translate-x-1/2 transform transition-transform duration-300",
            !isVisible && "translate-y-[200%]"
        )}>
            <div className="flex items-center gap-8 rounded-2xl bg-white px-8 py-4 shadow-2xl border border-gray-100">
                {/* Icons */}
                <div className="flex items-center gap-8">
                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                        <Building2 className="h-6 w-6" />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                        <CalendarDays className="h-6 w-6" />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                        <User className="h-6 w-6" />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                        <UserCheck className="h-6 w-6" />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                        <GitBranch className="h-6 w-6" />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                        <History className="h-6 w-6" />
                    </button>
                </div>

                {/* Divider */}
                <div className="h-8 w-[1px] bg-gray-200" />

                {/* Toggle */}
                <div className="flex items-center rounded-full bg-gray-100 p-1">
                    <button className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">
                        Admin
                    </button>
                    <button className="rounded-full bg-blue-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm">
                        CRM
                    </button>
                </div>
            </div>
        </div>
    );
}
