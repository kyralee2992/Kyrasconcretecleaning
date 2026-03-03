'use client'
import { X, Phone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const handleNavClick = () => {
    onClose();
  };

  const handleHomeNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    // If we're not on the home page, navigate to home first
    if (pathname !== '/') {
      return; // Let the Link handle navigation
    }
    
    // If we're on the home page, smooth scroll
    e.preventDefault();
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
      style={{ backgroundColor: '#0F172A' }}
    >
      {/* Close Icon - Top Right */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center rounded-full transition-colors hover:bg-white hover:bg-opacity-10"
          aria-label="Close menu"
        >
          <X className="w-8 h-8 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Navigation Links - Center */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-8 py-20">
        {/* Home */}
        <Link
          href="/"
          onClick={handleNavClick}
          className="text-white transition-colors hover:text-opacity-70 focus:text-opacity-70 focus:outline-none focus:ring-2 rounded-sm px-2 py-1"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '32px',
            textAlign: 'center',
            '--tw-ring-color': '#0EA5E9'
          } as React.CSSProperties}
        >
          Home
        </Link>

        {/* Services */}
        <Link
          href="/#services"
          onClick={(e) => handleHomeNavClick(e, '#services')}
          className="text-white transition-colors hover:text-opacity-70 focus:text-opacity-70 focus:outline-none focus:ring-2 rounded-sm px-2 py-1"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '32px',
            textAlign: 'center',
            '--tw-ring-color': '#0EA5E9'
          } as React.CSSProperties}
        >
          Services
        </Link>

        {/* How It Works */}
        <Link
          href="/#how-we-quote"
          onClick={(e) => handleHomeNavClick(e, '#how-we-quote')}
          className="text-white transition-colors hover:text-opacity-70 focus:text-opacity-70 focus:outline-none focus:ring-2 rounded-sm px-2 py-1"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '32px',
            textAlign: 'center',
            '--tw-ring-color': '#0EA5E9'
          } as React.CSSProperties}
        >
          How It Works
        </Link>

        {/* Pricing */}
        <Link
          href="/#pricing"
          onClick={(e) => handleHomeNavClick(e, '#pricing')}
          className="text-white transition-colors hover:text-opacity-70 focus:text-opacity-70 focus:outline-none focus:ring-2 rounded-sm px-2 py-1"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '32px',
            textAlign: 'center',
            '--tw-ring-color': '#0EA5E9'
          } as React.CSSProperties}
        >
          Pricing
        </Link>

        {/* About Kyra */}
        <Link
          href="/#about"
          onClick={(e) => handleHomeNavClick(e, '#about')}
          className="text-white transition-colors hover:text-opacity-70 focus:text-opacity-70 focus:outline-none focus:ring-2 rounded-sm px-2 py-1"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '32px',
            textAlign: 'center',
            '--tw-ring-color': '#0EA5E9'
          } as React.CSSProperties}
        >
          About Kyra
        </Link>

        {/* FAQ */}
        <Link
          href="/#faq"
          onClick={(e) => handleHomeNavClick(e, '#faq')}
          className="text-white transition-colors hover:text-opacity-70 focus:text-opacity-70 focus:outline-none focus:ring-2 rounded-sm px-2 py-1"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '32px',
            textAlign: 'center',
            '--tw-ring-color': '#0EA5E9'
          } as React.CSSProperties}
        >
          FAQ
        </Link>
      </div>

      {/* CTA Button - Bottom */}
      <div className="p-6 pb-8">
        <a
          href="sms:+19715100926"
          className="w-full py-6 rounded-xl text-white transition-all hover:opacity-90 shadow-2xl flex items-center justify-center gap-3"
          style={{ 
            backgroundColor: '#22C55E',
            fontFamily: 'Oswald, sans-serif', 
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '20px'
          }}
        >
          <Phone className="w-6 h-6" strokeWidth={2.5} />
          TEXT US NOW
        </a>
      </div>
    </div>
  );
}