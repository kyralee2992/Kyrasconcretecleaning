import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface BeforeAfterItem {
  id: number;
  service: string;
  beforeImage: string;
  afterImage: string;
  location: string;
  description: string;
}

function BeforeAfterCard({ item }: { item: BeforeAfterItem }) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div className="relative group">
      <div
        className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
        style={{ border: '3px solid #E2E8F0' }}
      >
        {/* Image Container */}
        <div className="relative h-[280px] md:h-[320px] overflow-hidden">
          {/* Before Image */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              showAfter ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <ImageWithFallback
              src={item.beforeImage}
              alt={`${item.service} - Before`}
              className="w-full h-full object-cover"
            />
            {/* Before Label */}
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
            >
              <p
                className="text-xs tracking-wide uppercase"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#EF4444' }}
              >
                Before
              </p>
            </div>
          </div>

          {/* After Image */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              showAfter ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={item.afterImage}
              alt={`${item.service} - After`}
              className="w-full h-full object-cover"
            />
            {/* After Label */}
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
            >
              <p
                className="text-xs tracking-wide uppercase"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#22C55E' }}
              >
                After
              </p>
            </div>
          </div>

          {/* Toggle Button Overlay */}
          <button
            onClick={() => setShowAfter(!showAfter)}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
              style={{ backgroundColor: '#0EA5E9' }}
            >
              {showAfter ? (
                <ArrowLeft className="w-8 h-8 text-white" strokeWidth={2.5} />
              ) : (
                <ArrowRight className="w-8 h-8 text-white" strokeWidth={2.5} />
              )}
            </div>
          </button>
        </div>

        {/* Info Section */}
        <div className="p-5 md:p-6 bg-white">
          <div
            className="inline-block px-3 py-1 rounded-full mb-3"
            style={{ backgroundColor: '#EFF6FF' }}
          >
            <p
              className="text-xs tracking-wide uppercase"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
            >
              {item.service}
            </p>
          </div>
          <h3
            className="text-xl md:text-2xl tracking-wide uppercase mb-2"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
          >
            {item.location}
          </h3>
          <p
            className="text-sm md:text-base leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
          >
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function GallerySection() {
  const projects: BeforeAfterItem[] = [
    {
      id: 1,
      service: 'Concrete Cleaning',
      beforeImage: 'https://images.unsplash.com/photo-1591188185682-41f5c74781f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jcmV0ZSUyMGRyaXZld2F5JTIwYmVmb3JlJTIwZGlydHl8ZW58MXx8fHwxNzcwODYzNzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      afterImage: 'https://images.unsplash.com/photo-1759355787121-eaef014a501d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jcmV0ZSUyMGRyaXZld2F5JTIwY2xlYW58ZW58MXx8fHwxNzcwODYwOTIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'West Salem, OR',
      description: 'Removed 5+ years of oil stains and heavy buildup. Looks like a brand new driveway.'
    },
    {
      id: 2,
      service: 'Concrete Cleaning',
      beforeImage: 'https://images.unsplash.com/photo-1633677095081-492aad9530d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXJ0eSUyMHBhdGlvJTIwY29uY3JldGUlMjBiZWZvcmV8ZW58MXx8fHwxNzcwODYzNzQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      afterImage: 'https://images.unsplash.com/photo-1767022062386-36d4af393776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXRpbyUyMHN0b25lJTIwY2xlYW5pbmd8ZW58MXx8fHwxNzcwODYwOTIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'Salem, OR',
      description: 'Deep cleaned patio surface. Ready for summer entertaining again!'
    },
    {
      id: 3,
      service: 'Soft Washing',
      beforeImage: 'https://images.unsplash.com/photo-1737409862885-2028e2b8bd6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3NzJTIwY292ZXJlZCUyMHdhbGt3YXklMjBiZWZvcmV8ZW58MXx8fHwxNzcwODYzNzQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      afterImage: 'https://images.unsplash.com/photo-1719282858444-090b2125a59f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3NzJTIwcmVtb3ZhbCUyMHN1cmZhY2V8ZW58MXx8fHwxNzcwODYwOTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'Salem, OR',
      description: 'Soft-washed siding and eaves. Moss and algae fully cleared with eco-friendly solution.'
    },
    {
      id: 4,
      service: 'Concrete Cleaning',
      beforeImage: 'https://images.unsplash.com/photo-1633677095081-492aad9530d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHNlYWxlZCUyMHdhbGt3YXklMjBjb25jcmV0ZXxlbnwxfHx8fDE3NzA4NjM3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      afterImage: 'https://images.unsplash.com/photo-1701553725685-1180aac986a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxrd2F5JTIwY29uY3JldGUlMjBwYXRofGVufDF8fHx8MTc3MDg2MDkyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'Salem, OR',
      description: 'Front walkway deep cleaned from corner to corner. Stubborn grime gone completely.'
    },
    {
      id: 5,
      service: 'Concrete Cleaning',
      beforeImage: 'https://images.unsplash.com/photo-1591188185682-41f5c74781f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jcmV0ZSUyMGRyaXZld2F5JTIwYmVmb3JlJTIwZGlydHl8ZW58MXx8fHwxNzcwODYzNzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      afterImage: 'https://images.unsplash.com/photo-1759355787121-eaef014a501d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jcmV0ZSUyMGRyaXZld2F5JTIwY2xlYW58ZW58MXx8fHwxNzcwODYwOTIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'Salem, OR',
      description: 'Complete driveway transformation from neglected to pristine. Customer was thrilled!'
    },
    {
      id: 6,
      service: 'Soft Washing',
      beforeImage: 'https://images.unsplash.com/photo-1633677095081-492aad9530d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXJ0eSUyMHBhdGlvJTIwY29uY3JldGUlMjBiZWZvcmV8ZW58MXx8fHwxNzcwODYzNzQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      afterImage: 'https://images.unsplash.com/photo-1767022062386-36d4af393776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXRpbyUyMHN0b25lJTIwY2xlYW5pbmd8ZW58MXx8fHwxNzcwODYwOTIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'Salem, OR',
      description: 'Backyard siding and surface cleaned after years of dirt and algae accumulation.'
    }
  ];

  return (
    <section id="gallery" className="px-6 md:px-12 lg:px-20 py-12 md:py-20" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <p
            className="text-xs md:text-sm tracking-wide uppercase mb-2 md:mb-3"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
          >
            See The Transformation
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            BEFORE & AFTER GALLERY
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed mt-4 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
          >
            Hover over images to see the dramatic results. Every project showcases our commitment 
            to quality and attention to detail.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => (
            <BeforeAfterCard key={project.id} item={project} />
          ))}
        </div>

        {/* CTA Banner */}
        <div
          className="mt-12 md:mt-16 rounded-2xl p-8 md:p-10 text-center"
          style={{ backgroundColor: '#0EA5E9' }}
        >
          <h3
            className="text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase mb-4"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
          >
            YOUR PROJECT COULD BE NEXT!
          </h3>
          <p
            className="text-base md:text-lg leading-relaxed mb-6"
            style={{ fontFamily: 'Inter, sans-serif', color: 'white' }}
          >
            Allow us to take before and after photos of your project and receive 20% off your service.
          </p>
          <button
            className="px-8 py-4 rounded-xl transition-all hover:opacity-90 shadow-lg"
            style={{
              backgroundColor: '#FACC15',
              color: '#0F172A',
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '16px'
            }}
          >
            Get Your Quote Now
          </button>
        </div>
      </div>
    </section>
  );
}