import { MapPin } from 'lucide-react';

const cities = [
  'Salem', 'Keizer', 'Turner', 'Silverton', 'Stayton', 'Monmouth', 'Independence',
];

export function ServiceAreaFooter() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16" style={{ backgroundColor: '#0F172A' }}>
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: '#0EA5E9' }} strokeWidth={2.5} />
          <p
            className="text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
          >
            Serving Salem &amp; Surrounding Areas
          </p>
        </div>
        <p
          className="text-base md:text-lg"
          style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
        >
          {cities.join(' · ')}
        </p>
        <p
          className="text-sm mt-2"
          style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
        >
          Not sure if we cover your area? Call or text{' '}
          <span style={{ color: '#0EA5E9' }}>(971) 510-0926</span>.
        </p>
      </div>
    </section>
  );
}