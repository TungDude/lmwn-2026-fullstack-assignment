import { createHttpClient } from './create-http-client';
import { config } from '@/config/env';

const restaurantClient = createHttpClient({
  baseURL: config.restaurantServiceUrl || 'http://localhost:9999',
});

export default restaurantClient;