'use client';

import React, { useRef, useState } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaTabProps {
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    watch: UseFormWatch<any>;
}

export function MediaTab({ register, setValue, watch }: MediaTabProps) {
    const defaultCover = watch('coverPhoto');
    const defaultMedia = watch('mediaImages');

    // Helper to get preview URL from File or string
    const getPreview = (fileOrUrl: File | string | null): string | null => {
        if (!fileOrUrl) return null;
        if (typeof fileOrUrl === 'string') return fileOrUrl;
        return URL.createObjectURL(fileOrUrl);
    };

    const [coverPhoto, setCoverPhoto] = useState<string | null>(() => getPreview(defaultCover));
    const [mediaImages, setMediaImages] = useState<string[]>(() => {
        if (Array.isArray(defaultMedia)) {
            return defaultMedia.map((item: File | string) => getPreview(item) as string);
        }
        return [];
    });

    const coverPhotoInputRef = useRef<HTMLInputElement>(null);
    const mediaInputRef = useRef<HTMLInputElement>(null);

    const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Update local preview
            const previewUrl = URL.createObjectURL(file);
            setCoverPhoto(previewUrl);
            // Update form state with actual File
            setValue('coverPhoto', file);
        }
    };

    const removeCoverPhoto = () => {
        setCoverPhoto(null);
        setValue('coverPhoto', '');
        if (coverPhotoInputRef.current) {
            coverPhotoInputRef.current.value = '';
        }
    };

    const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);

            // Update local previews
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setMediaImages(prev => [...prev, ...newPreviews]);

            // Update form state with actual Files
            const currentFiles = Array.isArray(defaultMedia) ? defaultMedia : [];
            setValue('mediaImages', [...currentFiles, ...newFiles]);
        }
    };

    const removeMediaImage = (index: number) => {
        setMediaImages(prev => prev.filter((_, i) => i !== index));

        const currentFiles = Array.isArray(defaultMedia) ? defaultMedia : [];
        if (Array.isArray(currentFiles)) {
            const newFiles = currentFiles.filter((_, i) => i !== index);
            setValue('mediaImages', newFiles);
        }
    };

    return (
        <div className="space-y-6">
            {/* Row 1: Cover Photo and Video URL */}
            <div className="grid grid-cols-2 gap-8">
                {/* Cover Photo */}
                <div className="space-y-2.5">
                    {!coverPhoto ? (
                        <label
                            htmlFor="coverPhotoUpload"
                            className="flex flex-col items-center justify-center w-full h-[200px] bg-white rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <ImagePlus className="w-8 h-8 text-gray-300 mb-2" />
                            <span className="text-[15px] font-medium text-gray-700">Cover Photo</span>
                            <p className="text-sm text-gray-400 mt-1">Pick a nice cover photo for a great first impression 😊</p>
                            <input
                                id="coverPhotoUpload"
                                ref={coverPhotoInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverPhotoUpload}
                            />
                        </label>
                    ) : (
                        <div className="relative w-full h-[200px]">
                            <img
                                src={coverPhoto}
                                alt="Cover Photo"
                                className="w-full h-full object-cover rounded-xl border border-[#EDF1F7]"
                            />
                            <button
                                type="button"
                                onClick={removeCoverPhoto}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Video URL */}
                <div className="space-y-2.5">
                    <Label htmlFor="videoUrl" className="text-[15px] font-medium text-gray-700">
                        Video (Only YouTube )
                    </Label>
                    <Input
                        id="videoUrl"
                        placeholder="https://yourvideourl.com"
                        className="h-[50px] bg-white border-[#EDF1F7] rounded-lg focus-visible:ring-blue-500 placeholder:text-[#8F9BB3] text-[15px]"
                        {...register('videoUrl')}
                    />
                </div>
            </div>

            {/* Choose Media Grid */}
            <div className="space-y-3">
                <Label className="text-[15px] font-medium text-[#00AAFF]">
                    Choose Media
                </Label>
                <div className="flex flex-wrap gap-3">
                    {/* Add Image Button */}
                    <label
                        htmlFor="mediaUpload"
                        className="flex items-center justify-center w-[100px] h-[100px] bg-[#F7F9FC] rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <ImagePlus className="w-6 h-6 text-gray-400" />
                        <input
                            id="mediaUpload"
                            ref={mediaInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleMediaUpload}
                        />
                    </label>

                    {/* Uploaded Images */}
                    {mediaImages.map((image, index) => (
                        <div key={index} className="relative w-[100px] h-[100px]">
                            <img
                                src={image}
                                alt={`Media ${index + 1}`}
                                className="w-full h-full object-cover rounded-xl border border-[#EDF1F7]"
                            />
                            <button
                                type="button"
                                onClick={() => removeMediaImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
