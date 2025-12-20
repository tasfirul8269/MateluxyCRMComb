'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreateOffPlanPropertyDto } from '@/lib/services/off-plan-property.service';
import { SpecificDetailsTab } from './tabs/specific-details-tab';
import { LocationsTab } from './tabs/locations-tab';
import { PriceTab } from './tabs/price-tab';
import { DldStatusTab } from './tabs/dld-status-tab';
import { GeneralDetailsTab } from './tabs/general-details-tab';
import { MediaTab } from './tabs/media-tab';
import { AdditionalTab } from './tabs/additional-tab';
import { AgentTab } from './tabs/agent-tab';

interface PropertyDetailsStepProps {
    developerId: string;
    initialData?: Partial<CreateOffPlanPropertyDto>;
    onSubmit: (data: CreateOffPlanPropertyDto) => void;
    onSaveAsDraft: (data: CreateOffPlanPropertyDto) => void;
    onCancel: () => void;
}

const tabs = [
    'Specific Details',
    'Locations',
    'Price',
    'DLD & Status',
    'General Details',
    'Media',
    'Additional',
    'Agent',
];

const propertySchema = z.object({
    // Specific Details
    emirate: z.string().optional(),
    launchType: z.string().optional(),
    projectHighlight: z.string().optional(),
    propertyType: z.array(z.string()).optional(),
    plotArea: z.number().min(0).optional(),
    area: z.number().min(0).optional(),
    bedrooms: z.number().min(0).optional(),
    kitchens: z.number().min(0).optional(),
    bathrooms: z.number().min(0).optional(),

    // Locations
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    style: z.string().optional(),
    focalPoint: z.string().optional(),
    focalPointImage: z.string().optional(),
    nearbyHighlights: z.array(z.object({
        title: z.string(),
        subtitle: z.string(),
        highlights: z.array(z.object({
            name: z.string(),
            image: z.string().optional(),
        })),
    })).optional(),

    // Price
    startingPrice: z.number().optional(),
    serviceCharges: z.number().optional(),
    brokerFee: z.string().optional(),
    roiPotential: z.number().optional(),
    paymentPlan: z.object({
        title: z.string(),
        subtitle: z.string(),
        milestones: z.array(z.object({
            label: z.string(),
            percentage: z.string(),
            subtitle: z.string(),
        })),
    }).optional(),

    // DLD & Status
    dldPermitNumber: z.string().optional(),
    dldQrCode: z.string().optional(),
    projectStage: z.string().optional(),
    constructionProgress: z.number().min(0).max(100).optional(),
    handoverDate: z.string().optional(),

    // General Details
    projectTitle: z.string().optional(),
    shortDescription: z.string().optional(),
    projectDescription: z.string().optional(),

    // Media
    coverPhoto: z.string().optional(),
    videoUrl: z.string().optional(),
    agentVideoUrl: z.string().optional(),
    virtualTourUrl: z.string().optional(),
    exteriorMedia: z.array(z.string()).optional(),
    interiorMedia: z.array(z.string()).optional(),

    // Additional
    reference: z.string().optional(),
    brochure: z.string().optional(),
    amenitiesCover: z.string().optional(),
    amenitiesTitle: z.string().optional(),
    amenitiesSubtitle: z.string().optional(),
    amenities: z.array(z.object({
        name: z.string(),
        icon: z.string(),
    })).optional(),
    floorPlans: z.array(z.object({
        propertyType: z.string(),
        livingArea: z.string(),
        price: z.string(),
        floorPlanImage: z.string().optional(),
    })).optional(),


    // Agent
    assignedAgentId: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export function PropertyDetailsStep({ developerId, initialData, onSubmit, onSaveAsDraft, onCancel }: PropertyDetailsStepProps) {
    const [activeTab, setActiveTab] = useState(0);
    const cancelClickedRef = React.useRef(false);
    const hasUnsavedChangesRef = React.useRef(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isDirty },
        getValues,
    } = useForm<PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            ...initialData,
            propertyType: initialData?.propertyType || [],
            nearbyHighlights: initialData?.nearbyHighlights || [],
        } as any,
    });

    // Track form changes
    const formValues = watch();
    React.useEffect(() => {
        hasUnsavedChangesRef.current = isDirty;
    }, [isDirty]);

    // Auto-save function that calls backend
    const autoSaveDraft = React.useCallback(() => {
        if (!hasUnsavedChangesRef.current || cancelClickedRef.current) {
            return;
        }

        try {
            const currentValues = getValues();
            const draftData = {
                ...currentValues,
                developerId,
            };

            // Use sendBeacon for reliable sending even during page unload
            const blob = new Blob([JSON.stringify({ ...draftData, isActive: false })], {
                type: 'application/json'
            });

            // Get auth token from cookies or localStorage
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];

            if (token) {
                // Use fetch with keepalive for more reliability
                fetch('http://localhost:3001/off-plan-properties', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ ...draftData, isActive: false }),
                    keepalive: true
                }).catch(err => console.error('Auto-save failed:', err));
            }
        } catch (error) {
            console.error('Error in auto-save:', error);
        }
    }, [developerId, getValues]);

    // Handle page close/refresh
    React.useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChangesRef.current && !cancelClickedRef.current) {
                autoSaveDraft();
                // Show browser confirmation dialog
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [autoSaveDraft]);

    // Handle Next.js client-side navigation
    React.useEffect(() => {
        const handleRouteChange = () => {
            if (hasUnsavedChangesRef.current && !cancelClickedRef.current) {
                autoSaveDraft();
            }
        };

        // Listen for route changes
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, [autoSaveDraft]);

    const handleFormSubmit = (data: PropertyFormValues) => {
        console.log('✅ Form validation passed! Publishing with data:', data);
        cancelClickedRef.current = true; // Prevent auto-save
        hasUnsavedChangesRef.current = false;
        onSubmit({
            ...data,
            developerId,
        });
    };

    const handleSaveAsDraft = () => {
        const data = getValues();
        console.log('💾 Saving as draft with data:', data);
        cancelClickedRef.current = true; // Prevent auto-save
        hasUnsavedChangesRef.current = false;
        onSaveAsDraft({
            ...data,
            developerId,
        });
    };

    const handleCancel = () => {
        cancelClickedRef.current = true;
        hasUnsavedChangesRef.current = false;
        onCancel();
    };

    const handleFormError = (errors: any) => {
        console.log('❌ Form has validation errors:', errors);
        console.log('Number of errors:', Object.keys(errors).length);

        // Show which fields have errors
        const errorFields = Object.keys(errors);
        if (errorFields.length > 0) {
            const errorMessages = errorFields.map(field => {
                const error = errors[field];
                return `- ${field}: ${error?.message || 'Invalid'}`;
            }).join('\n');

            alert(`Please fix the following errors:\n\n${errorMessages}`);
        } else {
            console.warn('⚠️ Error handler called but no errors found. This might be a React Hook Form issue.');
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="flex flex-col items-center font-[var(--font-outfit)]">
            <div className="w-fit flex flex-col gap-8">
                {/* Tab Navigation */}
                <div className="bg-[#F7F7F74F] rounded-[15px] border border-[#EDF1F7] p-[7px] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex items-center gap-2 min-w-max">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(index)}
                                className={`px-6 h-[60px] rounded-[10px] font-semibold text-[15px] transition-all ${activeTab === index
                                    ? 'bg-[#E9F8FF] text-[#00AAFF]'
                                    : 'bg-transparent text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-3xl w-[90%] mx-auto">
                    {activeTab === 0 && (
                        <SpecificDetailsTab
                            register={register}
                            control={control}
                            errors={errors}
                            watch={watch}
                        />
                    )}

                    {activeTab === 1 && (
                        <LocationsTab
                            register={register}
                            control={control}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                        />
                    )}

                    {activeTab === 2 && (
                        <PriceTab
                            register={register}
                            control={control}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                        />
                    )}

                    {activeTab === 3 && (
                        <DldStatusTab
                            register={register}
                            control={control}
                            errors={errors}
                            setValue={setValue}
                        />
                    )}

                    {activeTab === 4 && (
                        <GeneralDetailsTab
                            register={register}
                            errors={errors}
                        />
                    )}

                    {activeTab === 5 && (
                        <MediaTab
                            register={register}
                            setValue={setValue}
                            watch={watch}
                        />
                    )}

                    {activeTab === 6 && (
                        <AdditionalTab
                            register={register}
                            setValue={setValue}
                            watch={watch}
                        />
                    )}

                    {activeTab === 7 && (
                        <AgentTab
                            register={register}
                            setValue={setValue}
                            watch={watch}
                        />
                    )}

                    {/* Placeholder for other tabs */}
                    {activeTab > 7 && (
                        <div className="flex h-64 items-center justify-center text-gray-500">
                            {tabs[activeTab]} tab - Coming soon
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 w-[98%] mx-auto">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-8 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 rounded-xl"
                    >
                        Cancel
                    </button>
                    <div className="flex gap-3">
                        {activeTab === 7 && (
                            <button
                                type="button"
                                onClick={handleSaveAsDraft}
                                className="px-8 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Save as Draft
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-10 py-3 bg-[#E0F2FE] text-[#0BA5EC] hover:bg-[#BAE6FD] rounded-xl font-medium transition-colors flex items-center gap-2"
                        >
                            {activeTab === 7 ? 'Publish' : 'Next'}
                            {activeTab === 7 ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
