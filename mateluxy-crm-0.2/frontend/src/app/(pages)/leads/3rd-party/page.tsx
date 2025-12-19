'use client';

import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { LeadService } from '@/lib/services/lead.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { parseISO } from 'date-fns';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import Image from 'next/image';
import { useAgents } from '@/lib/hooks/use-agents';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LeadDetailsSidebar } from '@/components/leads/lead-details-sidebar';

type Lead = {
    id: string;
    name: string;
    email: string;
    phone: string;
    source?: string;
    status?: string;
    district?: string | null;
    propertyType?: string | null;
    responsible?: string;
    responsibleAgent?: {
        id: string;
        name: string;
        photoUrl?: string | null;
    };
    createdAt?: string;
    organizer?: string;
    observers?: string[];
    dealPrice?: number;
    currency?: string;
    closingDate?: string;
    additionalContent?: string;
};

const sourceMeta: Array<{
    key: string;
    label: string;
    icon: string;
    text: string;
    bg: string;
    delta: string;
    fallbackCount: number;
}> = [
        { key: 'Facebook', label: 'Facebook', icon: '/facebook_icon.svg', text: '#1d4ed8', bg: '#1978F205', delta: '+12%', fallbackCount: 0 },
        { key: 'Instagram', label: 'Instagram', icon: '/instagram_icon.svg', text: '#e1306c', bg: '#E9486905', delta: '-02%', fallbackCount: 0 },
        { key: 'TikTok', label: 'TikTok', icon: '/tiktok_icon.svg', text: '#111827', bg: '#00000005', delta: '+05%', fallbackCount: 0 },
        { key: 'Whatsapp', label: 'Whatsapp', icon: '/whatsapp_icon.svg', text: '#16a34a', bg: '#f3fbf6', delta: '+01%', fallbackCount: 0 },
        { key: 'Walk in', label: 'Walk in', icon: '/walkin_icon.svg', text: '#1f2937', bg: '#f9f9f9', delta: '+18%', fallbackCount: 0 },
    ];

const statusColors: Record<string, { text: string; bg: string }> = {
    New: { text: '#2aa0ff', bg: '#e8f4ff' },
    Pending: { text: '#7c3aed', bg: '#f3e8ff' },
    Contacting: { text: '#f59e0b', bg: '#fff7e8' },
    Completed: { text: '#22c55e', bg: '#e7f9ef' },
    Lost: { text: '#ef4444', bg: '#ffecec' },
};

const defaultAvatar = '/profile.svg';

const chartSeries = [
    { month: 'Jan', current: 2000, last: 8000 },
    { month: 'Feb', current: 7000, last: 6000 },
    { month: 'Mar', current: 10000, last: 12000 },
    { month: 'Apr', current: 15000, last: 14000 },
    { month: 'May', current: 11000, last: 13000 },
    { month: 'Jun', current: 11000, last: 11000 },
    { month: 'Jul', current: 18000, last: 10500 },
    { month: 'Aug', current: 19000, last: 11000 },
    { month: 'Sep', current: 20000, last: 15000 },
    { month: 'Oct', current: 19000, last: 20000 },
    { month: 'Nov', current: 15000, last: 19000 },
    { month: 'Dec', current: 12000, last: 20000 },
];

const formatMoney = (value: number) =>
    `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} AED`;

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const monthIndex = chartSeries.findIndex((d) => d.month === payload[0].payload.month);
        const displayDate = monthIndex >= 0 ? `05 ${chartSeries[monthIndex].month}, 2025` : '';
        const currentVal = payload.find((p: any) => p.dataKey === 'current')?.value;
        const lastVal = payload.find((p: any) => p.dataKey === 'last')?.value;
        return (
            <div className="rounded-xl border border-[#eef2f6] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(35,69,122,0.08)]">
                <div className="text-[12px] text-[#8b97a8]">{displayDate}</div>
                <div className="mt-2 flex items-center gap-2 text-[13px] text-[#1f2837]">
                    <span className="h-2 w-2 rounded-full bg-[#0aa5ff]" />
                    <span>This year</span>
                    <span className="font-semibold text-[#1f2837]">{formatMoney(currentVal || 0)}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[13px] text-[#1f2837]">
                    <span className="h-2 w-2 rounded-full bg-[#6ec2ff]" />
                    <span>Last year</span>
                    <span className="font-semibold text-[#1f2837]">{formatMoney(lastVal || 0)}</span>
                </div>
            </div>
        );
    }
    return null;
};

