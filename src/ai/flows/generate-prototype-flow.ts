'use server';
/**
 * @fileOverview A Genkit flow for generating a React codebase from UI screenshots.
 *
 * - generatePrototype - A function that handles the code generation process.
 * - GeneratePrototypeInput - The input type for the generatePrototype function.
 * - GeneratePrototypeOutput - The return type for the generatePrototype function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePrototypeInputSchema = z.object({
  images: z
    .array(z.string())
    .describe(
      "An array of UI screenshots as data URIs. The order of images determines the navigation flow of the app. Each data URI must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GeneratePrototypeInput = z.infer<
  typeof GeneratePrototypeInputSchema
>;

const GeneratePrototypeOutputSchema = z.object({
  files: z
    .record(z.string())
    .describe(
      'A map of file paths to their string content. Example: {"src/app/page.tsx": "...", "src/components/Button.tsx": "..."}'
    ),
});
export type GeneratePrototypeOutput = z.infer<
  typeof GeneratePrototypeOutputSchema
>;

export async function generatePrototype(
  input: GeneratePrototypeInput
): Promise<GeneratePrototypeOutput> {
  return generatePrototypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePrototypePrompt',
  input: {schema: GeneratePrototypeInputSchema},
  output: {schema: GeneratePrototypeOutputSchema},
  prompt: `You are an expert Next.js developer. Your task is to generate a complete, functional Next.js application based on a sequence of UI screenshots.

The application must use the Next.js App Router.
Use TypeScript and TSX files.
Use TailwindCSS for styling. You can use shadcn/ui components if they are appropriate, as they are available in the project.
The navigation between pages must follow the order of the images provided. Add Next.js <Link> components or buttons with router.push to navigate from one screen to the next. The first image is the home page, the second is the next page, and so on.

The output must be a single JSON object. The keys of this object must be the full file paths (e.g., 'src/app/page.tsx', 'src/app/about/page.tsx', 'src/components/Header.tsx'), and the values must be the complete code content for each file as a string.

Create a root layout in 'src/app/layout.tsx'.
Create a home page at 'src/app/page.tsx' which corresponds to the first image.
Create subsequent pages for the other images (e.g., 'src/app/screen2/page.tsx', 'src/app/screen3/page.tsx').
You can create reusable components in 'src/components/'.
Use placeholder images from https://placehold.co where necessary.

Here is the sequence of screens to implement:
{{#each images}}
Screen {{@index}}:
{{media url=this}}
{{/each}}`,
});

const generatePrototypeFlow = ai.defineFlow(
  {
    name: 'generatePrototypeFlow',
    inputSchema: GeneratePrototypeInputSchema,
    outputSchema: GeneratePrototypeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate code from the model.');
    }
    return output;
  }
);
