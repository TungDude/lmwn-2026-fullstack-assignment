import "dotenv/config";

export const config = {
    port: process.env.PORT || 3001,
    env: process.env.ENV || 'development',
    corsOptions: {
        origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: process.env.CORS_CREDENTIALS ? process.env.CORS_CREDENTIALS === 'true' : true,
    },
    guideServiceUrl: process.env.GUIDE_SERVICE_URL || 'http://localhost:8888',
    restaurantServiceUrl: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:9999',
}