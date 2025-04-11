// apps/web/lib/mastra/client.ts
import { MastraClient } from '@mastra/client-js';

// クライアント側では直接使わないことに注意
export const mastraClient = new MastraClient({
  baseUrl: process.env.MASTRA_API_URL || 'http://localhost:4111',
});
