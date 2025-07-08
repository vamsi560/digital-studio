'use client';

import { ArrowLeft, Download, FileUp, Loader2, Package, Trash2, XIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React, { useCallback, useState } from 'react';
import JSZip from 'jszip';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateCodebaseAction } from './actions';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ImageFile = {
  id: string;
  src: string;
};

function SortableImage({ image, onRemove }: { image: ImageFile, onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative aspect-video rounded-lg overflow-hidden group border-2 border-border/50 shadow-sm">
      <img src={image.src} alt={`upload-preview-${image.id}`} className="w-full h-full object-contain bg-secondary/20" />
      <button onClick={() => onRemove(image.id)} className="absolute top-2 right-2 p-1.5 bg-background/50 rounded-full text-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-opacity">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function PrototypePage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string> | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setGeneratedFiles(null);
    const newImages: ImageFile[] = [];

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const id = `${file.name}-${Date.now()}`;
        const src = await readFileAsDataURL(file);
        newImages.push({ id, src });
      } else if (file.type === 'application/zip') {
        try {
          const zip = await JSZip.loadAsync(file);
          for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
            if (!zipEntry.dir && (zipEntry.name.endsWith('.png') || zipEntry.name.endsWith('.jpg') || zipEntry.name.endsWith('.jpeg'))) {
              const blob = await zipEntry.async('blob');
              const id = `${zipEntry.name}-${Date.now()}`;
              const src = await readFileAsDataURL(blob);
              newImages.push({ id, src });
            }
          }
        } catch (error) {
          console.error("Error unzipping file:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not process the zip file.' });
        }
      }
    }

    setImages(prev => [...prev, ...newImages]);
    setIsUploading(false);
  };

  const readFileAsDataURL = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages(images => images.filter(image => image.id !== id));
  }
  
  const handleClearAll = () => {
    setImages([]);
    setGeneratedFiles(null);
  }

  const handleGenerateCode = async () => {
    if (images.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please upload at least one screen image.' });
      return;
    }
    setIsGenerating(true);
    setGeneratedFiles(null);
    try {
      const imageData = images.map(img => img.src);
      const result = await generateCodebaseAction(imageData);
      setGeneratedFiles(result.files);
      toast({ title: 'Success!', description: 'Your codebase has been generated.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Generation Failed', description: (error as Error).message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedFiles) return;
    const zip = new JSZip();
    for (const [path, content] of Object.entries(generatedFiles)) {
      const folders = path.substring(0, path.lastIndexOf('/'));
      if (folders) {
        zip.folder(folders);
      }
      zip.file(path, content);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vm-digital-studio-prototype.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const UploadZone = () => (
    <div className="flex w-full flex-col items-center justify-center gap-6 text-center">
      <div className="relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 p-12 min-h-[260px]">
        {isUploading ? (
          <>
            <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mb-4" />
            <p className="text-muted-foreground text-sm">Processing your files...</p>
          </>
        ) : (
          <>
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/png, image/jpeg, application/zip"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileUp className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
              <p className="text-muted-foreground text-sm max-w-xs">
                Click or drag & drop to upload screenshots or a zip file to generate a React Codebase
              </p>
            </label>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground relative overflow-hidden">
      <Toaster />
      <div className="absolute left-8 top-1/2 -translate-y-1/2 transform">
        <p className="text-muted-foreground tracking-[0.4em] uppercase text-sm [writing-mode:vertical-lr] rotate-180">
          Creative
        </p>
      </div>

      <header className="absolute top-0 left-0 w-full p-8 z-10">
        <Link href="/labs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-row items-start gap-12 w-full max-w-6xl">
          <aside className="w-72 flex-shrink-0 rounded-xl bg-secondary/20 p-6 sticky top-20">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Prototype Builder
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Upload, order, and generate your app.</p>
            
            <div className="space-y-4">
              <Button onClick={handleGenerateCode} disabled={isGenerating || images.length === 0} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6">
                {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Package className="mr-2" />}
                Generate Code
              </Button>
              
              {generatedFiles && (
                 <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2" />
                    Download Zip
                </Button>
              )}

              {images.length > 0 && (
                <Button onClick={handleClearAll} variant="outline" className="w-full">
                  <Trash2 className="mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </aside>

          <div className="flex-1 w-full min-w-0">
            {images.length === 0 ? (
                <UploadZone />
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {images.map(image => (
                      <SortableImage key={image.id} image={image} onRemove={handleRemoveImage} />
                    ))}
                     <div className="relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 min-h-[160px] aspect-video">
                        <input
                          type="file"
                          id="file-upload-more"
                          multiple
                          accept="image/png, image/jpeg, application/zip"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <label htmlFor="file-upload-more" className="cursor-pointer text-center p-4">
                          <FileUp className="h-8 w-8 text-muted-foreground mb-2 mx-auto" />
                          <p className="text-muted-foreground text-xs">Add more screens...</p>
                        </label>
                    </div>
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
