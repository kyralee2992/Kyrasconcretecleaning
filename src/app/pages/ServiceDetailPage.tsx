'use client'
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, Phone, Mail } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useEffect } from 'react';
import sidingPhoto from '@/assets/15f88640adfffac6f4c4c23cef1352847d79fa3e.png';
import concretePhoto from '@/assets/ea00718cedeea21fa429b442e35f79fd2abc1a33.png';

interface ServiceDetail {
  slug: string;
  title: string;
  price: string;
  tagline: string;
  description: string;
  fullDescription: string;
  image: string;
  features: string[];
  process: string[];
  benefits: string[];
}

const servicesData: ServiceDetail[] = [
  {
    slug: 'soft-washing-siding',
    title: 'Soft Washing (Siding)',
    price: 'From $249',
    tagline: 'Gentle low-pressure cleaning',
    description: 'Safe "soft washing" for siding and exterior surfaces. Gentle low-pressure cleaning that protects your home.',
    fullDescription: 'Our professional soft washing service uses gentle, low-pressure techniques specifically designed for delicate siding materials. We remove dirt, mildew, and organic growth without the risk of damage from high-pressure washing. Safe for vinyl, wood, and all exterior surfaces while delivering stunning results.',
    image: sidingPhoto.src,
    features: [
      'Low-pressure washing safe for all siding types',
      'Removes dirt, mildew, and organic stains',
      'Eco-friendly cleaning solutions',
      'Safe for vinyl, wood, and composite materials',
      'Won\'t damage paint or surface finishes',
      'Protects your home\'s exterior investment'
    ],
    process: [
      'Inspection of siding type and condition',
      'Pre-treatment of stained or moldy areas',
      'Low-pressure application of cleaning solution',
      'Gentle rinsing with controlled water pressure',
      'Final inspection and touch-ups',
      'Cleanup of work area'
    ],
    benefits: [
      'Restore your home\'s curb appeal',
      'Remove harmful mold and mildew',
      'Protect siding from long-term damage',
      'Increase property value',
      'Safe alternative to high-pressure washing',
      'Extend the life of your siding'
    ]
  },
  {
    slug: 'deep-cleaning-concrete',
    title: 'Deep Cleaning (Concrete)',
    price: 'From $149',
    tagline: 'High-pressure deep cleaning',
    description: 'Professional deep cleaning for concrete surfaces. Remove years of dirt, oil stains, and grime from driveways and walkways.',
    fullDescription: 'Our professional concrete deep cleaning service uses high-pressure washing equipment to blast away years of accumulated dirt, oil stains, and grime. We specialize in driveways, walkways, patios, and other concrete surfaces, delivering dramatic before-and-after results that restore your concrete to like-new condition.',
    image: concretePhoto.src,
    features: [
      'Professional high-pressure washing equipment',
      'Oil stain treatment and removal',
      'Deep cleaning removes embedded dirt',
      'Safe for all concrete surfaces',
      'Eco-friendly cleaning products',
      'Removes years of buildup quickly'
    ],
    process: [
      'Pre-treatment of oil stains and heavy soiling',
      'High-pressure washing at optimal PSI',
      'Targeted treatment of stubborn stains',
      'Complete surface rinsing',
      'Debris removal and cleanup',
      'Final inspection of results'
    ],
    benefits: [
      'Dramatically improve curb appeal',
      'Remove dangerous oil slicks',
      'Clean years of dirt in hours',
      'Make concrete look like new',
      'Increase property value',
      'Create safer walking surfaces'
    ]
  }
];

export default function ServiceDetailPage() {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const router = useRouter();

  const service = servicesData.find(s => s.slug === serviceSlug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceSlug]);

  if (!service) {
    router.push('/404');
    return null;
  }

  const scrollToContact = () => {
    router.push('/#contact');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header Navigation */}
      <nav
        className="sticky top-0 z-50 px-6 md:px-12 lg:px-20 py-6"
        style={{ backgroundColor: '#0F172A', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 text-white hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            <span
              className="text-sm tracking-wide uppercase hidden sm:inline"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600 }}
            >
              Back to Home
            </span>
          </button>
          <a
            href="tel:+19715100926"
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:opacity-90"
            style={{ backgroundColor: '#0EA5E9' }}
          >
            <Phone className="w-4 h-4 text-white" strokeWidth={2.5} />
            <span
              className="text-sm tracking-wide uppercase text-white"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600 }}
            >
              Call Now
            </span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <div>
                <p
                  className="text-sm tracking-wide uppercase mb-3"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
                >
                  Professional Service
                </p>
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase leading-tight mb-4"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
                >
                  {service.title}
                </h1>
                <p
                  className="text-xl md:text-2xl tracking-wide uppercase"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#64748B' }}
                >
                  {service.tagline}
                </p>
              </div>

              <div
                className="inline-block px-6 py-3 rounded-xl"
                style={{ backgroundColor: '#0EA5E9' }}
              >
                <p
                  className="text-3xl md:text-4xl tracking-wide text-white"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}
                >
                  {service.price}
                  <span
                    className="text-lg ml-2"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                  >
                    starting
                  </span>
                </p>
              </div>

              <p
                className="text-lg leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
              >
                {service.fullDescription}
              </p>

              <button
                onClick={scrollToContact}
                className="px-8 py-4 rounded-xl text-white transition-all hover:opacity-90 shadow-lg"
                style={{
                  backgroundColor: '#0EA5E9',
                  fontFamily: 'Oswald, sans-serif',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '16px'
                }}
              >
                Get Free Quote
              </button>
            </div>

            {/* Right - Image */}
            <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover scale-[1.5] origin-top-left"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl md:text-4xl tracking-wide uppercase mb-8 text-center"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            What's Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check
                  className="w-6 h-6 flex-shrink-0 mt-0.5"
                  style={{ color: '#22C55E' }}
                  strokeWidth={2.5}
                />
                <p
                  className="text-base leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A' }}
                >
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl md:text-4xl tracking-wide uppercase mb-8 text-center"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            Our Process
          </h2>
          <div className="space-y-6">
            {service.process.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#0EA5E9' }}
                >
                  <span
                    className="text-xl text-white"
                    style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 pt-2">
                  <p
                    className="text-lg leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A' }}
                  >
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16" style={{ backgroundColor: '#0F172A' }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl md:text-4xl tracking-wide uppercase mb-8 text-center"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
          >
            Why Choose This Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6"
                style={{ border: '2px solid #E2E8F0' }}
              >
                <div className="flex items-start gap-3">
                  <Check
                    className="w-6 h-6 flex-shrink-0 mt-0.5"
                    style={{ color: '#22C55E' }}
                    strokeWidth={2.5}
                  />
                  <p
                    className="text-base leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A' }}
                  >
                    {benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-20" style={{ backgroundColor: '#0EA5E9' }}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase text-white"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}
          >
            READY TO GET STARTED?
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed text-white"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Get your free quote today and see the difference professional service makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToContact}
              className="px-8 py-4 rounded-xl transition-all hover:bg-opacity-90 shadow-lg"
              style={{
                backgroundColor: 'white',
                color: '#0F172A',
                fontFamily: 'Oswald, sans-serif',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '16px'
              }}
            >
              Request Free Quote
            </button>
            <a
              href="tel:+19715100926"
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl transition-all hover:bg-opacity-90 shadow-lg"
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
              <Phone className="w-5 h-5" strokeWidth={2.5} />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}