import restaurantClient from "@/http/restaurant-client";
import type { Restaurant } from "@shared/packages";
import { AxiosInstance } from "axios";

export class RestaurantService {
    constructor(
        private readonly httpClient: AxiosInstance = restaurantClient
    ) { }

    async getRestaurantById(restaurantId: string): Promise<Restaurant> {
        const response = await this.httpClient.get<Restaurant>(`/restaurants/${restaurantId}`);
        return response.data;
    }
}

export const restaurantService = new RestaurantService();