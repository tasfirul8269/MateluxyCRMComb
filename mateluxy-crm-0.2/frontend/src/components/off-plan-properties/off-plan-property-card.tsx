import React from 'react';
import Image from 'next/image';
import { MapPin, BedDouble, Bath, Maximize2, Phone, ShieldCheck, Copy, Eye, Gauge } from 'lucide-react';
import { OffPlanProperty } from '@/lib/services/off-plan-property.service';
import { Agent } from '@/lib/services/agent.service';
import { calculatePropertyScore, getScoreColor } from '@/lib/utils/property-scoring';

interface OffPlanPropertyCardProps {
    property: OffPlanProperty;
}

export function OffPlanPropertyCard({ property }: OffPlanPropertyCardProps) {
    const [showPhoneMenu, setShowPhoneMenu] = React.useState(false);
    const score = calculatePropertyScore(property);
    const scoreColor = getScoreColor(score);

    const handleWhatsAppClick = () => {
        // Placeholder for future implementation when we have agent details
        console.log("WhatsApp click - Agent details not available yet");
    };

    const handlePhoneClick = () => {
        // Placeholder for future implementation
        console.log("Phone click - Agent details not available yet");
    };

    const callPhone = (number: string) => {
        window.location.href = `tel:${number}`;
        setShowPhoneMenu(false);
    };

    return (
        <div className="bg-white rounded-[16px] border border-[1px] border-[#E6E6E6] hover:shadow-lg transition-all duration-300 group flex flex-col w-full max-w-[360px]">
            {/* Image Section */}
            <div className="relative h-[220px] w-full p-[10px]">
                <div className="relative h-full w-full rounded-[10px] overflow-hidden">
                    <Image
                        src={property.coverPhoto || '/placeholder-property.jpg'}
                        alt={property.projectTitle || 'Property Image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black-40 to-transparent" />

                    {/* Gradient Blur Overlay */}
                    <div
                        className="absolute rounded-[10px] inset-0 backdrop-blur-[7px]"
                        style={{
                            maskImage: 'linear-gradient(to top, black 0%, transparent 50%)',
                            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 50%)'
                        }}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        <div className="px-[8px] h-[22px] py-[4px] bg-[#FF111180] text-white text-[11px] font-medium rounded-full tracking-wide"><span>
                            Off Plan
                        </span></div>
                        <span className={`px-[8px] py-[4px] text-white text-[11px] font-medium rounded-full tracking-wide ${property.isActive ? 'bg-[#00AAFF]' : 'bg-gray-500'
                            }`}>
                            {property.isActive ? 'Published' : 'Draft'}
                        </span>
                    </div>

                    {/* Bottom Overlay Info */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        {/* Glassmorphism Property Type */}
                        <div className="flex gap-2 flex-wrap max-w-[60%]">
                            {property.propertyType && property.propertyType.length > 0 ? (
                                property.propertyType.map((type, index) => (
                                    <div key={index} className="px-2.5 py-1 bg-[#C6EAFF]/40 border-[0.5px] border-[#25AFFF]/20 text-white text-[11px] font-medium rounded-md">
                                        {type}
                                    </div>
                                ))
                            ) : (
                                <div></div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="text-white font-semibold text-[18px] drop-shadow-lg tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                            {property.startingPrice?.toLocaleString()} AED
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-4 pb-4 pt-1 flex-1 flex flex-col overflow-visible">
                {/* Title */}
                <h3 className="text-[20px] font-medium text-[#1A1A1A] mb-2 line-clamp-1 tracking-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    {property.projectTitle}
                </h3>

                {/* Location */}
                <div className="flex font-medium items-center gap-1.5 text-[#8F9BB3] text-[14px] mb-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    <div className="w-4 h-4 rounded-full border border-[#FF4D4D] flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-[#FF4D4D] rounded-full" />
                    </div>
                    <span className="line-clamp-1 font-medium">{property.address || property.emirate}</span>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-3 mb-5" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    <div className="flex items-center gap-1.5 text-[#000000]/40">
                        <BedDouble className="h-4 w-4 stroke-[1.5]" />
                        <span className="text-[13px] font-medium text-[#000000]/40">
                            {property.bedrooms != null ? property.bedrooms.toString().padStart(2, '0') : '-'}
                        </span>
                    </div>
                    <div className="w-[1px] h-3 bg-gray-200" />
                    <div className="flex items-center gap-1.5 text-[#000000]/40">
                        <Bath className="h-3.5 w-3.5 stroke-[1.5]" />
                        <span className="text-[13px] font-medium text-[#000000]/40">
                            {property.bathrooms != null ? property.bathrooms.toString().padStart(2, '0') : '-'}
                        </span>
                    </div>
                    <div className="w-[1px] h-3 bg-gray-200" />
                    <div className="flex items-center gap-1.5 text-[#000000]/40">
                        <Maximize2 className="h-3.5 w-3.5 stroke-[1.5]" />
                        <span className="text-[13px] font-medium text-[#000000]/40">
                            {property.area != null ? property.area : '-'} sq.ft
                        </span>
                    </div>
                </div>

                {/* Agent Section - Placeholder for now as we moved to multiple experts */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center">
                        <div className="relative h-[36px] w-[110px] flex items-center justify-start">
                            {property.developer?.logoUrl ? (
                                <Image
                                    src={property.developer.logoUrl}
                                    alt={property.developer.name}
                                    fill
                                    className="object-contain object-left"
                                />
                            ) : (
                                <span className="text-xs font-medium text-gray-500">
                                    {property.developer?.name || 'Developer'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 relative">
                        <button
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-[#E0F7FA] text-[#00C853] hover:bg-[#00C853] hover:text-white transition-all duration-300"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </button>
                        <button
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-[#F7F9FC] text-[#8F9BB3] hover:bg-[#EDF1F7] hover:text-[#1A1A1A] transition-all duration-300"
                        >
                            <Phone className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="mt-auto pt-3 border-t border-[#EDF1F7] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        {/* Verification Shield */}
                        <Image
                            src="/PFApprovedStatus.svg"
                            alt="Verified"
                            width={32}
                            height={32}
                            className="flex-shrink-0"
                        />

                        {/* Score Pill */}
                        <div className="flex px-[8px] items-center gap-1 h-[32px] rounded-full" style={{ backgroundColor: scoreColor.bg }}>
                            <Gauge className="w-2.5 h-2.5" style={{ color: scoreColor.icon }} />
                            <span className="text-[11px] font-semibold" style={{ color: scoreColor.text, fontFamily: 'var(--font-plus-jakarta-sans)' }}>{score}/100</span>
                        </div>

                        {/* Leads Pill */}
                        <div className="flex px-[8px] items-center gap-1 h-[32px] bg-[#E3F2FD] rounded-full">
                            <Eye className="w-2.5 h-2.5 text-[#2196F3]" />
                            <span className="text-[11px] font-semibold text-[#2196F3]" style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}>56 Leads</span>
                        </div>
                    </div>

                    {/* Reference */}
                    <div className="flex items-center gap-1 text-[#9E9E9E]">
                        <span className="text-[10px] font-normal">{property.reference || 'MAH173'}</span>
                        <Copy className="h-2.5 w-2.5 cursor-pointer hover:text-[#1A1A1A] transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
}
