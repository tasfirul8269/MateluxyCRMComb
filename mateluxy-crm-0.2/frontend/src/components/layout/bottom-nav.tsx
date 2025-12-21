'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBottomNavStore, PinnedNavItem } from '@/lib/store/bottom-nav-store';
import { getIcon } from '@/lib/utils/icons';
import { MENU_ITEMS, MenuItem } from './sidebar';
import { useNavDnd } from './nav-dnd-provider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BottomNavProps {
    isVisible?: boolean;
}

// Sortable pinned item component
function SortablePinnedItem({ item, onRemove }: { item: PinnedNavItem; onRemove: () => void }) {
    const pathname = usePathname();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.href,
        data: {
            id: item.href,
            title: item.title,
            iconKey: item.iconKey,
            href: item.href,
            type: 'pinned-item',
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const Icon = getIcon(item.iconKey);
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative flex items-center justify-center",
                isDragging && "opacity-50"
            )}
        >
            <Link
                href={item.href}
                {...attributes}
                {...listeners}
                className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-xl transition-all",
                    isActive
                        ? "bg-[#0aa5ff] text-white"
                        : "text-gray-500 hover:text-[#0aa5ff] hover:bg-[#f0f7ff]"
                )}
                title={item.title}
            >
                <Icon className="h-5 w-5" />
            </Link>
            {/* Remove button on hover */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove();
                }}
                className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
                <X className="h-2.5 w-2.5" />
            </button>
        </div>
    );
}

// Menu item for add popover
function AddMenuItem({ item, onAdd, isAlreadyPinned }: {
    item: MenuItem;
    onAdd: () => void;
    isAlreadyPinned: boolean;
}) {
    const Icon = item.icon;

    return (
        <button
            onClick={onAdd}
            disabled={isAlreadyPinned}
            className={cn(
                "flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg transition-colors",
                isAlreadyPinned
                    ? "opacity-50 cursor-not-allowed bg-gray-50"
                    : "hover:bg-[#f0f7ff]"
            )}
        >
            <Icon className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-700">{item.title}</span>
            {isAlreadyPinned && (
                <span className="ml-auto text-xs text-gray-400">Added</span>
            )}
        </button>
    );
}

export function BottomNav({ isVisible = true }: BottomNavProps) {
    const { pinnedItems, addItem, removeItem, hasItem } = useBottomNavStore();
    const { isDragging, isOverDropZone } = useNavDnd();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Drop zone for receiving items from sidebar
    const { setNodeRef: setDropZoneRef, isOver } = useDroppable({
        id: 'bottom-nav-drop-zone',
    });

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAddItem = (item: MenuItem) => {
        addItem({
            title: item.title,
            href: item.href,
            iconKey: item.iconKey,
        });
        setIsAddOpen(false);
    };

    // Filter menu items that can be added (exclude items with submenus and under development)
    const addableItems = MENU_ITEMS.filter(item => !item.submenu && !item.underDevelopment);

    if (!mounted) {
        return null;
    }

    return (
        <div className={cn(
            "absolute bottom-8 left-1/2 z-50 -translate-x-1/2 transform transition-transform duration-300",
            !isVisible && "translate-y-[200%]"
        )}>
            <div
                ref={setDropZoneRef}
                className={cn(
                    "flex items-center gap-4 rounded-2xl bg-white px-6 py-3 shadow-2xl border-2 transition-all duration-200",
                    isDragging && "border-dashed",
                    isOver || isOverDropZone
                        ? "border-[#0aa5ff] bg-[#f0f7ff]"
                        : "border-gray-100"
                )}
            >
                {/* Drop zone indicator when dragging */}
                {isDragging && pinnedItems.length === 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 text-[#0aa5ff] text-sm font-medium animate-pulse">
                        <Plus className="h-4 w-4" />
                        <span>Drop here to pin</span>
                    </div>
                )}

                {/* Pinned Items */}
                {pinnedItems.length > 0 && (
                    <SortableContext
                        items={pinnedItems.map(item => item.href)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className="flex items-center gap-3">
                            {pinnedItems.map((item) => (
                                <SortablePinnedItem
                                    key={item.href}
                                    item={item}
                                    onRemove={() => removeItem(item.href)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                )}

                {/* Add Button */}
                <Popover open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <PopoverTrigger asChild>
                        <button
                            className={cn(
                                "flex items-center justify-center h-10 w-10 rounded-xl border-2 border-dashed transition-all",
                                isAddOpen
                                    ? "border-[#0aa5ff] bg-[#f0f7ff] text-[#0aa5ff]"
                                    : "border-gray-300 text-gray-400 hover:border-[#0aa5ff] hover:text-[#0aa5ff] hover:bg-[#f0f7ff]"
                            )}
                            title="Add shortcut"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-64 p-2 bg-white shadow-xl border border-gray-100 rounded-2xl"
                        align="center"
                        side="top"
                        sideOffset={12}
                    >
                        <div className="mb-2 px-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Add Shortcut</p>
                        </div>
                        <div className="max-h-64 overflow-y-auto space-y-1">
                            {addableItems.map((item) => (
                                <AddMenuItem
                                    key={item.href}
                                    item={item}
                                    onAdd={() => handleAddItem(item)}
                                    isAlreadyPinned={hasItem(item.href)}
                                />
                            ))}
                        </div>
                        {pinnedItems.length >= 6 && (
                            <p className="mt-2 px-2 text-xs text-amber-600">Maximum 6 shortcuts reached</p>
                        )}
                    </PopoverContent>
                </Popover>

                {/* Divider */}
                <div className="h-8 w-[1px] bg-gray-200" />

                {/* Toggle */}
                <div className="flex items-center rounded-full bg-gray-100 p-1">
                    <button className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">
                        Admin
                    </button>
                    <button className="rounded-full bg-[#0aa5ff] px-4 py-1.5 text-sm font-medium text-white shadow-sm">
                        CRM
                    </button>
                </div>
            </div>
        </div>
    );
}
