import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class LeadsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly activityService: ActivityService
    ) { }

    async create(createLeadDto: CreateLeadDto, userId?: string, ipAddress?: string, location?: string) {
        let responsibleName: string | undefined;
        let responsibleAgentId: string | undefined;

        if (createLeadDto.responsible) {
            // `responsible` holds the selected agent id from the frontend
            // @ts-ignore Prisma client includes `agent`
            const agent = await this.prisma.agent.findUnique({
                where: { id: createLeadDto.responsible },
                select: { id: true, name: true },
            });
            if (agent) {
                responsibleAgentId = agent.id;
                responsibleName = agent.name;
            }
        }

        // @ts-ignore Generated Prisma client includes `lead` after `npx prisma generate`
        const lead = await this.prisma.lead.create({
            data: {
                ...createLeadDto,
                responsible: responsibleName,
                responsibleAgentId,
                observers: createLeadDto.observers ?? [],
            },
            include: {
                responsibleAgent: {
                    select: { id: true, name: true, photoUrl: true },
                },
            },
        });

        if (userId) {
            await this.activityService.create({
                user: { connect: { id: userId } },
                action: `Created new Lead: ${lead.name}`,
                ipAddress,
                location,
            });
        }

        return lead;
    }

    async findAll() {
        // @ts-ignore Generated Prisma client includes `lead` after `npx prisma generate`
        return this.prisma.lead.findMany({
            include: {
                responsibleAgent: {
                    select: { id: true, name: true, photoUrl: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        // @ts-ignore Generated Prisma client includes `lead` after `npx prisma generate`
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                responsibleAgent: {
                    select: { id: true, name: true, photoUrl: true },
                },
            },
        });

        if (!lead) {
            throw new NotFoundException('Lead not found');
        }

        return lead;
    }

    async updateResponsible(leadId: string, agentId: string, userId?: string, ipAddress?: string, location?: string) {
        // @ts-ignore Prisma client includes `agent`
        const agent = await this.prisma.agent.findUnique({
            where: { id: agentId },
            select: { id: true, name: true, photoUrl: true },
        });

        if (!agent) {
            throw new NotFoundException('Agent not found');
        }

        // @ts-ignore Prisma client includes `lead`
        const updatedLead = await this.prisma.lead.update({
            where: { id: leadId },
            data: {
                responsibleAgentId: agent.id,
                responsible: agent.name,
            },
            include: {
                responsibleAgent: {
                    select: { id: true, name: true, photoUrl: true },
                },
            },
        });

        if (userId) {
            await this.activityService.create({
                user: { connect: { id: userId } },
                action: `Reassigned Lead ${updatedLead.name} to ${agent.name}`,
                ipAddress,
                location,
            });
        }

        return updatedLead;
    }

    async getStats() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const lastYear = currentYear - 1;
        const startOfLastYear = new Date(lastYear, 0, 1);

        // @ts-ignore Generated Prisma client includes `lead`
        const leads = await this.prisma.lead.findMany({
            where: {
                createdAt: {
                    gte: startOfLastYear,
                },
            },
            select: {
                createdAt: true,
                dealPrice: true,
            },
        });

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Initialize stats
        const stats = months.map(month => ({
            month,
            current: 0,
            last: 0,
        }));

        leads.forEach(lead => {
            const date = new Date(lead.createdAt);
            const year = date.getFullYear();
            const monthIdx = date.getMonth();
            const price = lead.dealPrice || 0;

            if (year === currentYear) {
                stats[monthIdx].current += price;
            } else if (year === lastYear) {
                stats[monthIdx].last += price;
            }
        });

        return stats;
    }
}
