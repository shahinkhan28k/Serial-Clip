'use client';
import { Download, VenetianMask, FileText, Loader2, Forward } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { AspectRatio, Clip } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

type PreviewPanelProps = {
  videoUrl: string | null;
  aspectRatio: AspectRatio;
  generatedClips: Clip[];
  onGenerateCaptions: (clipId: string) => void;
  isCaptioning: string | null;
};

export function PreviewPanel({ videoUrl, aspectRatio, generatedClips, onGenerateCaptions, isCaptioning }: PreviewPanelProps) {
  
  const handleDownload = (clip: Clip) => {
    if (!clip.videoUrl) return;
    const a = document.createElement('a');
    a.href = clip.videoUrl;
    a.download = `${clip.title.replace(/\s+/g, '_') || clip.id}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col items-center justify-center bg-card rounded-lg p-4 lg:p-6 border border-dashed">
        <div 
          className={cn(
            "w-full bg-secondary/50 rounded-md overflow-hidden transition-all duration-300 ease-in-out shadow-inner",
            {
              'aspect-9/16 max-w-[320px]': aspectRatio === '9:16',
              'aspect-4/5 max-w-[400px]': aspectRatio === '4:5',
              'aspect-16/9': aspectRatio === '16:9',
              'aspect-1/1 max-w-[450px]': aspectRatio === '1:1',
            }
          )}
        >
          {videoUrl ? (
            <video key={videoUrl} controls className="w-full h-full object-contain">
              <source src={videoUrl} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
               <VenetianMask className="h-12 w-12 mb-4" />
              <p className="font-semibold">Video Preview</p>
              <p className="text-sm">Your uploaded video will appear here.</p>
            </div>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generated Clips</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-16rem)] pr-4 -mr-4">
             {generatedClips.length > 0 ? (
                <div className="space-y-4">
                  {generatedClips.map((clip) => (
                    <div key={clip.id} className="flex gap-4 items-start p-2 rounded-lg hover:bg-secondary/50">
                      <Image
                        src={clip.thumbnailUrl}
                        alt="Clip thumbnail"
                        width={80}
                        height={142}
                        className="rounded-md object-cover aspect-[9/16]"
                        data-ai-hint={clip.dataAiHint}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-sm">{clip.title || `Clip #${clip.id}`}</h3>
                            <div className="flex items-center text-xs text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full">
                                <Forward className="h-3 w-3 mr-1" />
                                <span>{clip.speed}x</span>
                            </div>
                        </div>
                        <Textarea 
                            readOnly
                            value={clip.captions || "No captions generated yet."} 
                            className="text-xs h-20 resize-none bg-background/50"
                            placeholder="Click 'Generate Captions' to add text here."
                         />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => onGenerateCaptions(clip.id)}
                            disabled={!!isCaptioning}
                          >
                             {isCaptioning === clip.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <FileText className="mr-2 h-4 w-4" />
                            )}
                            Captions
                          </Button>
                          <Button size="sm" className="flex-1" onClick={() => handleDownload(clip)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full p-8">
                  <VenetianMask className="h-12 w-12 mb-4" />
                  <p className="font-semibold">Your clips will appear here</p>
                  <p className="text-sm">Configure settings and click "Generate Clips".</p>
                </div>
             )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
