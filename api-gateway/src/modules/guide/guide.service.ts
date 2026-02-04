import guideClient from "@/http/guide-client";
import type { GuideDetail, GuideItem } from "@shared/packages";
import { AxiosInstance } from "axios";

export class GuideService {
    constructor(
        private readonly httpClient: AxiosInstance = guideClient
    ) { }

    async getGuides(): Promise<GuideDetail[]> {
        const idsResponse = await this.httpClient.get<string[]>(`/guides`);
        const guideIds = idsResponse.data;
        
        const guidePromises = guideIds.map(id => 
            this.httpClient.get<GuideDetail>(`/guides/${id}`)
        );
        
        const guideResponses = await Promise.all(guidePromises);
        return guideResponses.map(response => response.data).sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    async getGuideDetailById(guideId: string): Promise<GuideDetail> {
        const response = await this.httpClient.get<GuideDetail>(`/guides/${guideId}`);
        return response.data;
    }

    async getGuideItemById(guideItemId: string): Promise<GuideItem> {
        const response = await this.httpClient.get<GuideItem>(`/guide-items/${guideItemId}`);
        return response.data;
    }
}

export const guideService = new GuideService();