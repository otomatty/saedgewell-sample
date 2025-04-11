'use server';

import { generateGeminiResponse } from '../../lib/server/gemini';
import { generateQuestionPrompt } from '../../lib/server/gemini';
import type { EstimateFormData, AIQuestion } from '../../types/estimate';

export async function generateQuestions(
  formData: EstimateFormData
): Promise<AIQuestion[]> {
  try {
    const prompt = generateQuestionPrompt(formData);
    const response = await generateGeminiResponse(prompt);
    const { questions } = JSON.parse(response);

    return questions.map(
      (q: {
        id: string;
        question: string;
        type: string;
        options?: string[];
        description?: string;
      }) => ({
        id: q.id,
        question: q.question,
        type: q.type === 'radio' ? 'radio' : 'text',
        options: q.options,
        isAnswered: false,
        answer: '',
        description: q.description || '追加の質問です',
        skipped: false,
      })
    );
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}
