import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: '#0F172A' }}
    >
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="mb-8">
          <h1
            className="text-9xl md:text-[200px] tracking-wide uppercase leading-none"
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 700,
              color: '#0EA5E9',
              textShadow: '0 0 40px rgba(14, 165, 233, 0.3)'
            }}
          >
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-10 space-y-4">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
          >
            PAGE NOT FOUND
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
          >
            Looks like this page got pressure washed away! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="px-8 py-4 rounded-xl text-white transition-all hover:opacity-90 shadow-lg flex items-center justify-center gap-3"
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

          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 rounded-xl transition-all hover:bg-opacity-10 flex items-center justify-center gap-3"
            style={{
              backgroundColor: 'transparent',
              border: '2px solid white',
              color: 'white',
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '16px'
            }}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            Go Back
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t-2" style={{ borderColor: '#1E293B' }}>
          <p
            className="text-sm mb-4"
            style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
          >
            Need help? We're here for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="tel:9715100926"
              className="flex items-center gap-2 text-lg transition-colors hover:opacity-70"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
            >
              📞 (971) 510-0926
            </a>
            <a
              href="mailto:kyraleecleaning@gmail.com"
              className="text-lg hover:opacity-70 transition-opacity"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#0EA5E9' }}
            >
              ✉️ kyraleecleaning@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}