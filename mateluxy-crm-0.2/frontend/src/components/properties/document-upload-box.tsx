'use client';

import React, { useRef, useState } from 'react';
import { FileText, Upload, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentUploadBoxProps {
    label: string;
    icon: React.ReactNode;
    file?: File | null;
    onFileSelect: (file: File) => void;
    onRemove: () => void;
    accept?: string;
}

export function DocumentUploadBox({
    label,
    icon,
    file,
    onFileSelect,
    onRemove,
    accept = ".jpg,.jpeg,.png,.pdf"
}: DocumentUploadBoxProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    return (
        <div
            className={cn(
                "relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all h-[160px] cursor-pointer group",
                file
                    ? "border-blue-200 bg-blue-50/30"
                    : isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-blue-400 hover:bg-gray-50"
            )}
            onClick={() => !file && fileInputRef.current?.click()}
            onDrop={!file ? handleDrop : undefined}
            onDragOver={!file ? handleDragOver : undefined}
            onDragLeave={!file ? handleDragLeave : undefined}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept={accept}
            />

            {file ? (
                <div className="flex flex-col items-center w-full">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2 text-blue-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-full px-2 text-center">
                        {file.name}
                    </p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="mt-2 text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Remove
                    </button>
                </div>
            ) : (
                <>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                        {icon}
                    </div>
                    <p className="text-sm font-medium text-gray-600 text-center group-hover:text-gray-900">
                        {label}
                    </p>
                </>
            )}
        </div>
    );
}
