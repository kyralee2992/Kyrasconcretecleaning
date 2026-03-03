import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
}

function TestimonialCard({ name, location, rating, text, service }: TestimonialCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-shadow"
      style={{ border: '2px solid #E2E8F0' }}
    >
      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className="w-5 h-5"
            fill={index < rating ? '#FACC15' : 'none'}
            style={{ color: index < rating ? '#FACC15' : '#CBD5E1' }}
            strokeWidth={2}
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <p
        className="text-base md:text-lg leading-relaxed mb-6"
        style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A' }}
      >
        "{text}"
      </p>

      {/* Service Badge */}
      <div
        className="inline-block px-3 py-1 rounded-full mb-4"
        style={{ backgroundColor: '#EFF6FF' }}
      >
        <p
          className="text-xs tracking-wide uppercase"
          style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
        >
          {service}
        </p>
      </div>

      {/* Customer Info */}
      <div className="border-t-2 pt-4" style={{ borderColor: '#E2E8F0' }}>
        <p
          className="text-lg tracking-wide uppercase"
          style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
        >
          {name}
        </p>
        <p
          className="text-sm"
          style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
        >
          {location}
        </p>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Michael Torres',
      location: 'Salem, OR',
      rating: 5,
      service: 'Deep Cleaning (Concrete)',
      text: 'Kyra transformed our oil-stained driveway into something that looks brand new! The difference is absolutely night and day. She was professional, on time, and the price was very fair. Highly recommend!'
    },
    {
      name: 'Jennifer Wu',
      location: 'Salem, OR',
      rating: 5,
      service: 'Deep Cleaning (Concrete)',
      text: 'We hadn\'t cleaned our patio in years and it was covered in dirt and grime. Kyra made it look incredible in just a few hours. Her attention to detail is impressive. We\'ll definitely be using her services again!'
    },
    {
      name: 'David Harrison',
      location: 'Salem, OR',
      rating: 5,
      service: 'Soft Washing (Siding)',
      text: 'After multiple rainy seasons, our siding was covered in algae and grime. Kyra\'s soft wash approach got everything off without damaging the paint. Great communication throughout the whole process!'
    },
    {
      name: 'Sarah Mitchell',
      location: 'Salem, OR',
      rating: 5,
      service: 'Deep Cleaning (Concrete)',
      text: 'Kyra deep cleaned our front walkway and it looks amazing. She explained the entire process, was incredibly thorough, and left everything spotless. The quality of her work is outstanding. Worth every penny!'
    },
    {
      name: 'Robert Chen',
      location: 'Salem, OR',
      rating: 5,
      service: 'Deep Cleaning (Concrete)',
      text: 'We hired Kyra for our driveway and patio. She did such an incredible job that we had her come back for our walkways too. Friendly, professional, and delivers exactly what she promises. A true professional!'
    },
    {
      name: 'Amanda Rodriguez',
      location: 'Salem, OR',
      rating: 5,
      service: 'Soft Washing (Siding)',
      text: 'Kyra came out to our house, walked the whole property with us, and had our price ready before she left. The whole process was so easy — and the results were incredible. My siding looks brand new!'
    }
  ];

  return (
    <section id="testimonials" className="px-6 md:px-12 lg:px-20 py-12 md:py-20" style={{ backgroundColor: 'white' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <p
            className="text-xs md:text-sm tracking-wide uppercase mb-2 md:mb-3"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
          >
            What Our Customers Say
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            REAL REVIEWS, REAL RESULTS
          </h2>
        </div>

        {/* Google Reviews Badge */}
        <div className="flex justify-center mb-12">
          <div
            className="flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg"
            style={{ backgroundColor: '#F8FAFC', border: '2px solid #E2E8F0' }}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="w-6 h-6"
                  fill="#FACC15"
                  style={{ color: '#FACC15' }}
                  strokeWidth={2}
                />
              ))}
            </div>
            <div className="border-l-2 pl-3" style={{ borderColor: '#CBD5E1' }}>
              <p
                className="text-2xl tracking-wide uppercase leading-none"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
              >
                5.0 RATING
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
              >
                Based on 47 Google Reviews
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}