import { Step } from '@mastra/core/workflows';
import { z } from 'zod';
import { findSimilarProjects } from '../../../rag/vector-search';

// ProjectTemplateWithSimilarityに対応するZodスキーマ定義
// このステップの出力で使うので、ここで定義するのが自然
export const ProjectTemplateWithSimilaritySchema = z.object({
  id: z.string(),
  user_id: z.string().nullable().optional(),
  name: z.string(),
  category_id: z.string(),
  description: z.string().nullable().optional(),
  actual_hours: z.number().nullable().optional(),
  actual_cost: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  content_embedding: z.array(z.number()).nullable().optional(),
  similarity: z.number(),
});

// ★ 型をエクスポート
export type ProjectTemplateWithSimilarity = z.infer<
  typeof ProjectTemplateWithSimilaritySchema
>;

// Step 1: 要件分析
export const analyzeRequirements = new Step({
  id: 'analyzeRequirements',
  outputSchema: z.object({
    similarProjects: z
      .array(ProjectTemplateWithSimilaritySchema)
      .describe('ユーザー入力に類似するプロジェクトテンプレートのリスト'),
  }),
  execute: async ({ context }) => {
    console.log('--- Step 1: analyzeRequirements ---');
    const triggerData = context.triggerData;
    if (!triggerData || typeof triggerData.userInput !== 'string') {
      throw new Error(
        'Invalid trigger data: userInput is missing or not a string.'
      );
    }
    const userInput = triggerData.userInput;
    console.log('User Input:', userInput);
    const similarProjects = await findSimilarProjects(userInput);
    console.log('Found Similar Projects:', similarProjects.length);
    return { similarProjects };
  },
});
