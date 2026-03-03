'use client'
import { Check, Zap, Shield, Mail, Phone, Globe, Clipboard, CalendarCheck } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { FAQSection } from '../components/FAQSection';
import { ContactForm } from '../components/ContactForm';
import { ServiceAreaFooter } from '../components/ServiceAreaFooter';
import { PricingSection } from '../components/PricingSection';
import { IPadQuoteSection } from '../components/IPadQuoteSection';
import { useRouter } from 'next/navigation';
import kyraPhoto from '@/assets/4738b3753998267d3f673fec1d4a80d90334099c.png';
import heroHome from '@/assets/acc92dd8ae68382b3c6e165680bd51456c7102cb.png';
import sidingPhoto from '@/assets/15f88640adfffac6f4c4c23cef1352847d79fa3e.png';
import concretePhoto from '@/assets/ea00718cedeea21fa429b442e35f79fd2abc1a33.png';

export default function HomePage() {
  const router = useRouter();

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowWeQuote = () => {
    const el = document.getElementById('how-we-quote');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    {
      slug: 'soft-washing-siding',
      title: 'Soft Washing (Siding)',
      subtext: 'Gentle low-pressure cleaning',
      price: 'From $249',
      description: 'Safe "soft washing" for siding and exterior surfaces. Gentle low-pressure cleaning that protects your home.',
      image: sidingPhoto.src
    },
    {
      slug: 'deep-cleaning-concrete',
      title: 'Deep Cleaning (Concrete)',
      subtext: 'High-pressure deep cleaning',
      price: 'From $149',
      description: 'Professional deep cleaning for concrete surfaces. Remove years of dirt, oil stains, and grime from driveways and walkways.',
      image: concretePhoto.src
    }
  ];

  const trustItems = [
    {
      icon: Zap,
      title: 'Fast Quotes',
      description: 'Get your free estimate within 24 hours'
    },
    {
      icon: Shield,
      title: 'Pet Safe',
      description: 'Eco-friendly cleaning safe for your family and pets'
    },
    {
      icon: Check,
      title: 'Satisfaction Guaranteed',
      description: '100% satisfaction or your money back'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="hero" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-6 md:px-12 lg:px-20 py-12 md:py-24 pt-24 md:pt-32" style={{ backgroundColor: '#F8FAFC' }}>
        {/* Left Column - Content */}
        <div className="flex flex-col justify-center">
          <div className="space-y-4 md:space-y-6">
            <p 
              className="text-xs md:text-sm tracking-wide uppercase"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
            >
              Salem, Oregon • Serving Salem & Surrounding Areas
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-7xl tracking-wide uppercase leading-tight"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
            >
              REVIVE YOUR DRIVEWAY
            </h1>
            <p
              className="text-sm md:text-base tracking-wide uppercase"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#64748B' }}
            >
              Professional Pressure Washing &amp; Concrete Cleaning in Salem, OR
            </p>
            <p
              className="text-base md:text-lg lg:text-xl leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
            >
              Professional pressure washing and concrete cleaning services. 
              Transform your outdoor surfaces with expert cleaning that delivers stunning, 
              long-lasting results.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-16" style={{ marginTop: '64px' }}>
            <button 
              onClick={scrollToContact}
              className="px-8 md:px-10 py-4 md:py-5 rounded-xl text-white transition-all hover:opacity-90 shadow-lg w-full sm:w-auto"
              style={{ 
                backgroundColor: '#0EA5E9', 
                fontFamily: 'Oswald, sans-serif', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '16px'
              }}
            >
              Book Free Walkthrough
            </button>
            <button 
              onClick={scrollToHowWeQuote}
              className="px-8 md:px-10 py-4 md:py-5 rounded-xl bg-transparent transition-all hover:bg-white w-full sm:w-auto"
              style={{ 
                border: '2px solid #0F172A',
                color: '#0F172A',
                fontFamily: 'Oswald, sans-serif', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '16px'
              }}
            >
              See How It Works
            </button>
          </div>
        </div>

        {/* Right Column - Hero Image */}
        <div className="flex items-center order-first md:order-last">
          <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src={heroHome.src}
              alt="Salem Oregon home with concrete driveway and siding — a perfect candidate for Kyra Lee's cleaning services"
              className="w-full h-full object-cover scale-[1.5] origin-top-left"
            />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="px-6 md:px-12 lg:px-20 py-10 md:py-16" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-start gap-4 md:gap-6">
                  <div 
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: index === 2 ? '#22C55E' : '#0EA5E9' }}
                  >
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <h3 
                      className="text-lg md:text-xl tracking-wide uppercase"
                      style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
                    >
                      {item.title}
                    </h3>
                    <p 
                      className="text-sm md:text-base leading-relaxed"
                      style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="px-6 md:px-12 lg:px-20 py-12 md:py-20" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <p 
              className="text-xs md:text-sm tracking-wide uppercase mb-2 md:mb-3"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
            >
              Professional Solutions
            </p>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
            >
              OUR SERVICES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => router.push(`/services/${service.slug}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                style={{ border: '2px solid #E2E8F0' }}
              >
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover scale-[1.5] origin-top-left group-hover:scale-[1.6] transition-transform duration-300"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div>
                    <h3
                      className="text-xl tracking-wide uppercase mb-1"
                      style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="text-xs tracking-wide uppercase"
                      style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#64748B' }}
                    >
                      {service.subtext}
                    </p>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
                  >
                    {service.description}
                  </p>
                  <div className="flex items-baseline gap-2 pt-2">
                    <span
                      className="text-2xl tracking-wide"
                      style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0EA5E9' }}
                    >
                      {service.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Mini Hero Section */}
      <section id="how-we-quote" className="px-6 md:px-12 lg:px-20 py-16 md:py-24" style={{ backgroundColor: '#0F172A' }}>
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <p
            className="text-xs md:text-sm tracking-wide uppercase mb-4"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
          >
            Simple & Transparent
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — Headline + 3 Steps */}
            <div>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase leading-tight mb-10"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
              >
                HOW IT <span style={{ color: '#FACC15' }}>WORKS</span>
              </h2>

              <div className="space-y-8">
                {[
                  {
                    number: '01',
                    title: 'Pick a Time',
                    desc: 'Fill out the form or give us a call. Takes two minutes — no commitment, no deposit required.'
                  },
                  {
                    number: '02',
                    title: 'We Come to You',
                    desc: 'Kyra shows up at your property on time, ready to walk every surface you want cleaned.'
                  },
                  {
                    number: '03',
                    title: 'Get Your Price',
                    desc: 'She maps the exact areas using our digital quoting tool and gives you a real number before leaving your driveway.'
                  }
                ].map((step) => (
                  <div key={step.number} className="flex items-start gap-5">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: '#1E293B', border: '2px solid #334155' }}
                    >
                      <span
                        className="tracking-wide"
                        style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#FACC15', fontSize: '14px' }}
                      >
                        {step.number}
                      </span>
                    </div>
                    <div>
                      <p
                        className="tracking-wide uppercase mb-1"
                        style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white', fontSize: '18px' }}
                      >
                        {step.title}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — CTA Card */}
            <div
              className="rounded-2xl p-8 md:p-10 flex flex-col items-center text-center space-y-6"
              style={{
                backgroundColor: 'white',
                boxShadow: '0 0 60px rgba(14, 165, 233, 0.2)'
              }}
            >
              {/* Icon */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#0EA5E9' }}
              >
                <CalendarCheck className="w-10 h-10 text-white" strokeWidth={2} />
              </div>

              {/* Headline */}
              <div>
                <h3
                  className="text-3xl md:text-4xl tracking-wide uppercase leading-tight"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
                >
                  Book a Free<br />Walkthrough
                </h3>
                <p
                  className="text-sm mt-2"
                  style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
                >
                  We come to you. Real price before we leave.
                </p>
              </div>

              {/* Bullets */}
              <ul className="w-full text-left space-y-3">
                {[
                  'Free — no commitment, no deposit',
                  'Real price before we leave',
                  '15–20 minute walkthrough',
                  'Kyra answers all your questions on the spot'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#22C55E' }} strokeWidth={3} />
                    <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A' }}>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Primary CTA */}
              <button
                onClick={scrollToContact}
                className="px-8 py-4 rounded-xl text-white transition-all hover:opacity-90 shadow-lg w-full"
                style={{
                  backgroundColor: '#0EA5E9',
                  fontFamily: 'Oswald, sans-serif',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '16px'
                }}
              >
                Book My Free Walkthrough
              </button>

              {/* Or call */}
              <p
                className="text-sm"
                style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
              >
                Or call/text us at{' '}
                <a
                  href="tel:+19715100926"
                  style={{ color: '#0EA5E9', fontWeight: 600 }}
                >
                  (971) 510-0926
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* About Owner Section */}
      <section id="about" className="px-6 md:px-12 lg:px-20 py-12 md:py-20" style={{ backgroundColor: '#0F172A' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center pl-6 md:pl-10 lg:pl-15" style={{ borderLeft: '4px solid #FACC15' }}>
          {/* Left - Photo */}
          <div className="flex justify-center">
            <div className="w-full max-w-[400px] h-[350px] md:h-[400px] lg:h-[470px] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={kyraPhoto.src}
                alt="Kyra Lee, Owner"
                className="w-full h-full object-cover scale-[1.5] origin-top-left"
              />
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              <p 
                className="text-xs md:text-sm tracking-wide uppercase"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
              >
                Meet The Owner
              </p>
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase leading-tight"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
              >
                HI, I'M KYRA.<br />OWNER-OPERATED.
              </h2>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <p 
                className="text-base md:text-lg leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif', color: '#FFFFFF' }}
              >
                I started Kyra Lee's Concrete Cleaning because I wanted to do honest work and do it well. No crews, no subcontractors — when you book with me, I'm the one who shows up.
              </p>
              <p 
                className="text-base md:text-lg leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif', color: '#FFFFFF' }}
              >
                I keep things simple: I come out, walk the property with you, and give you a straight price before I leave your driveway. No pressure, no surprises.
              </p>
            </div>

            <div className="flex items-center gap-3 md:gap-4 pt-3 md:pt-4">
              <div 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#22C55E' }}
              >
                <Check className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={3} />
              </div>
              <p 
                className="text-lg md:text-xl tracking-wide uppercase"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: 'white' }}
              >
                Licensed & Insured
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Contact Form Section */}
      <ContactForm />

      {/* Service Area Footer */}
      <ServiceAreaFooter />

      {/* Footer */}
      <footer className="px-6 md:px-12 lg:px-20 py-8 md:py-12 pb-24 md:pb-12" style={{ backgroundColor: '#0A0F1A' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
          <div className="space-y-2 md:space-y-3">
            <h3 
              className="text-xl md:text-2xl lg:text-3xl tracking-wide uppercase"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
            >
              KYRA LEE'S CONCRETE CLEANING
            </h3>
            <p 
              className="text-xs md:text-sm leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
            >
              © 2026 Kyra Lee's Concrete Cleaning. All rights reserved.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="/privacy-policy"
                className="text-xs md:text-sm hover:opacity-70 transition-opacity underline"
                style={{ fontFamily: 'Inter, sans-serif', color: '#0EA5E9' }}
              >
                Privacy Policy
              </a>
              <a
                href="/terms-of-service"
                className="text-xs md:text-sm hover:opacity-70 transition-opacity underline"
                style={{ fontFamily: 'Inter, sans-serif', color: '#0EA5E9' }}
              >
                Terms of Service
              </a>
            </div>
          </div>

          <div className="text-left md:text-right space-y-2 md:space-y-3">
            <div className="flex items-center justify-start md:justify-end gap-2 md:gap-3">
              <Phone className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#0EA5E9' }} />
              <p 
                className="text-lg tracking-wide uppercase"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: 'white' }}
              >
                TEXT US: (971) 510-0926
              </p>
            </div>
            <div className="flex items-center justify-start md:justify-end gap-2 md:gap-3">
              <Mail className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#0EA5E9' }} />
              <p 
                className="text-sm md:text-base"
                style={{ fontFamily: 'Inter, sans-serif', color: '#CBD5E1' }}
              >
                kyraleecleaning@gmail.com
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}