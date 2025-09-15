'use server';

import { suggestClipStyles } from "@/ai/flows/ai-clip-style-suggestion";
import { generateCaptions } from "@/ai/flows/ai-auto-caption-generation";

export async function getStyleSuggestions(videoDataUri: string) {
  try {
    const { suggestedStyles } = await suggestClipStyles({ videoDataUri });
    return { suggestedStyles };
  } catch (error) {
    console.error('Error suggesting clip styles:', error);
    return { error: 'Failed to get AI style suggestions. Please try again.' };
  }
}

export async function getCaptionsForClip(videoDataUri: string) {
    try {
        const { captions } = await generateCaptions({ videoDataUri });
        return { captions };
    } catch (error) {
        console.error('Error generating captions:', error);
        return { error: 'Failed to generate captions for the clip. The video may not contain clear speech.' };
    }
}
