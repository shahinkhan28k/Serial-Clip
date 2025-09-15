'use client';

import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { Facebook, Instagram, Youtube, Upload, Wand2, Loader2, Film } from 'lucide-react';
import { TikTokIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import type { AspectRatio, SocialPlatform } from '@/lib/types';

const platformConfig: { name: SocialPlatform; icon: React.ReactNode; aspectRatio: AspectRatio }[] = [
  { name: 'TikTok', icon: <TikTokIcon className="h-5 w-5" />, aspectRatio: '9:16' },
  { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, aspectRatio: '4:5' },
  { name: 'YouTube', icon: <Youtube className="h-5 w-5" />, aspectRatio: '16:9' },
  { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, aspectRatio: '1:1' },
];

type SettingsPanelProps = {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  platform: SocialPlatform;
  setPlatform: Dispatch<SetStateAction<SocialPlatform>>;
  setAspectRatio: Dispatch<SetStateAction<AspectRatio>>;
  clipLength: string;
  setClipLength: Dispatch<SetStateAction<string>>;
  analysisLevel: number[];
  setAnalysisLevel: Dispatch<SetStateAction<number[]>>;
  suggestedStyles: string[];
  selectedStyles: Set<string>;
  onStyleToggle: (style: string) => void;
  onGenerateClips: () => void;
  isSuggesting: boolean;
  isGenerating: boolean;
  videoLoaded: boolean;
};

export function SettingsPanel({
  onFileChange,
  platform,
  setPlatform,
  setAspectRatio,
  clipLength,
  setClipLength,
  analysisLevel,
  setAnalysisLevel,
  suggestedStyles,
  selectedStyles,
  onStyleToggle,
  onGenerateClips,
  isSuggesting,
  isGenerating,
  videoLoaded,
}: SettingsPanelProps) {
  
  const handlePlatformChange = (value: SocialPlatform) => {
    setPlatform(value);
    const config = platformConfig.find(p => p.name === value);
    if (config) {
      setAspectRatio(config.aspectRatio);
    }
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Create Your Clip</CardTitle>
        <CardDescription>Upload a video and configure the settings to generate viral clips.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="video-upload-button">1. Upload Video</Label>
          <Button asChild variant="outline" className="w-full transition-all duration-300 hover:shadow-md">
            <label htmlFor="video-upload-input" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Choose a file
              <input id="video-upload-input" type="file" accept="video/*" className="sr-only" onChange={onFileChange} />
            </label>
          </Button>
        </div>

        <div className="space-y-3">
          <Label>2. Target Platform</Label>
          <RadioGroup 
            value={platform} 
            onValueChange={(value: string) => handlePlatformChange(value as SocialPlatform)} 
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2"
          >
            {platformConfig.map(({ name, icon }) => (
              <div key={name}>
                <RadioGroupItem value={name} id={name} className="sr-only" />
                <Label
                  htmlFor={name}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                >
                  {icon}
                  <span className="mt-1.5 text-xs">{name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clip-length">3. Clip Length</Label>
          <Select value={clipLength} onValueChange={setClipLength}>
            <SelectTrigger id="clip-length">
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="15">15 seconds</SelectItem>
              <SelectItem value="20">20 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">1 minute</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>4. AI Style Suggestions</Label>
            {isSuggesting ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing video...
              </div>
            ) : suggestedStyles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {suggestedStyles.map(style => (
                <Badge 
                  key={style}
                  variant={selectedStyles.has(style) ? 'default' : 'secondary'}
                  onClick={() => onStyleToggle(style)}
                  className="cursor-pointer transition-all hover:scale-105"
                >
                  {style}
                </Badge>
              ))}
            </div>
            ) : videoLoaded ? (
                <p className="text-sm text-muted-foreground">No style suggestions available.</p>
            ) : (
                <p className="text-sm text-muted-foreground">Upload a video to get AI suggestions.</p>
            )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="analysis-level">5. Analysis Sensitivity</Label>
          <Slider 
            id="analysis-level"
            defaultValue={[50]} 
            max={100} 
            step={1} 
            value={analysisLevel}
            onValueChange={setAnalysisLevel}
          />
           <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <Button 
          onClick={onGenerateClips} 
          disabled={isGenerating || !videoLoaded} 
          className="w-full font-semibold text-base py-6 transition-transform duration-200 active:scale-[0.98]"
        >
          {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Film className="mr-2 h-5 w-5" />}
          Generate Clips
        </Button>
      </CardContent>
    </Card>
  );
}
