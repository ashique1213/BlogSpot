import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                BlogSpot
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Your destination for compelling stories, insightful ideas, and diverse perspectives from writers all over the globe.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm tracking-wider uppercase text-foreground">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Trending</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Latest Stories</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Staff Picks</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm tracking-wider uppercase text-foreground">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Discord</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/40">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-4 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Help</Link>
            <Link to="/" className="hover:text-primary transition-colors">Status</Link>
            <Link to="/" className="hover:text-primary transition-colors">About</Link>
            <Link to="/" className="hover:text-primary transition-colors">Careers</Link>
            <Link to="/" className="hover:text-primary transition-colors">Blog</Link>
            <Link to="/" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/" className="hover:text-primary transition-colors">Text to speech</Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} BlogSpot. All rights reserved.</p>
            <p className="flex items-center mt-4 md:mt-0">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500 animate-pulse" /> by <a href="https://questacksolutions.vercel.app" target="_blank" rel="noreferrer" className="ml-1 font-medium hover:text-primary transition-colors hover:underline">BlogSpot Team</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
