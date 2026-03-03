import { CalendarDays, MapPin, PenLine, DollarSign, Tablet } from 'lucide-react';

interface StepProps {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
  isLast?: boolean;
}

function Step({ number, icon: Icon, title, description, isLast }: StepProps) {
  return (
    <div className="flex gap-5 md:gap-8 relative">
      {/* Connector line */}
      {!isLast && (
        <div
          className="absolute left-[27px] md:left-[31px] top-[56px] bottom-[-24px] w-[2px] md:w-[3px]"
          style={{ backgroundColor: 'rgba(250, 204, 21, 0.25)' }}
        />
      )}
      {/* Step circle */}
      <div className="flex-shrink-0 relative z-10">
        <div
          className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: '#FACC15' }}
        >
          <Icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: '#0F172A' }} strokeWidth={2} />
        </div>
      </div>
      {/* Content */}
      <div className="pb-10 md:pb-12 flex-1 pt-1">
        <p
          className="text-xs tracking-widest uppercase mb-1"
          style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#FACC15' }}
        >
          Step {number}
        </p>
        <h3
          className="text-2xl md:text-3xl tracking-wide uppercase mb-2 leading-tight"
          style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
        >
          {title}
        </h3>
        <p
          className="text-base md:text-lg leading-relaxed"
          style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export function IPadQuoteSection() {
  const steps = [
    {
      number: '01',
      icon: CalendarDays,
      title: 'Book Your Free Walkthrough',
      description: 'Takes 2 minutes. No commitment, no deposit. Pick a time that works for you and we\'ll show up ready to give you a real number.'
    },
    {
      number: '02',
      icon: MapPin,
      title: 'We Arrive At Your Door',
      description: 'Kyra shows up on time with our digital quoting tool loaded and ready. No clipboard, no guessing — just a fast, professional walkthrough.'
    },
    {
      number: '03',
      icon: PenLine,
      title: 'You Point, We Map It Out',
      description: 'Walk Kyra around your property and point out the areas you want cleaned. She traces the exact boundaries on-screen — your driveway, your rules.'
    },
    {
      number: '04',
      icon: DollarSign,
      title: 'Instant Price. Right There.',
      description: 'The moment the last boundary is drawn, your quote calculates on the spot. No waiting, no email, no back-and-forth. You get a real price before we leave your driveway.',
      isLast: true
    }
  ];

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="px-6 md:px-12 lg:px-20 py-16 md:py-24"
      style={{ backgroundColor: '#0F172A' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — Headline + CTA */}
          <div className="lg:sticky lg:top-28">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(250, 204, 21, 0.15)', border: '1px solid rgba(250, 204, 21, 0.3)' }}
              >
                <Tablet className="w-5 h-5" style={{ color: '#FACC15' }} strokeWidth={2} />
              </div>
              <p
                className="text-xs md:text-sm tracking-widest uppercase"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#FACC15' }}
              >
                Our Quote Process
              </p>
            </div>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase leading-tight mb-6"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
            >
              INSTANT PRICE.<br />
              <span style={{ color: '#FACC15' }}>ON YOUR</span><br />
              DRIVEWAY.
            </h2>

            <p
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
            >
              We come to you. Kyra walks your property with our digital quoting tool, 
              maps out the exact areas you want cleaned, and you get a real price 
              before she leaves. Zero guesswork. Zero waiting.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {['No Obligation', 'Free Visit', 'Same-Day Price', 'Salem, OR'].map((badge) => (
                <div
                  key={badge}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)' }}
                >
                  <p
                    className="text-xs tracking-wide uppercase"
                    style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
                  >
                    {badge}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={scrollToContact}
              className="px-8 py-5 rounded-xl text-white transition-all hover:opacity-90 shadow-2xl w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                fontFamily: 'Oswald, sans-serif',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '16px',
                boxShadow: '0 0 40px rgba(14, 165, 233, 0.35)'
              }}
            >
              Book My Free Walkthrough
            </button>

            {/* Small reassurance text */}
            <p
              className="text-sm mt-4"
              style={{ fontFamily: 'Inter, sans-serif', color: '#475569' }}
            >
              Typical visit: 15–20 min &nbsp;·&nbsp; No payment required &nbsp;·&nbsp; Zero pressure
            </p>
          </div>

          {/* Right — Steps */}
          <div className="pt-2">
            {steps.map((step, i) => (
              <Step
                key={step.number}
                {...step}
                isLast={i === steps.length - 1}
              />
            ))}

            {/* Quote Tool Card */}
            <div
              className="rounded-2xl p-6 md:p-8 mt-4"
              style={{
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(250, 204, 21, 0.06) 100%)',
                border: '1px solid rgba(250, 204, 21, 0.2)'
              }}
            >
              {/* Mock iPad screen */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-16 h-20 rounded-lg flex flex-col items-center justify-center shadow-lg"
                  style={{ backgroundColor: '#1E293B', border: '2px solid #334155' }}
                >
                  <Tablet className="w-8 h-8 mb-1" style={{ color: '#0EA5E9' }} strokeWidth={1.5} />
                  <div
                    className="w-4 h-0.5 rounded-full"
                    style={{ backgroundColor: '#FACC15' }}
                  />
                </div>
                <div>
                  <p
                    className="text-lg md:text-xl tracking-wide uppercase mb-1 leading-tight"
                    style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
                  >
                    POWERED BY OUR QUOTE TOOL
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
                  >
                    Kyra maps property boundaries digitally on-site. Square footage is calculated automatically, pricing is applied instantly. The whole quote takes minutes — while you watch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}