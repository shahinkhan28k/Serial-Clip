'use server';
/**
 * @fileOverview Suggests clip styles (e.g., action, funny, educational) based on AI analysis of video content.
 *
 * - suggestClipStyles - A function that suggests clip styles.
 * - SuggestClipStylesInput - The input type for the suggestClipStyles function.
 * - SuggestClipStylesOutput - The return type for the suggestClipStyles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestClipStylesInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestClipStylesInput = z.infer<typeof SuggestClipStylesInputSchema>;

const SuggestClipStylesOutputSchema = z.object({
  suggestedStyles: z
    .array(z.string())
    .describe('An array of suggested clip styles based on the video content.'),
});
export type SuggestClipStylesOutput = z.infer<typeof SuggestClipStylesOutputSchema>;

export async function suggestClipStyles(input: SuggestClipStylesInput): Promise<SuggestClipStylesOutput> {
  return suggestClipStylesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestClipStylesPrompt',
  input: {schema: SuggestClipStylesInputSchema},
  output: {schema: SuggestClipStylesOutputSchema},
  prompt: `You are an AI video content analyzer. Analyze the provided video and suggest clip styles that would be most engaging for viewers.

Consider styles such as action, funny, educational, dramatic, etc.

Analyze the following video:

{{media url=videoDataUri}}

Return an array of suggested styles.`,
});

const suggestClipStylesFlow = ai.defineFlow(
  {
    name: 'suggestClipStylesFlow',
    inputSchema: SuggestClipStylesInputSchema,
    outputSchema: SuggestClipStylesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
