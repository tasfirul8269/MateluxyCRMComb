import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsArray, IsObject, ValidateIf, IsBoolean } from 'class-validator';

export class CreateOffPlanPropertyDto {
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsNotEmpty()
    @IsString()
    developerId: string;

    // Specific Details
    @ValidateIf(o => o.isActive === true)
    @IsNotEmpty()
    @IsString()
    emirate: string;

    @ValidateIf(o => o.isActive === true)
    @IsNotEmpty()
    @IsString()
    launchType: string;

    @ValidateIf(o => o.isActive === true)
    @IsNotEmpty()
    @IsString()
    projectHighlight: string;

    @ValidateIf(o => o.isActive === true)
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    propertyType: string[];

    @IsOptional()
    @IsNumber()
    @Min(0)
    plotArea?: number;

    @ValidateIf(o => o.isActive === true)
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    area: number;

    @ValidateIf(o => o.isActive === true)
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    bedrooms: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    kitchens?: number;

    @ValidateIf(o => o.isActive === true)
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    bathrooms: number;

    // Locations
    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;

    @IsOptional()
    @IsString()
    style?: string;

    @IsOptional()
    @IsString()
    focalPoint?: string;

    @IsOptional()
    @IsString()
    focalPointImage?: string;

    @IsOptional()
    @IsArray()
    nearbyHighlights?: Array<{
        title: string;
        subtitle: string;
        highlights: Array<{
            name: string;
            image?: string;
        }>;
    }>;

    // Price Tab
    @IsOptional()
    @IsNumber()
    @Min(0)
    startingPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    serviceCharges?: number;

    @IsOptional()
    @IsString()
    brokerFee?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    roiPotential?: number;

    @IsOptional()
    @IsObject()
    paymentPlan?: {
        title: string;
        subtitle: string;
        milestones: Array<{
            label: string;
            percentage: string;
            subtitle: string;
        }>;
    };

    // DLD & Status
    @ValidateIf(o => o.isActive === true)
    @IsNotEmpty()
    @IsString()
    dldPermitNumber: string;

    @IsOptional()
    @IsString()
    dldQrCode?: string;

    @IsOptional()
    @IsString()
    projectStage?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    constructionProgress?: number;

    @IsOptional()
    @IsString() // Date string from frontend
    handoverDate?: string;

    // General Details
    @ValidateIf(o => o.isActive === true)
    @IsNotEmpty()
    @IsString()
    projectTitle: string;

    @ValidateIf(o => o.isActive === true)
    @IsNotEmpty()
    @IsString()
    shortDescription: string;

    @ValidateIf(o => o.isActive === true)
    @IsNotEmpty()
    @IsString()
    projectDescription: string;

    // Media
    @IsOptional()
    @IsString()
    coverPhoto?: string;

    @IsOptional()
    @IsString()
    videoUrl?: string;

    @IsOptional()
    @IsString()
    agentVideoUrl?: string;

    @IsOptional()
    @IsString()
    virtualTourUrl?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    exteriorMedia?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    interiorMedia?: string[];

    // Additional
    @ValidateIf(o => o.isActive === true)
    @IsOptional()
    @IsString()
    reference?: string;

    @IsOptional()
    @IsString()
    brochure?: string;

    @IsOptional()
    @IsString()
    amenitiesCover?: string;

    @IsOptional()
    @IsString()
    amenitiesTitle?: string;

    @IsOptional()
    @IsString()
    amenitiesSubtitle?: string;

    @IsOptional()
    @IsArray()
    amenities?: Array<{
        name: string;
        icon: string;
    }>;

    @IsOptional()
    @IsArray()
    floorPlans?: Array<{
        propertyType: string;
        livingArea: string;
        price: string;
        floorPlanImage?: string;
    }>;

    // Agent Tab
    @IsOptional()
    @IsObject()
    areaExperts?: Record<string, string[]>;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    projectExperts?: string[];
}

