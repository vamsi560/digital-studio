'use client'

import { ArrowLeft, Type, RectangleHorizontal, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function WidgetButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-card text-card-foreground cursor-pointer hover:bg-secondary w-full aspect-square">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
  );
}

export default function PrototypePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground relative overflow-hidden">
      
      <div className="absolute left-8 top-1/2 -translate-y-1/2 transform">
        <p className="text-muted-foreground tracking-[0.4em] uppercase text-sm [writing-mode:vertical-lr] rotate-180">
          Creative
        </p>
      </div>

      <header className="absolute top-0 left-0 w-full p-8">
        <Link href="/labs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-row items-center gap-12">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0 rounded-xl bg-secondary/20 p-6">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Basic Widgets
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <WidgetButton icon={<Type className="h-8 w-8" />} label="Heading" />
              <WidgetButton icon={<RectangleHorizontal className="h-8 w-8" />} label="Button" />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex w-full max-w-md flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-xl font-medium text-accent">Digital Studio</h2>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">Drag &amp; Drop</h1>
              <p className="mt-4 max-w-sm text-muted-foreground">
                Upload a UI screenshot to generate a full React codebase, or drag and drop
                widgets to build a simple layout.
              </p>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-6 text-center">
                <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 p-12 min-h-[160px]">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-sm">Upload an Image to Generate a React Codebase</p>
                </div>
                
                <Button size="lg" className="w-full max-w-xs bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6">
                    Generate Codebase
                </Button>
                
                <div className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-border/50 p-8 min-h-[90px]">
                    <p className="text-muted-foreground text-sm">Or Drag Widgets Here</p>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
