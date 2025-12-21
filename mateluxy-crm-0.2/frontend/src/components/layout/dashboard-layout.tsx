'use client';

import React from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { BottomNav } from './bottom-nav';
import { NavDndProvider } from './nav-dnd-provider';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isNavVisible, setIsNavVisible] = React.useState(true);
    const [lastScrollY, setLastScrollY] = React.useState(0);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const currentScrollY = e.currentTarget.scrollTop;

        // User Request: Scrolling DOWN -> Hidden, Scrolling UP -> Visible
        if (currentScrollY > lastScrollY) {
            // Scrolling Down (scrollTop increasing) -> Hidden
            setIsNavVisible(false);
        } else if (currentScrollY < lastScrollY) {
            // Scrolling Up (scrollTop decreasing) -> Visible
            setIsNavVisible(true);
        }

        setLastScrollY(currentScrollY);
    };

    return (
        <NavDndProvider>
            <div className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-r from-white to-[#F3FAFF]">
                {/* Topbar - Full Width */}
                <Topbar />

                {/* Content Area - Sidebar + Main */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <main className="relative flex flex-1 flex-col overflow-hidden rounded-3xl bg-[#F0F0F042] p-4">
                        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-[#ffffff]">
                            <div
                                className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                onScroll={handleScroll}
                            >
                                {children}
                            </div>
                        </div>

                        {/* Bottom Navigation */}
                        <BottomNav isVisible={isNavVisible} />
                    </main>
                </div>
            </div>
        </NavDndProvider>
    );
}

