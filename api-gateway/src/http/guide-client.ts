import { createHttpClient } from './create-http-client';
import { config } from '@/config/env';

const guideClient = createHttpClient({
  baseURL: config.guideServiceUrl || 'http://localhost:8888',
});

export default guideClient;