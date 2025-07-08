'use client'

import { ArrowLeft, Type, RectangleHorizontal, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

function WidgetButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background/50 text-foreground w-full cursor-pointer hover:bg-background">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default function PrototypePage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-0">
          <SidebarGroup>
            <SidebarGroupLabel>BASIC WIDGETS</SidebarGroupLabel>
            <div className="grid grid-cols-2 gap-2 p-2 pt-0">
              <WidgetButton icon={<Type className="h-6 w-6" />} label="Heading" />
              <WidgetButton icon={<RectangleHorizontal className="h-6 w-6" />} label="Button" />
            </div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
           <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-transparent px-4 md:px-6">
            <SidebarTrigger />
            <Link href="/labs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </header>

          <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-medium text-accent">Digital Studio</h2>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">Drag &amp; Drop</h1>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Upload a UI screenshot to generate a full React codebase, or drag and drop widgets to build a simple layout.
              </p>
            </div>

            <div className="w-full max-w-5xl flex flex-col gap-6 mt-8">
              <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border/50 rounded-xl flex-grow min-h-[200px]">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Upload an Image to Generate a React Codebase</p>
              </div>
              
              <Button size="lg" className="w-full max-w-sm mx-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6">Generate Codebase</Button>
              
              <div className="flex items-center justify-center text-center p-8 border-2 border-dashed border-border/50 rounded-xl h-32">
                <p className="text-muted-foreground">Or Drag Widgets Here</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
