'use client'
import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import Link from 'next/link';

interface DesktopNavProps {
  onGetQuoteClick?: () => void;
}

export function DesktopNav({ onGetQuoteClick }: DesktopNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/#services' },
    { label: 'How It Works', href: '/#how-we-quote' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'About Kyra', href: '/#about' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Articles', href: '/articles' }
  ];

  return (
    <nav
      className={`flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-6 md:px-8 lg:px-20 transition-all duration-300 ${
        isScrolled ? 'py-3 md:py-4 shadow-2xl' : 'py-4 md:py-6'
      }`}
      style={{
        backgroundColor: isScrolled ? '#0F172A' : 'rgba(15, 23, 42, 0.95)',
      }}
    >
      {/* Logo/Brand */}
      <div className="flex items-center">
        <Link href="/" className="flex flex-col">
          <h1
            className="text-lg md:text-xl lg:text-2xl tracking-wide uppercase leading-tight"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
          >
            KYRA LEE'S
          </h1>
          <p
            className="text-xs tracking-wider uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 400, color: '#0EA5E9' }}
          >
            Concrete Cleaning
          </p>
        </Link>
      </div>

      {/* Navigation Links - Desktop Only */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link, index) => (
          link.href.startsWith('/') && !link.href.startsWith('/#') ? (
            <Link
              key={index}
              href={link.href}
              className="text-white hover:text-opacity-70 focus:text-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm px-1 transition-all"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                '--tw-ring-color': '#0EA5E9'
              } as React.CSSProperties}
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={index}
              href={link.href}
              className="text-white hover:text-opacity-70 focus:text-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm px-1 transition-all"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                '--tw-ring-color': '#0EA5E9'
              } as React.CSSProperties}
            >
              {link.label}
            </a>
          )
        ))}
      </div>

      {/* CTA Button - Desktop Only */}
      <button
        onClick={onGetQuoteClick}
        className="hidden md:flex px-4 md:px-6 py-2 md:py-3 rounded-lg text-white transition-all hover:opacity-90 shadow-lg items-center gap-2"
        style={{
          backgroundColor: '#0EA5E9',
          fontFamily: 'Oswald, sans-serif',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: '13px'
        }}
      >
        <Phone className="w-4 h-4" strokeWidth={2.5} />
        <span className="hidden sm:inline">Get Free Quote</span>
        <span className="sm:hidden">Quote</span>
      </button>
    </nav>
  );
}
