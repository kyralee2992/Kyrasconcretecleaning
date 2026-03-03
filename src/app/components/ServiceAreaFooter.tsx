import { MapPin } from 'lucide-react';

export function ServiceAreaFooter() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16" style={{ backgroundColor: '#0F172A' }}>
      <div className="max-w-7xl mx-auto text-center">
        <p
          className="text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase"
          style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
        >
          Serving Salem & Surrounding Areas
        </p>
      </div>
    </section>
  );
}