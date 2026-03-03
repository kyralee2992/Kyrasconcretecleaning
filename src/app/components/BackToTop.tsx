'use client'
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl transition-all hover:opacity-90 hover:scale-110 flex items-center justify-center"
      style={{
        backgroundColor: '#0EA5E9',
        animation: 'fadeIn 0.3s ease-in-out'
      }}
      aria-label="Back to top"
    >
      <ArrowUp className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />
    </button>
  );
}
