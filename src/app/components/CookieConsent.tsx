'use client'
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      // Show banner after 1 second
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 shadow-2xl animate-slide-up"
      style={{ backgroundColor: '#0F172A' }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {/* Message */}
          <div className="flex-1">
            <h3 
              className="mb-2"
              style={{
                fontFamily: 'Oswald, sans-serif',
                fontWeight: 700,
                fontSize: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#FFFFFF'
              }}
            >
              We Value Your Privacy
            </h3>
            <p 
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#CBD5E1'
              }}
            >
              We use cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept", you consent to our use of cookies. Learn more in our{' '}
              <a 
                href="/privacy-policy" 
                className="underline hover:opacity-70 transition-opacity"
                style={{ color: '#0EA5E9' }}
              >
                Privacy Policy
              </a>.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 md:flex-none px-6 py-3 rounded-lg transition-all hover:opacity-70"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#94A3B8',
                border: '2px solid #334155'
              }}
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-none px-6 py-3 rounded-lg transition-all hover:opacity-90 shadow-lg"
              style={{
                backgroundColor: '#0EA5E9',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#FFFFFF'
              }}
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" style={{ color: '#94A3B8' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
