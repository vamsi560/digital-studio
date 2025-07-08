import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyAlW859ro344ulhwmTJKwWmYx8uHiTa2IE'})],
  model: 'googleai/gemini-1.5-pro-latest',
});
