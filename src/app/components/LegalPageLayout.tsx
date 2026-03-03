'use client'
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface LegalSection {
  heading: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export function LegalPageLayout({ title, subtitle, lastUpdated, sections }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>

      {/* Dark Hero Header */}
      <header style={{ backgroundColor: '#0F172A' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-8 pb-12 md:pb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 transition-opacity hover:opacity-70"
            style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8', fontSize: '14px', fontWeight: 500 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1
            className="tracking-wide uppercase mb-4"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 'clamp(36px, 5vw, 56px)', color: 'white' }}
          >
            {title}
          </h1>

          <p
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: '1.6', color: '#94A3B8', maxWidth: '560px' }}
          >
            {subtitle}
          </p>

          <div
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full"
            style={{ backgroundColor: '#1E293B' }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#94A3B8' }}>
              Last updated: {lastUpdated}
            </span>
          </div>
        </div>
      </header>

      {/* Blue accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: '#0EA5E9' }} />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="max-w-3xl space-y-0">
          {sections.map((section, index) => (
            <div
              key={index}
              className="py-8 md:py-10"
              style={{ borderBottom: index < sections.length - 1 ? '1px solid #E2E8F0' : undefined }}
            >
              {/* Section number + heading */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: '#0F172A' }}
                >
                  <span
                    style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: '13px', color: '#0EA5E9' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2
                  className="tracking-wide uppercase"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: '22px', color: '#0F172A' }}
                >
                  {section.heading}
                </h2>
              </div>

              {/* Content indented to align with heading */}
              <div
                className="pl-12"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: '1.75', color: '#475569' }}
              >
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F172A', borderTop: '1px solid #1E293B' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#64748B' }}>
            © 2026 Kyra Lee's Concrete Cleaning · Salem, Oregon
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94A3B8' }}
              className="hover:opacity-70 transition-opacity"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94A3B8' }}
              className="hover:opacity-70 transition-opacity"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}