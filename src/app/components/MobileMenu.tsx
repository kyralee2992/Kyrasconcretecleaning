import { X, Phone, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useState } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();
  const [servicesExpanded, setServicesExpanded] = useState(false);

  if (!isOpen) return null;

  const services = [
    { name: 'Soft Washing (Siding)', slug: 'soft-washing-siding' },
    { name: 'Deep Cleaning (Concrete)', slug: 'deep-cleaning-concrete' }
  ];

  const handleNavClick = () => {
    onClose();
  };

  const handleHomeNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
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
          to="/"
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

        {/* Services with Submenu */}
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
          <button
            onClick={() => setServicesExpanded(!servicesExpanded)}
            className="text-white transition-colors hover:text-opacity-70 focus:text-opacity-70 focus:outline-none focus:ring-2 rounded-sm px-2 py-1 flex items-center gap-2"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '32px',
              textAlign: 'center',
              '--tw-ring-color': '#0EA5E9'
            } as React.CSSProperties}
          >
            Services
            <ChevronDown 
              className={`w-6 h-6 transition-transform ${servicesExpanded ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {servicesExpanded && (
            <div className="flex flex-col items-center space-y-3 w-full">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  onClick={handleNavClick}
                  className="text-white transition-colors hover:text-opacity-70 focus:text-opacity-70 focus:outline-none focus:ring-2 rounded-sm px-2 py-1"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '20px',
                    textAlign: 'center',
                    color: '#0EA5E9',
                    '--tw-ring-color': '#0EA5E9'
                  } as React.CSSProperties}
                >
                  {service.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* How It Works */}
        <Link
          to="/#how-we-quote"
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
          to="/#pricing"
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
          to="/#about"
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
          to="/#faq"
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