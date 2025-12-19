'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProperties, updatePropertyStatus, togglePropertyActive, getPropertyAggregates } from '@/services/property.service';
import { PropertyCard } from '@/components/properties/property-card';
import { PropertyFilters, PropertyFilterValues } from '@/components/properties/property-filters';
import { SortMenu, SortConfig } from '@/components/properties/sort-menu';
import { Search, SlidersHorizontal, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DraftPropertiesPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showFilters, setShowFilters] = React.useState(false);
    const [sortConfig, setSortConfig] = React.useState<SortConfig>({ sortBy: 'date', sortOrder: 'desc' });
    const [filters, setFilters] = React.useState<PropertyFilterValues>({
        agentIds: [],
        category: '',
        purpose: '',
        location: '',
        reference: '',
        propertyTypes: [],
        permitNumber: '',
        status: 'draft', // Initialize with draft
        minPrice: 0,
        maxPrice: 100000000,
        minArea: 0,
        maxArea: 50000,
    });

    // Fetch aggregates
    const { data: aggregates } = useQuery({
        queryKey: ['property-aggregates'],
        queryFn: getPropertyAggregates,
    });

    // Fetch properties
    const { data, isLoading } = useQuery({
        queryKey: ['properties', searchQuery, filters, sortConfig],
        queryFn: () => getProperties({
            search: searchQuery,
            agentIds: filters.agentIds,
            category: filters.category,
            purpose: filters.purpose,
            location: filters.location,
            reference: filters.reference,
            propertyTypes: filters.propertyTypes,
            permitNumber: filters.permitNumber,
            status: filters.status, // Pass explicit status
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minArea: filters.minArea,
            maxArea: filters.maxArea,
            sortBy: sortConfig.sortBy,
            sortOrder: sortConfig.sortOrder,
        }),
    });

    const properties = data?.data || [];
    const totalCount = data?.meta?.total || 0;

    // Mutations
    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'AVAILABLE' | 'SOLD' | 'RENTED' }) =>
            updatePropertyStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            queryClient.invalidateQueries({ queryKey: ['topAgents'] });
            toast.success('Property status updated');
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });

    const activeMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            togglePropertyActive(id, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            toast.success('Property status toggled');
        },
        onError: () => {
            toast.error('Failed to toggle status');
        }
    });

    const handleStatusChange = (id: string, status: 'AVAILABLE' | 'SOLD' | 'RENTED') => {
        statusMutation.mutate({ id, status });
    };

    const handleToggleActive = (id: string, isActive: boolean) => {
        activeMutation.mutate({ id, isActive });
    };

    return (
        <div className="flex min-h-screen bg-[#ffffff]">
            {/* Filters Sidebar */}
            {showFilters && (
                <div className="w-[340px] flex-shrink-0 bg-white border-r border-[#EDF1F7] p-6 h-screen sticky top-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <PropertyFilters
                        onFiltersChange={setFilters}
                        minPrice={aggregates?.minPrice}
                        maxPrice={aggregates?.maxPrice}
                        minArea={aggregates?.minArea}
                        maxArea={aggregates?.maxArea}
                        propertyTypes={aggregates?.propertyTypes || []}
                    />
                </div>
            )}

            <div className="flex-1 p-8 max-w-[1600px] mx-auto">
                {/* Header Title */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-[24px] font-semibold text-[#1A1A1A]" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        Draft Properties <span className="text-[#8F9BB3] font-medium ml-1">({totalCount})</span>
                    </h1>
                </div>

                {/* Filters Bar - Sticky */}
                <div
                    className="flex items-center gap-4 bg-white py-4 mb-8 rounded-xl transition-all"
                    style={{ position: 'sticky', top: '0px', zIndex: 100 }}
                >
                    <div className="relative flex-1 max-w-[400px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                        <Input
                            placeholder="Search for property, location.."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border-[#EDF1F7] pl-10 h-[44px] rounded-xl focus:ring-[#2196F3] focus:border-[#2196F3]"
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`h-[46px] px-5 rounded-lg border-[#EDF1F7] text-sm font-medium gap-2 shadow-none border-none transition-colors ${showFilters
                            ? 'bg-[#E0F2FE] text-[#0BA5EC] hover:bg-[#BAE6FD]'
                            : 'bg-white text-[#1A1A1A] hover:bg-gray-50'
                            }`}
                    >
                        {showFilters ? (
                            <X className="h-[18px] w-[18px]" />
                        ) : (
                            <SlidersHorizontal className="h-[18px] w-[18px]" />
                        )}
                        All Filters
                    </Button>
                    <div className="ml-auto">
                        <SortMenu value={sortConfig} onChange={setSortConfig} />
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-[16px] h-[400px] animate-pulse" />
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No draft properties found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            We couldn't find any properties saved as drafts.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
                        {properties.map((property) => (
                            <div key={property.id} className="flex justify-center">
                                <PropertyCard
                                    property={property}
                                    onStatusChange={handleStatusChange}
                                    onToggleActive={handleToggleActive}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
