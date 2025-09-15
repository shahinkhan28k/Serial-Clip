import { z } from 'zod';

export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9';
export type SocialPlatform = 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube';

export interface Clip {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  dataAiHint: string;
  captions: string;
  speed: number;
}

// Schema and types for ai-video-clip-generation flow
const ClipDataSchema = z.object({
  id: z.string().describe('A unique identifier for the clip.'),
  startTime: z.number().describe('The start time of the clip in seconds.'),
  endTime: z.number().describe('The end time of the clip in seconds.'),
  title: z.string().describe('A catchy title for the generated clip.'),
});

export const GenerateVideoClipsInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "The source video as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  clipLength: z.string().describe('The desired length of the clips in seconds.'),
  styles: z.array(z.string()).describe('An array of desired styles for the clips (e.g., "funny", "action").'),
});
export type GenerateVideoClipsInput = z.infer<typeof GenerateVideoClipsInputSchema>;

export const GenerateVideoClipsOutputSchema = z.object({
  clips: z
    .array(ClipDataSchema)
    .describe('An array of generated video clip metadata.'),
});
export type GenerateVideoClipsOutput = z.infer<typeof GenerateVideoClipsOutputSchema>;
