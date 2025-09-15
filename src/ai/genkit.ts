import {genkit} from 'genkit';
import {googleAI} from '@gen-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-pro',
});
