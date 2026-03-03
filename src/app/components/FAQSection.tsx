import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div
      className="border-b-2 py-6"
      style={{ borderColor: '#E2E8F0' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 text-left group"
      >
        <h3
          className="text-xl md:text-2xl tracking-wide uppercase flex-1 group-hover:text-opacity-70 transition-colors"
          style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
        >
          {question}
        </h3>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ backgroundColor: isOpen ? '#0EA5E9' : '#E2E8F0' }}
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5" style={{ color: 'white' }} strokeWidth={2.5} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: '#64748B' }} strokeWidth={2.5} />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pl-0 md:pr-12">
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What areas do you serve?',
      answer: 'We proudly serve Salem, Oregon. Not sure if we cover your neighborhood? Give us a call or send us a text at (971) 510-0926 and we\'ll let you know!'
    },
    {
      question: 'How long does a typical job take?',
      answer: 'Most residential driveways take 2-4 hours depending on size and condition. Patios and walkways typically take 1-3 hours. We\'ll provide an accurate time estimate when we give you your quote. We work efficiently without sacrificing quality.'
    },
    {
      question: 'Are your cleaning products safe for pets and plants?',
      answer: 'Absolutely! We use eco-friendly, biodegradable cleaning solutions that are completely safe for your family, pets, and landscaping. Our products are tough on dirt and grime but gentle on the environment.'
    },
    {
      question: 'Do I need to be home during the service?',
      answer: 'No, you don\'t need to be home. As long as we have access to water and the areas to be cleaned, we can complete the work while you\'re away. Many customers prefer this option for convenience.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept cash, check, Venmo, PayPal, and all major credit cards. Payment is due upon completion of the service. We\'ll send you an invoice via email for your records.'
    },
    {
      question: 'What is your satisfaction guarantee?',
      answer: 'We offer a 100% satisfaction guarantee. If you\'re not completely happy with our work, we\'ll come back and make it right at no additional charge. Your satisfaction is our top priority.'
    },
    {
      question: 'How often should I have my concrete cleaned?',
      answer: 'We recommend professional cleaning every 12-18 months for most residential properties. However, high-traffic areas or surfaces prone to moss and algae may benefit from cleaning every 6-12 months. We\'ll provide personalized recommendations based on your property.'
    },
    {
      question: 'Can you remove oil stains?',
      answer: 'Yes! Oil stain removal is one of our specialties. We use professional-grade degreasers and hot water pressure washing to break down and remove stubborn oil stains. While some very old or deep stains may leave slight shadows, we achieve excellent results in most cases.'
    }
  ];

  return (
    <section id="faq" className="px-6 md:px-12 lg:px-20 py-12 md:py-20" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <p
            className="text-xs md:text-sm tracking-wide uppercase mb-2 md:mb-3"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
          >
            Your Questions Answered
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}