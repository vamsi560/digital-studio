'use server';

import {
  generatePrototype,
  GeneratePrototypeOutput,
} from '@/ai/flows/generate-prototype-flow';

export async function generateCodebaseAction(
  images: string[]
): Promise<GeneratePrototypeOutput> {
  try {
    const result = await generatePrototype({ images });
    return result;
  } catch (error) {
    console.error('Error generating codebase:', error);
    throw new Error('Failed to generate codebase. Please try again.');
  }
}
