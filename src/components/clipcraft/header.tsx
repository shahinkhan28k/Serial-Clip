import { Logo } from '@/components/icons';

export function Header() {
  return (
    <header className="w-full border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="ml-3 text-2xl font-semibold text-foreground/90 font-headline">
            ClipCraft AI
          </h1>
        </div>
      </div>
    </header>
  );
}
