'use client';

import React, { useState } from 'react';
import { UseFormRegister, Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Plus, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAmenities, useCreateAmenity } from '@/hooks/use-amenities';

interface AdditionalTabProps {
    register: UseFormRegister<any>;
    control: Control<any>;
    errors: FieldErrors<any>;
    setValue: UseFormSetValue<any>;
    watch: UseFormWatch<any>;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function AdditionalTab({ register, control, errors, setValue, watch }: AdditionalTabProps) {
    // Watch form values for persistence
    const availableFrom = watch('availableFrom');
    const amenitiesList = watch('amenities');

    // Initialize state from form values
    const [availabilityType, setAvailabilityType] = useState<'immediately' | 'fromDate'>(
        availableFrom ? 'fromDate' : 'immediately'
    );
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        availableFrom ? new Date(availableFrom) : null
    );
    const [currentMonth, setCurrentMonth] = useState(
        availableFrom ? new Date(availableFrom) : new Date()
    );
    const [showMore, setShowMore] = useState(false);

    // Initialize amenities set from form array
    const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(() => {
        const initialSet = new Set<string>();
        if (Array.isArray(amenitiesList)) {
            amenitiesList.forEach((id: string) => initialSet.add(id));
        }
        return initialSet;
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [newAmenityName, setNewAmenityName] = useState('');

    // Fetch amenities from database
    const { data: amenities = [], isLoading: isLoadingAmenities } = useAmenities();
    const createAmenityMutation = useCreateAmenity();

    const handleAutoGenerate = () => {
        const randomRef = `REF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        setValue('reference', randomRef);
    };

    const toggleAmenity = (id: string) => {
        const next = new Set(selectedAmenities);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedAmenities(next);
        // Update form value with selected amenity IDs
        setValue('amenities', Array.from(next));
    };

    const handleAddAmenity = async () => {
        if (!newAmenityName.trim()) return;

        try {
            await createAmenityMutation.mutateAsync({ name: newAmenityName.trim() });
            setNewAmenityName('');
            setShowAddModal(false);
        } catch (error: any) {
            console.error('Failed to create amenity:', error);
        }
    };

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
        setValue('availableFrom', newDate.toISOString());
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const displayedAmenities = showMore ? amenities : amenities.slice(0, 20);

    return (
        <div className="space-y-6">
            {/* Row 1: Reference and Available */}
            <div className="grid grid-cols-2 gap-8">
                {/* Reference */}
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="reference" className="text-[15px] font-medium text-gray-700">
                            Reference <span className="text-red-500">*</span>
                        </Label>
                        <button
                            type="button"
                            onClick={handleAutoGenerate}
                            className="flex items-center gap-1 text-[#00AAFF] text-sm font-medium hover:text-[#0090dd] transition-colors"
                        >
                            <Sparkles className="w-4 h-4" />
                            Auto Generate
                        </button>
                    </div>
                    <Input
                        id="reference"
                        placeholder="Enter property reference"
                        className={cn(
                            "h-[50px] bg-white border-[#EDF1F7] rounded-lg focus-visible:ring-blue-500 placeholder:text-[#8F9BB3] text-[15px]",
                            errors.reference && "border-red-500"
                        )}
                        {...register('reference')}
                    />
                    {errors.reference && <p className="text-sm text-red-500">{errors.reference.message as string}</p>}
                </div>

                {/* Available */}
                <div className="space-y-2.5">
                    <Label className="text-[15px] font-medium text-gray-700">
                        Available :
                    </Label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setAvailabilityType('immediately')}
                            className={cn(
                                "flex-1 h-[50px] rounded-full border text-[15px] font-medium transition-colors",
                                availabilityType === 'immediately'
                                    ? "bg-white border-[#EDF1F7] text-gray-700"
                                    : "bg-white border-[#EDF1F7] text-gray-400"
                            )}
                        >
                            Immediately
                        </button>
                        <button
                            type="button"
                            onClick={() => setAvailabilityType('fromDate')}
                            className={cn(
                                "flex-1 h-[50px] rounded-full border text-[15px] font-medium transition-colors",
                                availabilityType === 'fromDate'
                                    ? "bg-[#FFF5F5] border-[#FF6B6B] text-[#FF6B6B]"
                                    : "bg-white border-[#EDF1F7] text-gray-400"
                            )}
                        >
                            From Date
                        </button>
                    </div>
                </div>
            </div>

            {/* Row 2: Amenities and Calendar */}
            <div className="grid grid-cols-2 gap-8">
                {/* Amenities */}
                <div className="bg-[#F7F7F74F] rounded-xl border border-[#EDF1F7] p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[15px] font-semibold text-gray-900">Amenities</h3>
                        <button
                            type="button"
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-1 text-[#FF6B6B] text-sm font-medium hover:text-[#e55a5a] transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add New
                        </button>
                    </div>

                    {isLoadingAmenities ? (
                        <div className="flex items-center justify-center py-8 text-gray-400">
                            Loading amenities...
                        </div>
                    ) : amenities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                            <p className="text-sm">No amenities yet</p>
                            <p className="text-xs mt-1">Click "Add New" to create your first amenity</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-4 gap-y-3 gap-x-4">
                                {displayedAmenities.map((amenity) => (
                                    <label key={amenity.id} className="flex items-center gap-2 cursor-pointer">
                                        <div
                                            className={cn(
                                                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                                selectedAmenities.has(amenity.id)
                                                    ? "bg-[#00AAFF] border-[#00AAFF]"
                                                    : "bg-white border-gray-300"
                                            )}
                                            onClick={() => toggleAmenity(amenity.id)}
                                        >
                                            {selectedAmenities.has(amenity.id) && (
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-[14px] text-gray-700">{amenity.name}</span>
                                    </label>
                                ))}
                            </div>

                            {amenities.length > 20 && (
                                <button
                                    type="button"
                                    onClick={() => setShowMore(!showMore)}
                                    className="flex items-center gap-1 text-gray-400 text-sm mt-4 hover:text-gray-600 transition-colors"
                                >
                                    <ChevronDown className={cn("w-4 h-4 transition-transform", showMore && "rotate-180")} />
                                    {showMore ? 'View Less' : 'View More'}
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Calendar (only visible when From Date is selected) */}
                {availabilityType === 'fromDate' && (
                    <div className="bg-white rounded-xl border border-[#EDF1F7] p-4">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-400" />
                            </button>
                            <span className="text-[15px] font-medium text-gray-900">
                                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button
                                type="button"
                                onClick={nextMonth}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Day headers */}
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                                <div key={day} className="h-8 flex items-center justify-center text-[11px] font-medium text-gray-400">
                                    {day}
                                </div>
                            ))}

                            {/* Empty days */}
                            {emptyDays.map((_, index) => (
                                <div key={`empty-${index}`} className="h-9" />
                            ))}

                            {/* Days */}
                            {days.map((day) => {
                                const isSelected = selectedDate &&
                                    selectedDate.getDate() === day &&
                                    selectedDate.getMonth() === currentMonth.getMonth() &&
                                    selectedDate.getFullYear() === currentMonth.getFullYear();

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDateSelect(day)}
                                        className={cn(
                                            "h-9 w-9 mx-auto flex items-center justify-center rounded-full text-[14px] transition-colors",
                                            isSelected
                                                ? "bg-[#FF6B6B] text-white"
                                                : "text-gray-700 hover:bg-gray-100"
                                        )}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Amenity Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Amenity</h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewAmenityName('');
                                }}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amenityName" className="text-[15px] font-medium text-gray-700">
                                    Amenity Name
                                </Label>
                                <Input
                                    id="amenityName"
                                    value={newAmenityName}
                                    onChange={(e) => setNewAmenityName(e.target.value)}
                                    placeholder="e.g. Swimming Pool, Gym, etc."
                                    className="h-[50px] bg-white border-[#EDF1F7] rounded-lg focus-visible:ring-blue-500 placeholder:text-[#8F9BB3] text-[15px]"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddAmenity();
                                        }
                                    }}
                                />
                            </div>

                            {createAmenityMutation.isError && (
                                <p className="text-sm text-red-500">
                                    {(createAmenityMutation.error as Error)?.message || 'Failed to create amenity'}
                                </p>
                            )}

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setNewAmenityName('');
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddAmenity}
                                    disabled={!newAmenityName.trim() || createAmenityMutation.isPending}
                                    className="px-6 py-2 bg-[#00AAFF] text-white rounded-lg font-medium hover:bg-[#0095e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {createAmenityMutation.isPending ? 'Adding...' : 'Add Amenity'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
