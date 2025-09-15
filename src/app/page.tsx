'use client';

import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Header } from '@/components/clipcraft/header';
import { SettingsPanel } from '@/components/clipcraft/settings-panel';
import { PreviewPanel } from '@/components/clipcraft/preview-panel';
import type { AspectRatio, Clip, SocialPlatform } from '@/lib/types';
import { getStyleSuggestions, getCaptionsForClip } from '@/app/actions';
import { onClipsValue, writeClip } from '@/lib/database';

export default function Home() {
  const { toast } = useToast();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const [platform, setPlatform] = useState<SocialPlatform>('TikTok');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [clipLength, setClipLength] = useState<string>('15');
  const [analysisLevel, setAnalysisLevel] = useState<number[]>([50]);
  
  const [suggestedStyles, setSuggestedStyles] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<Set<string>>(new Set());
  
  const [generatedClips, setGeneratedClips] = useState<Clip[]>([]);
  
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCaptioning, setIsCaptioning] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onClipsValue((clips) => {
      setGeneratedClips(clips);
    });
    return () => unsubscribe();
  }, []);


  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setGeneratedClips([]);
      setSuggestedStyles([]);
      setSelectedStyles(new Set());
      
      setIsSuggesting(true);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result as string;
          const { suggestedStyles, error } = await getStyleSuggestions(base64);
          if (error) {
            toast({ variant: "destructive", title: "Error", description: error });
          } else if (suggestedStyles) {
            setSuggestedStyles(suggestedStyles);
          }
          setIsSuggesting(false);
        };
        reader.onerror = () => {
            toast({ variant: "destructive", title: "Error", description: "Failed to read the file." });
            setIsSuggesting(false);
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
        setIsSuggesting(false);
      }
    }
  };

  const handleStyleToggle = (style: string) => {
    setSelectedStyles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(style)) {
        newSet.delete(style);
      } else {
        newSet.add(style);
      }
      return newSet;
    });
  };

  const handleGenerateClips = async () => {
    if (!videoFile) {
      toast({ variant: "destructive", title: "No video selected", description: "Please upload a video to generate clips." });
      return;
    }
    setIsGenerating(true);
    
    try {
      // In a real scenario, you would generate a unique clip and upload it to storage.
      // For now, we'll create a new placeholder clip entry in the database.
      const newClip: Clip = {
        id: `clip-${Date.now()}`,
        thumbnailUrl: `https://picsum.photos/seed/${Date.now()}/400/711`,
        dataAiHint: 'new clip',
        captions: '',
      };

      await writeClip(newClip);
      
      toast({ title: "Success!", description: `1 new clip has been generated and saved.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate and save clip." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCaptions = async (clipId: string) => {
      if (!videoFile) return;
      
      const clipToUpdate = generatedClips.find(c => c.id === clipId);
      if (!clipToUpdate) return;
      
      setIsCaptioning(clipId);
       try {
        const reader = new FileReader();
        reader.readAsDataURL(videoFile);
        reader.onload = async () => {
            const base64 = reader.result as string;
            const { captions, error } = await getCaptionsForClip(base64);

            if (error) {
                toast({ variant: "destructive", title: "Captioning Error", description: error });
            } else if (captions) {
                const updatedClip = { ...clipToUpdate, captions };
                await writeClip(updatedClip);
                toast({ title: "Captions Generated", description: "Captions have been added and saved." });
            }
            setIsCaptioning(null);
        }
         reader.onerror = () => {
            toast({ variant: "destructive", title: "Error", description: "Failed to process video for captioning." });
            setIsCaptioning(null);
        }

       } catch (error) {
         toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred during captioning." });
         setIsCaptioning(null);
       }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          <div className="lg:col-span-4 xl:col-span-3">
            <SettingsPanel
              onFileChange={handleFileChange}
              platform={platform}
              setPlatform={setPlatform}
              setAspectRatio={setAspectRatio}
              clipLength={clipLength}
              setClipLength={setClipLength}
              analysisLevel={analysisLevel}
              setAnalysisLevel={setAnalysisLevel}
              suggestedStyles={suggestedStyles}
              selectedStyles={selectedStyles}
              onStyleToggle={handleStyleToggle}
              onGenerateClips={handleGenerateClips}
              isSuggesting={isSuggesting}
              isGenerating={isGenerating}
              videoLoaded={!!videoFile}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <PreviewPanel
              videoUrl={videoUrl}
              aspectRatio={aspectRatio}
              generatedClips={generatedClips}
              onGenerateCaptions={handleGenerateCaptions}
              isCaptioning={isCaptioning}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
