import { ArrowDown } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 sm:p-16 md:p-24 text-primary">
      <div /> {/* Spacer to push content to center */}
      
      <div className="flex flex-col items-center text-center space-y-10 motion-safe:animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          VM Digital Studio does that.
        </h1>

        <blockquote className="pt-8 max-w-3xl mx-auto">
          <p className="text-xl md:text-2xl italic text-primary/80">
            “Design is not just what it looks like and feels like. Design is how it works.”
          </p>
          <footer className="mt-6 text-lg text-primary/60">— Steve Jobs</footer>
        </blockquote>
      </div>

      <Link href="/labs" aria-label="Go to next page">
        <div className="motion-safe:animate-fade-in motion-safe:animate-bounce-slow" style={{ animationDelay: '1s' }}>
          <ArrowDown className="h-8 w-8 text-primary/50" />
        </div>
      </Link>
    </main>
  );
}
