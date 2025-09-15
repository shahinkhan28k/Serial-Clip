export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9';
export type SocialPlatform = 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube';

export interface Clip {
  id: string;
  thumbnailUrl: string;
  dataAiHint: string;
  captions: string;
}
