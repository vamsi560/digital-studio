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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 text-primary bg-background">
      <div className="w-full max-w-5xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="relative bg-secondary/30 p-3 flex items-center border-b border-border">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <div className="flex flex-col items-center text-center p-8 md:p-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-16 motion-safe:animate-fade-in">
            Introducing
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 motion-safe:animate-fade-in" style={{animationDelay: '0.5s'}}>
            <LabCard href="#" icon={<Monitor className="h-10 w-10 text-primary/80" />} label="Prototype Lab" />
            <LabCard href="#" icon={<Smartphone className="h-10 w-10 text-primary/80" />} label="App Lab" />
            <LabCard href="#" icon={<Layers className="h-10 w-10 text-primary/80" />} label="Integration Lab" />
          </div>
        </div>
      </div>
    </main>
  );
}
