import { ArrowLeft, Type, RectangleHorizontal, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    <div className="relative flex min-h-screen w-full flex-col bg-background text-foreground p-4 sm:p-8">
      <header className="absolute top-8 left-8">
        <Link href="/labs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </header>

      <aside className="absolute top-1/2 left-8 -translate-y-1/2 hidden lg:block">
        <div className="[writing-mode:vertical-rl] transform rotate-180 text-muted-foreground tracking-widest text-sm uppercase">
          Creative
        </div>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center pt-24 lg:pt-16">
        <div className="text-center mb-8">
          <h2 className="text-xl font-medium text-accent">Digital Studio</h2>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">Drag &amp; Drop</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Upload a UI screenshot to generate a full React codebase, or drag and drop widgets to build a simple layout.
          </p>
        </div>

        <div className="flex w-full max-w-7xl flex-col lg:flex-row gap-8 mt-8 items-stretch">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 bg-secondary/20 p-6 rounded-xl flex flex-col gap-4">
            <h3 className="font-semibold text-foreground/80">BASIC WIDGETS</h3>
            <div className="grid grid-cols-2 gap-4">
              <WidgetButton icon={<Type className="h-6 w-6" />} label="Heading" />
              <WidgetButton icon={<RectangleHorizontal className="h-6 w-6" />} label="Button" />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border/50 rounded-xl flex-grow min-h-[200px]">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Upload an Image to Generate a React Codebase</p>
            </div>
            
            <Button size="lg" className="w-full max-w-sm mx-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6">Generate Codebase</Button>
            
            <div className="flex items-center justify-center text-center p-8 border-2 border-dashed border-border/50 rounded-xl h-32">
              <p className="text-muted-foreground">Or Drag Widgets Here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
