import { Monitor, Smartphone, Layers } from 'lucide-react';
import Link from 'next/link';

function LabCard({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="block">
      <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center gap-6 w-60 h-48 hover:bg-secondary hover:border-primary transition-all duration-300 cursor-pointer shadow-lg hover:shadow-primary/10 transform hover:-translate-y-1">
        {icon}
        <p className="text-lg font-medium text-primary/90">{label}</p>
      </div>
    </Link>
  );
}

export default function LabsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-primary bg-background">
      <div className="flex flex-col items-center text-center">
        <header className="flex items-center space-x-3 mb-16">
          <span className="bg-muted text-foreground font-bold p-2 px-3 rounded-md">VM</span>
          <span className="text-xl font-semibold">Digital Studio</span>
        </header>

        <h1 className="text-5xl md:text-6xl font-bold mb-16 motion-safe:animate-fade-in">
          Introducing
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 motion-safe:animate-fade-in" style={{animationDelay: '0.5s'}}>
          <LabCard href="#" icon={<Monitor className="h-10 w-10 text-primary/80" />} label="Prototype Lab" />
          <LabCard href="#" icon={<Smartphone className="h-10 w-10 text-primary/80" />} label="App Lab" />
          <LabCard href="#" icon={<Layers className="h-10 w-10 text-primary/80" />} label="Integration Lab" />
        </div>
      </div>
    </main>
  );
}