function useLeads() {
    return useQuery({
        queryKey: ['leads', '3rd-party'],
        queryFn: async () => {
            const res = await LeadService.listLeads();
            return res as Lead[];
        },
    });
}

function useLeadStats() {
    return useQuery({
        queryKey: ['leads', 'stats'],
        queryFn: async () => {
            return LeadService.getStats();
        },
    });
}

function summaryBySource(leads: Lead[]) {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
        const key = l.source || 'Walk in';
        counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
}

function formatPhone(phone?: string) {
    if (!phone) return '';
    return phone.replace(/\s+/g, ' ').trim();
}

function LeadCard({
    lead,
    sourceLabel,
    onTransfer,
    onClick,
}: {
    lead: Lead;
    sourceLabel: string;
    onTransfer: () => void;
    onClick: (lead: Lead) => void;
}) {
    const status = lead.status || 'Pending';
    const statusStyle = statusColors[status] || statusColors.Pending;
    const sourceStyle = sourceMeta.find((s) => s.key === sourceLabel) || sourceMeta.find((s) => s.key === 'Walk in')!;
    return (
        <div
            className="rounded-[24px] bg-white px-5 py-4 border border-[#EDF1F7] cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onClick(lead)}
        >
            <div className="mb-3 flex items-start justify-between">
                <span
                    className="rounded-full px-3 py-1 text-[12px] font-semibold"
                    style={{ color: sourceStyle.text, background: sourceStyle.bg }}
                >
                    {sourceStyle.label}
                </span>
                <span
                    className="rounded-full px-3 py-1 text-[12px] font-semibold"
                    style={{ color: statusStyle.text, background: statusStyle.bg }}
                >
                    {status}
                </span>
            </div>
            <div className="text-[18px] font-semibold text-[#1f2837] leading-tight">{lead.name}</div>
            <div className="mt-2 text-[13px] leading-6 text-[#5f6a7a]">
                {(() => {
                    const type = lead.propertyType || 'property';
                    const district = lead.district || '';
                    if (district) {
                        return <>Interested in {type} in {district}</>;
                    }
                    return <>Interested in {type}</>;
                })()}
                <br />
                {lead.email}
                <br />
                {formatPhone(lead.phone)}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-[#1f2837]">
                <div className="flex items-center gap-2">
                    <div className="relative h-7 w-7 overflow-hidden rounded-full bg-[#f3f4f6]">
                        {lead.responsibleAgent?.photoUrl ? (
                            <Image
                                src={lead.responsibleAgent.photoUrl}
                                alt={lead.responsibleAgent.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Image
                                src={defaultAvatar}
                                alt={lead.responsibleAgent?.name || 'Agent avatar'}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <span className="text-[13px]">
                        {lead.responsibleAgent?.name || lead.responsible || 'Unassigned'}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onTransfer();
                    }}
                    className="flex items-center gap-2 text-[12px] text-[#7b8794] hover:text-[#0aa5ff]"
                >
                    <span className="text-base">⇄</span>
                    <span>Transfer</span>
                </button>
            </div>
        </div>
    );
}

export default function ThirdPartyLeadsPage() {
    const queryClient = useQueryClient();
    const { data: leads = [], isLoading } = useLeads();
    const { data: leadStats = [] } = useLeadStats();
    const { data: agents = [] } = useAgents();
    const [search, setSearch] = useState('');
    const [showCurrent, setShowCurrent] = useState(true);
    const [showLast, setShowLast] = useState(true);
    const [selectedSource, setSelectedSource] = useState('Facebook');
    const [transferLeadId, setTransferLeadId] = useState<string | null>(null);
    const [transferLoading, setTransferLoading] = useState(false);
    const [transferSearch, setTransferSearch] = useState('');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const filteredLeads = useMemo(() => {
        if (!search) return leads;
        const term = search.toLowerCase();
        return leads.filter((l) =>
            l.name.toLowerCase().includes(term) ||
            (l.email || '').toLowerCase().includes(term) ||
            (l.source || '').toLowerCase().includes(term),
        );
    }, [leads, search]);

    const chartData = useMemo(() => {
        if (leadStats.length > 0) return leadStats;
        return chartSeries;
    }, [leadStats]);

    const sourceCounts = useMemo(() => summaryBySource(leads), [leads]);

    const filteredTransferAgents = useMemo(() => {
        if (!transferSearch) return agents;
        const term = transferSearch.toLowerCase();
        return agents.filter((agent) =>
            agent.name.toLowerCase().includes(term) ||
            (agent.languages || []).some((lang: string) => lang.toLowerCase().includes(term)),
        );
    }, [agents, transferSearch]);

    const handleTransfer = async (agentId: string) => {
        if (!transferLeadId) return;
        try {
            setTransferLoading(true);
            await LeadService.transferLead(transferLeadId, agentId);
            await queryClient.invalidateQueries({ queryKey: ['leads', '3rd-party'] });
            setTransferLeadId(null);
        } finally {
            setTransferLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#ffffff] flex items-start">
            <div className="flex-1 min-w-0 px-[30px] pt-6 pb-4">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Input
                            placeholder="Search for agent"
                            className="h-12 w-72 rounded-2xl border border-[#e5ecf5] bg-white text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Input placeholder="dd/mm/yyyy" className="h-12 w-40 rounded-2xl border border-[#e5ecf5] bg-white text-sm" />
                        <Input placeholder="dd/mm/yyyy" className="h-12 w-40 rounded-2xl border border-[#e5ecf5] bg-white text-sm" />
                    </div>
                </div>

                <div className="rounded-[24px] bg-white p-6 border border-[#EDF1F7]">
                    <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="text-[16px] font-semibold text-[#1f2837]">Leads</div>
                        <div className="flex flex-col gap-3 md:items-end">
                            <div className="flex flex-wrap items-center gap-4">
                                <label className="flex items-center gap-2 text-[12px] text-[#1f2837]">
                                    <input
                                        type="checkbox"
                                        checked={showCurrent}
                                        onChange={(e) => setShowCurrent(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <span className="relative flex h-4 w-4 items-center justify-center rounded-[3px] border border-[#c7ced9] bg-white peer-checked:border-[#0aa5ff] peer-checked:bg-[#0aa5ff]">
                                        <span className="absolute hidden h-2 w-[6px] -rotate-45 border-b-[2px] border-l-[2px] border-white peer-checked:block" />
                                    </span>
                                    Current year
                                </label>
                                <label className="flex items-center gap-2 text-[12px] text-[#1f2837]">
                                    <input
                                        type="checkbox"
                                        checked={showLast}
                                        onChange={(e) => setShowLast(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <span className="relative flex h-4 w-4 items-center justify-center rounded-[3px] border border-[#c7ced9] bg-white peer-checked:border-[#0aa5ff] peer-checked:bg-[#0aa5ff]">
                                        <span className="absolute hidden h-2 w-[6px] -rotate-45 border-b-[2px] border-l-[2px] border-white peer-checked:block" />
                                    </span>
                                    Last Year
                                </label>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                {sourceMeta.map((src) => (
                                    <button
                                        key={src.key}
                                        onClick={() => setSelectedSource(src.key)}
                                        className="flex items-center gap-2 text-[12px]"
                                        aria-pressed={selectedSource === src.key}
                                    >
                                        <span
                                            className={`flex h-3 w-3 items-center justify-center rounded-full border ${selectedSource === src.key ? 'border-[#ff3b30]' : 'border-[#c7ced9]'}`}
                                        >
                                            {selectedSource === src.key && <span className="h-1.5 w-1.5 rounded-full bg-[#ff3b30]" />}
                                        </span>
                                        <span className="text-[#1f2837]">{src.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#edf1f7" />
                                <XAxis dataKey="month" tick={{ fill: '#8b97a8' }} />
                                <YAxis tick={{ fill: '#8b97a8' }} domain={[0, 'auto']} tickCount={6} />
                                {showLast && (
                                    <Line type="monotone" dataKey="last" stroke="#cfe4ff" strokeWidth={3} strokeDasharray="5 7" dot={false} />
                                )}
                                {showCurrent && (
                                    <Line type="monotone" dataKey="current" stroke="#0aa5ff" strokeWidth={3} dot={false} />
                                )}
                                <Tooltip content={<CustomTooltip />} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-start">
                    {sourceMeta.map((src) => {
                        const count = sourceCounts[src.key] ?? src.fallbackCount;
                        const isNegative = src.delta.trim().startsWith('-');
                        return (
                            <div
                                key={src.key}
                                className="inline-flex w-full flex-col rounded-[14px] border border-[#EDF1F7] bg-white px-4 py-3"
                                style={{ background: src.bg }}
                            >
                                <div className="flex items-center gap-2">
                                    <Image src={src.icon} alt={src.label} width={24} height={24} />
                                    <span className="text-[18px] font-normal text-[#000000]">{src.label}</span>
                                </div>
                                <div className="mt-[15px] flex items-center justify-between">
                                    <span className="text-[22px] font-semibold text-[#1f2837]">{count}</span>
                                    <span
                                        className="text-sm font-semibold"
                                        style={{ color: isNegative ? '#ff3b30' : '#15b26e' }}
                                    >
                                        {src.delta}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={cn(
                    "mt-8 grid gap-5",
                    selectedLead
                        ? "grid-cols-1 lg:grid-cols-2"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}>
                    {isLoading && (
                        <div className="col-span-full text-center text-sm text-[#7b8794]">Loading leads...</div>
                    )}
                    {!isLoading && filteredLeads.length === 0 && (
                        <div className="col-span-full text-center text-sm text-[#7b8794]">No leads found.</div>
                    )}
                    {filteredLeads.map((lead) => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            sourceLabel={lead.source || 'Walk in'}
                            onTransfer={() => setTransferLeadId(lead.id)}
                            onClick={setSelectedLead}
                        />
                    ))}
                </div>

                <Dialog open={!!transferLeadId} onOpenChange={(open) => !open && setTransferLeadId(null)}>
                    <DialogContent className="bg-white max-w-md">
                        <DialogHeader>
                            <DialogTitle>Select new responsible agent</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
                            <Input
                                value={transferSearch}
                                onChange={(e) => setTransferSearch(e.target.value)}
                                placeholder="Search agent..."
                                className="mb-2 h-10 rounded-xl border focus-visible:ring-0 border-[#EDF1F7] bg-white text-sm"
                            />
                            {filteredTransferAgents.map((agent) => (
                                <button
                                    key={agent.id}
                                    type="button"
                                    onClick={() => handleTransfer(agent.id)}
                                    disabled={transferLoading}
                                    className="flex w-full items-center justify-between rounded-lg border border-[#EDF1F7] bg-white px-3 py-2 text-left hover:border-[#0aa5ff]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                            {agent.photoUrl ? (
                                                <Image src={agent.photoUrl} alt={agent.name} fill className="object-cover" />
                                            ) : (
                                                <span className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                                                    {agent.name.slice(0, 1)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-[#1b2430]">{agent.name}</span>
                                            <span className="text-xs text-[#97a3b7]">
                                                {agent.languages && agent.languages.length > 0
                                                    ? `Speaks ${agent.languages.join(', ')}`
                                                    : 'Languages not set'}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {selectedLead && (
                <LeadDetailsSidebar
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </div>
    );
}
