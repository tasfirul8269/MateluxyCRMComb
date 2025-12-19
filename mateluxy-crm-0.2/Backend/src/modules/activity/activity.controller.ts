import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Prisma } from '@prisma/client';

@Controller('activity-logs')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) { }

    @Post()
    create(@Body() createActivityDto: Prisma.ActivityLogCreateInput) {
        return this.activityService.create(createActivityDto);
    }

    @Get()
    findAll(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('search') search?: string,
    ) {
        const where: Prisma.ActivityLogWhereInput = search
            ? {
                OR: [
                    { action: { contains: search, mode: 'insensitive' } },
                    { user: { fullName: { contains: search, mode: 'insensitive' } } },
                    { user: { email: { contains: search, mode: 'insensitive' } } },
                ],
            }
            : {};

        return this.activityService.findAll({
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
