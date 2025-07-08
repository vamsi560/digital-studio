'use client';

import { ArrowLeft, Download, FileUp, Loader2, RectangleHorizontal, Trash2, Type, XIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
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

const UploadZone = ({ onFileChange, isUploading }: { onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, isUploading: boolean }) => (
    <div className="relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/30 p-12 min-h-[260px]">
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
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <label htmlFor="file-upload" className="cursor-pointer text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12 text-muted-foreground mb-4"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2.4-2.4-4.2-4.8-4.8-1.4-.3-2.7-.1-3.9.7L4 4l-2 2 6.4 6.4c-1.4 2.5-1.2 5.6.6 7.8s5.3 3.5 7.8.6L22 22l-2-2-4.8-4.8z"/><path d="M11 11l2-2"/><path d="m22 2-3 1-1 4-4 1-1 3"/></svg>
            <p className="text-muted-foreground text-sm max-w-xs">
              Upload UI Screenshots to Generate a React Codebase
            </p>
          </label>
        </>
      )}
    </div>
);

const DndGrid = ({ images, onRemoveImage, onFileChange }: {
    images: ImageFile[];
    onRemoveImage: (id: string) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <SortableContext items={images} strategy={rectSortingStrategy}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map(image => (
          <SortableImage key={image.id} image={image} onRemove={onRemoveImage} />
        ))}
         <div className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/50 aspect-video">
            <input
              type="file"
              id="file-upload-more"
              multiple
              accept="image/png, image/jpeg, application/zip"
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label htmlFor="file-upload-more" className="cursor-pointer text-center p-4">
              <FileUp className="h-8 w-8 text-muted-foreground mb-2 mx-auto" />
              <p className="text-muted-foreground text-xs">Add more screens...</p>
            </label>
        </div>
      </div>
    </SortableContext>
);

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

  const readFileAsDataURL = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
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
          const imageFiles = Object.values(zip.files).filter(f => !f.dir && (f.name.endsWith('.png') || f.name.endsWith('.jpg') || f.name.endsWith('.jpeg')));
          imageFiles.sort((a, b) => a.name.localeCompare(b.name));

          for (const zipEntry of imageFiles) {
            const blob = await zipEntry.async('blob');
            const id = `${zipEntry.name}-${Date.now()}`;
            const src = await readFileAsDataURL(blob);
            newImages.push({ id, src });
          }
        } catch (error) {
          console.error("Error unzipping file:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not process the zip file.' });
        }
      }
    }

    setImages(prev => [...prev, ...newImages]);
    setIsUploading(false);
    event.target.value = '';
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
      
      const filesRecord = result.files.reduce((acc, file) => {
        if (file.path && file.content) {
          acc[file.path] = file.content;
        }
        return acc;
      }, {} as Record<string, string>);

      setGeneratedFiles(filesRecord);
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground relative overflow-hidden">
      <Toaster />
      
      <div className="absolute left-8 top-1/2 -translate-y-1/2 transform hidden md:block">
        <p className="text-muted-foreground tracking-[0.4em] uppercase text-sm [writing-mode:vertical-lr] rotate-180">
          Digital Studio
        </p>
      </div>

      <header className="absolute top-0 left-0 w-full p-8 z-10">
        <Link href="/labs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </header>

      <div className="flex flex-1 w-full items-center justify-center p-8">
        <div className="flex flex-row items-start gap-8 w-full max-w-7xl">
          <aside className="w-60 flex-shrink-0 rounded-xl bg-secondary/20 p-6 hidden md:block">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Basic Widgets
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-background p-4 text-center text-muted-foreground aspect-square">
                <Type className="h-6 w-6" />
                <span className="text-xs">Heading</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-background p-4 text-center text-muted-foreground aspect-square">
                <RectangleHorizontal className="h-6 w-6" />
                <span className="text-xs">Button</span>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="text-center mb-8">
              <h2 className="text-lg font-bold text-accent">Digital Studio</h2>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mt-1">Drag & Drop</h1>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
                Upload your UI screenshots to generate a full React codebase, or reorder them to define your application's flow.
              </p>
            </div>
            
            {images.length === 0 ? (
              <UploadZone onFileChange={handleFileChange} isUploading={isUploading} />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <DndGrid images={images} onRemoveImage={handleRemoveImage} onFileChange={handleFileChange} />
              </DndContext>
            )}

            <div className="mt-8 text-center flex justify-center items-center gap-4">
              <Button onClick={handleGenerateCode} disabled={isGenerating || images.length === 0} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 px-8">
                {isGenerating ? <Loader2 className="animate-spin mr-2" /> : null}
                Generate Codebase
              </Button>
              {generatedFiles && (
                 <Button onClick={handleDownload} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Zip
                </Button>
              )}
               {images.length > 0 && !isGenerating && (
                <Button onClick={handleClearAll} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Clear All</span>
                </Button>
              )}
            </div>
            
            <div className="mt-8 w-full border-2 border-dashed border-border/30 rounded-xl p-8 text-center text-muted-foreground min-h-[100px] flex items-center justify-center">
              Or Drag Widgets Here
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
