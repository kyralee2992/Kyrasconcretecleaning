'use client'
import { CheckCircle, Home, Phone, Mail, Clock } from 'lucide-react';
import { useEffect } from 'react';

export default function ThankYouPage() {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: '#0F172A' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#22C55E', boxShadow: '0 0 40px rgba(34, 197, 94, 0.3)' }}
          >
            <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-10 space-y-4">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
          >
            THANK YOU!
          </h1>
          <p
            className="text-xl md:text-2xl tracking-wide uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
          >
            Your Request Has Been Received
          </p>
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif', color: '#CBD5E1' }}
          >
            We've received your quote request and Kyra will review your information personally. 
            You'll hear back from us within 24 hours with your custom pricing estimate.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div
            className="bg-white rounded-xl p-6 text-center"
            style={{ border: '2px solid #E2E8F0' }}
          >
            <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: '#0EA5E9' }} strokeWidth={2} />
            <p
              className="text-sm tracking-wide uppercase mb-1"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
            >
              Response Time
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
            >
              Within 24 hours
            </p>
          </div>

          <div
            className="bg-white rounded-xl p-6 text-center"
            style={{ border: '2px solid #E2E8F0' }}
          >
            <Phone className="w-8 h-8 mx-auto mb-3" style={{ color: '#0EA5E9' }} strokeWidth={2} />
            <p
              className="text-sm tracking-wide uppercase mb-1"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
            >
              Need Urgent Service?
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
            >
              Call (971) 510-0926
            </p>
          </div>

          <div
            className="bg-white rounded-xl p-6 text-center"
            style={{ border: '2px solid #E2E8F0' }}
          >
            <Mail className="w-8 h-8 mx-auto mb-3" style={{ color: '#0EA5E9' }} strokeWidth={2} />
            <p
              className="text-sm tracking-wide uppercase mb-1"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
            >
              Check Your Email
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
            >
              Confirmation sent
            </p>
          </div>
        </div>

        {/* What Happens Next */}
        <div
          className="rounded-2xl p-8 mb-10"
          style={{ backgroundColor: '#1E293B', border: '2px solid #334155' }}
        >
          <h2
            className="text-2xl md:text-3xl tracking-wide uppercase mb-6 text-center"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
          >
            What Happens Next?
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#0EA5E9' }}
              >
                <span
                  className="text-sm"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
                >
                  1
                </span>
              </div>
              <div>
                <p
                  className="text-base leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif', color: '#E2E8F0' }}
                >
                  <strong style={{ color: 'white' }}>Review:</strong> Kyra reviews your request and property details
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#0EA5E9' }}
              >
                <span
                  className="text-sm"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
                >
                  2
                </span>
              </div>
              <div>
                <p
                  className="text-base leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif', color: '#E2E8F0' }}
                >
                  <strong style={{ color: 'white' }}>Quote:</strong> You receive a detailed price estimate via email or text
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#0EA5E9' }}
              >
                <span
                  className="text-sm"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
                >
                  3
                </span>
              </div>
              <div>
                <p
                  className="text-base leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif', color: '#E2E8F0' }}
                >
                  <strong style={{ color: 'white' }}>Schedule:</strong> If you approve, we'll book your service at a time that works for you
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white transition-all hover:opacity-90 shadow-lg"
            style={{
              backgroundColor: '#0EA5E9',
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '16px'
            }}
          >
            <Home className="w-5 h-5" strokeWidth={2.5} />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}