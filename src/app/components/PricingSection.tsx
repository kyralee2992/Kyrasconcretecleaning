import { Check, Info, Ruler, AlertTriangle, Droplets, MapPin } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export function PricingSection() {
  const pricingTiers: PricingTier[] = [
    {
      name: 'Soft Washing (Siding)',
      price: 'From $249',
      description: 'Safe "soft washing" for siding and exterior surfaces',
      features: [
        'Gentle low-pressure cleaning',
        'Safe for vinyl & painted surfaces',
        'Removes dirt, mold & mildew',
        'Protects your siding',
        'Eco-friendly solutions'
      ]
    },
    {
      name: 'Deep Cleaning (Concrete)',
      price: 'From $149',
      description: 'Professional deep cleaning for concrete surfaces',
      features: [
        'High-pressure washing',
        'Oil stain treatment',
        'Driveways & walkways',
        'Deep concrete cleaning',
        'Long-lasting results'
      ],
      popular: true,
      badge: 'Most Popular'
    }
  ];

  const pricingFactors = [
    {
      icon: Ruler,
      title: 'How much area needs cleaning',
      desc: 'A single car driveway and a 4-car concrete pad are two very different jobs. Square footage is the biggest driver of price.',
      color: '#0EA5E9'
    },
    {
      icon: AlertTriangle,
      title: 'How long the dirt has been sitting',
      desc: 'Light surface grime comes off fast. Years of embedded oil, tire marks, or algae take more time and product — and that\'s reflected in the price.',
      color: '#FACC15'
    },
    {
      icon: Droplets,
      title: 'What kind of staining is present',
      desc: 'Rust stains, oil spills, and organic growth each need different treatments. I\'ll tell you exactly what I\'m dealing with before I quote you anything.',
      color: '#22C55E'
    },
    {
      icon: MapPin,
      title: 'How easy it is to access',
      desc: 'Tight gates, steep slopes, or surfaces that need a lot of setup time can add a bit to the job. Nothing surprising — I\'ll point it out during the walkthrough.',
      color: '#0EA5E9'
    }
  ];

  return (
    <section id="pricing" className="px-6 md:px-12 lg:px-20 py-12 md:py-20" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p
            className="text-xs md:text-sm tracking-wide uppercase mb-2 md:mb-3"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
          >
            Transparent Pricing
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            SERVICE PRICING
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed mt-4 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
          >
            Starting prices for standard residential services. Final pricing based on specific conditions.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all relative ${
                tier.popular ? 'ring-4' : ''
              }`}
              style={{
                border: tier.popular ? '3px solid #0EA5E9' : '2px solid #E2E8F0',
                ringColor: tier.popular ? '#0EA5E9' : undefined
              }}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full"
                  style={{ backgroundColor: '#0EA5E9' }}
                >
                  <p
                    className="text-xs tracking-wide uppercase"
                    style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
                  >
                    {tier.badge}
                  </p>
                </div>
              )}

              {/* Service Name */}
              <h3
                className="text-2xl md:text-3xl tracking-wide uppercase mb-2"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
              >
                {tier.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <span
                  className="text-4xl md:text-5xl tracking-wide"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0EA5E9' }}
                >
                  {tier.price}
                </span>
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-6 pb-6 border-b-2"
                style={{ fontFamily: 'Inter, sans-serif', color: '#64748B', borderColor: '#E2E8F0' }}
              >
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-3">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: '#22C55E' }}
                      strokeWidth={2.5}
                    />
                    <span
                      className="text-sm leading-relaxed"
                      style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A' }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Grand Opening Special */}
        <div
          className="rounded-2xl p-8 md:p-12 mb-12 md:mb-16 text-center max-w-7xl mx-auto"
          style={{ backgroundColor: 'white', border: '4px solid #0EA5E9' }}
        >
          <p
            className="text-sm md:text-base tracking-wide uppercase mb-4"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0EA5E9' }}
          >
            GRAND OPENING SPECIAL:
          </p>
          <h3
            className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase mb-4"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            Book a House Wash, Get<br />50% Off Your Driveway
          </h3>
          <p
            className="text-base md:text-lg"
            style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
          >
            (Standard 2-Car Size)
          </p>
        </div>

        {/* Pricing Factors */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '2px solid #E2E8F0' }}
        >
          {/* Header bar */}
          <div
            className="px-8 md:px-10 py-6 flex items-center gap-4"
            style={{ backgroundColor: '#0F172A' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#FACC15' }}
            >
              <Info className="w-6 h-6" style={{ color: '#0F172A' }} strokeWidth={2.5} />
            </div>
            <div>
              <h3
                className="text-2xl md:text-3xl tracking-wide uppercase"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
              >
                WHAT AFFECTS YOUR PRICE?
              </h3>
              <p
                className="text-sm mt-1"
                style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
              >
                No mystery. Here's exactly how I think about it when I'm standing in your driveway.
              </p>
            </div>
          </div>

          {/* Factor cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 bg-white">
            {pricingFactors.map((factor, index) => {
              const Icon = factor.icon;
              const isBottomRow = index >= 2;
              const isRightCol = index % 2 === 1;
              return (
                <div
                  key={index}
                  className="p-6 md:p-8 flex items-start gap-4"
                  style={{
                    borderBottom: !isBottomRow ? '2px solid #F1F5F9' : undefined,
                    borderRight: !isRightCol ? '2px solid #F1F5F9' : undefined
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: factor.color === '#FACC15' ? '#FEF9C3' : factor.color === '#22C55E' ? '#DCFCE7' : '#E0F2FE' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: factor.color }} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <p
                      className="tracking-wide uppercase"
                      style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A', fontSize: '15px' }}
                    >
                      {factor.title}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
                    >
                      {factor.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom honest note */}
          <div
            className="px-8 md:px-10 py-5 flex items-center gap-3"
            style={{ backgroundColor: '#F8FAFC', borderTop: '2px solid #F1F5F9' }}
          >
            <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#22C55E' }} strokeWidth={3} />
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
            >
              <span style={{ color: '#0F172A', fontWeight: 600 }}>The walkthrough is free.</span>{' '}
              If the price doesn't work for you, no hard feelings — I'd rather you know up front than be surprised later.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}