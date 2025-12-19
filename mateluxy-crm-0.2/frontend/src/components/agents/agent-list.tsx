'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAgents } from '@/lib/hooks/use-agents';
import { AgentCard } from './agent-card';
import { AgentCardSkeleton } from './agent-card-skeleton';
import { Agent } from '@/lib/services/agent.service';

interface AgentListProps {
    search?: string;
    filterStatus?: boolean;
    onEdit: (agent: Agent) => void;
    onDelete: (agent: Agent) => void;
}

export function AgentList({ search, filterStatus, onEdit, onDelete }: AgentListProps) {
    const { data: agents, isLoading, error } = useAgents(search);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <AgentCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-64 w-full items-center justify-center text-red-500">
                Failed to load agents
            </div>
        );
    }

    const filteredAgents = agents?.filter(agent => {
        if (filterStatus === undefined) return true;
        return agent.isActive === filterStatus;
    });

    if (!filteredAgents || filteredAgents.length === 0) {
        return (
            <div className="flex h-64 w-full items-center justify-center text-gray-500">
                No agents found
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgents.map((agent) => (
                <AgentCard
                    key={agent.id}
                    agent={agent}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
