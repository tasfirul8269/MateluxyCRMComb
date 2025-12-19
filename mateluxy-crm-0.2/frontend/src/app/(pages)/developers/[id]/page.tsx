'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDeveloper, useDeleteDeveloper } from '@/lib/hooks/use-developers';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Mail, Phone, Globe, User, Languages as LanguagesIcon, Loader2 } from 'lucide-react';
import { AddDeveloperSheet } from '@/components/developers/add-developer-sheet';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeveloperDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { data: developer, isLoading, error } = useDeveloper(id);
    const { mutate: deleteDeveloper, isPending: isDeleting } = useDeleteDeveloper();

    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error || !developer) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
                <p>Failed to load developer details.</p>
                <Button variant="link" onClick={() => router.back()}>Go back</Button>
            </div>
        );
    }

    const handleDelete = () => {
        deleteDeveloper(id, {
            onSuccess: () => {
                router.push('/developers');
            }
        });
    };

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
            {/* Header Actions */}
            <div className="flex justify-end gap-6 mb-2">
                <button
                    onClick={() => setIsEditSheetOpen(true)}
                    className="flex items-center gap-2 text-[#00A3FF] font-medium hover:opacity-80 transition-opacity"
                >
                    <Edit className="h-5 w-5" />
                    Edit
                </button>
                <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="flex items-center gap-2 text-[#FF3B30] font-medium hover:opacity-80 transition-opacity"
                >
                    <Trash2 className="h-5 w-5" />
                    Delete
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Left Column - Developer Info */}
                <div className="flex-1 space-y-8">
                    <div className="flex gap-8 items-center">
                        {/* Logo Box */}
                        <div className="w-[240px] h-[140px] bg-white rounded-xl border border-gray-100 flex items-center justify-center p-6 shadow-sm">
                            {developer.logoUrl ? (
                                <img src={developer.logoUrl} alt={developer.name} className="max-w-full max-h-full object-contain" />
                            ) : (
                                <div className="text-4xl font-bold text-gray-300">{developer.name.substring(0, 2).toUpperCase()}</div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900">{developer.name}</h1>
                            <div className="text-gray-500 text-lg">{developer.email}</div>
                            <div className="text-gray-500 text-lg">{developer.phone}</div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">About Developer</h3>
                        <p className="text-gray-500 leading-relaxed whitespace-pre-wrap text-base">
                            {developer.about || "No description available."}
                        </p>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-[1px] bg-gray-200 self-stretch" />

                {/* Right Column - Sales Manager */}
                <div className="w-full lg:w-[380px] flex-shrink-0">
                    <div className="bg-[#F0F9FF] rounded-[40px] p-10 flex flex-col items-center text-center h-full border border-[#E0F2FE]">
                        {/* Profile Image */}
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-sm mb-6 bg-[#FFD600] flex items-center justify-center">
                            {developer.salesManagerPhotoUrl ? (
                                <img src={developer.salesManagerPhotoUrl} alt={developer.salesManagerName} className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-12 w-12 text-white" />
                            )}
                        </div>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-8">{developer.salesManagerName}</h3>

                        <div className="w-full space-y-5 text-left">
                            <div className="flex items-center gap-4 text-gray-600">
                                <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                                <span className="text-base truncate">{developer.salesManagerEmail}</span>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <User className="h-5 w-5 text-gray-400 shrink-0" />
                                <span className="text-base">Speaks {developer.languages?.join(', ') || 'N/A'}</span>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                                <span className="text-base">{developer.salesManagerPhone}</span>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <Globe className="h-5 w-5 text-gray-400 shrink-0" />
                                <span className="text-base">Nationality : {developer.nationality || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Properties Section */}
            <div className="pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Empty grid for now as requested */}
                </div>
            </div>

            {/* Edit Sheet */}
            <AddDeveloperSheet
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
                developer={developer}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the developer
                            and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
