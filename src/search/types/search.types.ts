import { z } from 'zod';
import { FullSearchQuerySchema, SimpleSearchQuerySchema,  } from '@/search/schemas/search.query.schemas';
import { WalmartApiResponseSchema, WalmartProductSchema } from '@/search/schemas/search.result.schemas';


// Query Types
export type FullSearchQuery = z.infer<typeof FullSearchQuerySchema>;
export type SimpleSearchQuery = z.infer<typeof SimpleSearchQuerySchema>;
export type SearchQuery = FullSearchQuery | SimpleSearchQuery;

// Response Types
export type WalmartApiResponse = z.infer<typeof WalmartApiResponseSchema>;
export type WalmartProduct = z.infer<typeof WalmartProductSchema>;
