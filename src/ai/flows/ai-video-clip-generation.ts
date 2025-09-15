'use server';
/**
 * @fileOverview Defines a Genkit flow for generating video clips from a source video.
 *
 * - generateVideoClips - A function that accepts video data and generation parameters, and returns video clips.
 * - GenerateVideoClipsInput - The input type for the generateVideoClips function.
 * - GenerateVideoClipsOutput - The return type for the generateVideoClips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateVideoClipsInputSchema, GenerateVideoClipsOutputSchema, type GenerateVideoClipsInput, type GenerateVideoClipsOutput } from '@/lib/types';


export async function generateVideoClips(input: GenerateVideoClipsInput): Promise<GenerateVideoClipsOutput> {
  return generateVideoClipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoClipsPrompt',
  input: {schema: GenerateVideoClipsInputSchema},
  output: {schema: GenerateVideoClipsOutputSchema},
  prompt: `You are an expert video editor. Analyze the provided video and identify the most engaging segments to create short clips.

Based on the following parameters, identify the best start and end times for each clip.

Desired Clip Length: {{clipLength}} seconds
Desired Styles: {{#each styles}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}

Analyze the following video:
{{media url=videoDataUri}}

Return an array of clip metadata with start times, end times, and a catchy title for each.`,
});

const generateVideoClipsFlow = ai.defineFlow(
  {
    name: 'generateVideoClipsFlow-clipcraft-v1',
    inputSchema: GenerateVideoClipsInputSchema,
    outputSchema: GenerateVideoClipsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
