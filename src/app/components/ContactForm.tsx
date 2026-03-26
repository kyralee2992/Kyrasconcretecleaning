'use client'
import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, CalendarDays, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SUBMIT_COOLDOWN_MS = 3000

export function ContactForm() {
  const router = useRouter();
  const lastSubmitRef = useRef<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const serviceOptions = [
    'Soft Washing (Siding)',
    'Deep Cleaning (Concrete)',
    'Both Services',
    'Not Sure Yet'
  ];

  const timeOptions = [
    'Morning (8am–11am)',
    'Midday (11am–2pm)',
    'Afternoon (2pm–5pm)',
    'Flexible / Any Time'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitRef.current < SUBMIT_COOLDOWN_MS) return;

    if (!validateForm()) return;

    lastSubmitRef.current = now;
    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `New Quote Request from ${formData.name}`,
          ...formData,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        setErrors({ form: 'Something went wrong. Please try again or call us directly.' });
        return;
      }

      const result = await response.json();

      if (result.success) {
        router.push('/thank-you');
      } else {
        setErrors({ form: 'Something went wrong. Please try again or call us directly.' });
      }
    } catch {
      clearTimeout(timeoutId);
      setErrors({ form: 'Something went wrong. Please try again or call us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="px-6 md:px-12 lg:px-20 py-12 md:py-20" style={{ backgroundColor: 'white' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: '#22C55E' }}
          >
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase mb-4"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            THANK YOU!
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed mb-6"
            style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
          >
            We've received your quote request and will get back to you within 2 hours during business hours.
          </p>
          <p
            className="text-base leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
          >
            Need an immediate response? Call or text us at{' '}
            <span style={{ color: '#0EA5E9', fontWeight: 600 }}>(971) 510-0926</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="px-6 md:px-12 lg:px-20 py-12 md:py-20" style={{ backgroundColor: 'white' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <p
            className="text-xs md:text-sm tracking-wide uppercase mb-2 md:mb-3"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
          >
            Zero Commitment · Free Visit
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            SCHEDULE YOUR FREE VISIT
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed mt-4 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
          >
            Book a free walkthrough and Kyra will come to your property, walk it with you, and give you a real price on the spot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Info - Left Side */}
          <div className="space-y-8">
            <div>
              <h3
                className="text-2xl md:text-3xl tracking-wide uppercase mb-4"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
              >
                GET IN TOUCH
              </h3>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
              >
                Fill out the form to book your free walkthrough appointment. Or reach out directly — we respond fast!
              </p>
            </div>

            {/* What to expect callout */}
            <div
              className="rounded-xl p-5 space-y-3"
              style={{ backgroundColor: '#F0F9FF', border: '2px solid #BAE6FD' }}
            >
              <p
                className="text-sm tracking-wide uppercase"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0EA5E9' }}
              >
                Walkthrough Quote: What To Expect
              </p>
              {[
                'Kyra arrives with our digital quoting tool',
                'You walk the property together (~15–20 min)',
                'She draws the areas on-screen as you point',
                'Your price is calculated instantly, on the spot',
                'No pressure, no deposit required'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#22C55E' }} strokeWidth={2.5} />
                  <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A' }}>{item}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#0EA5E9' }}
                >
                  <Phone className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p
                    className="text-sm tracking-wide uppercase mb-1"
                    style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#64748B' }}
                  >
                    Call or Text
                  </p>
                  <p
                    className="text-xl md:text-2xl tracking-wide"
                    style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
                  >
                    (971) 510-0926
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#0EA5E9' }}
                >
                  <Mail className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p
                    className="text-sm tracking-wide uppercase mb-1"
                    style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#64748B' }}
                  >
                    Email
                  </p>
                  <p
                    className="text-lg md:text-xl"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#0F172A' }}
                  >
                    kyraleecleaning@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#0EA5E9' }}
                >
                  <MapPin className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p
                    className="text-sm tracking-wide uppercase mb-1"
                    style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#64748B' }}
                  >
                    Service Area
                  </p>
                  <p
                    className="text-lg md:text-xl"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#0F172A' }}
                  >
                    Salem, OR
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form - Right Side */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm tracking-wide uppercase mb-2"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                style={{
                  borderColor: errors.name ? '#EF4444' : '#E2E8F0',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'white'
                }}
                placeholder="John Smith"
              />
              {errors.name && (
                <p className="text-sm mt-1" style={{ color: '#EF4444', fontFamily: 'Inter, sans-serif' }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm tracking-wide uppercase mb-2"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                  style={{
                    borderColor: errors.email ? '#EF4444' : '#E2E8F0',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: 'white'
                  }}
                  placeholder="john@email.com"
                />
                {errors.email && (
                  <p className="text-sm mt-1" style={{ color: '#EF4444', fontFamily: 'Inter, sans-serif' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm tracking-wide uppercase mb-2"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
                >
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                  style={{
                    borderColor: errors.phone ? '#EF4444' : '#E2E8F0',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: 'white'
                  }}
                  placeholder="(503) 555-1234"
                />
                {errors.phone && (
                  <p className="text-sm mt-1" style={{ color: '#EF4444', fontFamily: 'Inter, sans-serif' }}>
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm tracking-wide uppercase mb-2"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
              >
                Property Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                style={{
                  borderColor: '#E2E8F0',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'white'
                }}
                placeholder="123 Main St, Salem, OR 97301"
              />
            </div>

            {/* Service Type */}
            <div>
              <label
                htmlFor="serviceType"
                className="block text-sm tracking-wide uppercase mb-2"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
              >
                Service Needed *
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                style={{
                  borderColor: errors.serviceType ? '#EF4444' : '#E2E8F0',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'white',
                  color: formData.serviceType ? '#0F172A' : '#94A3B8'
                }}
              >
                <option value="">Select a service...</option>
                {serviceOptions.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <p className="text-sm mt-1" style={{ color: '#EF4444', fontFamily: 'Inter, sans-serif' }}>
                  {errors.serviceType}
                </p>
              )}
            </div>

            {/* Preferred Date & Time — always shown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="preferredDate"
                  className="block text-sm tracking-wide uppercase mb-2"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
                >
                  <span className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" style={{ color: '#0EA5E9' }} strokeWidth={2} />
                    Preferred Date
                  </span>
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                  style={{
                    borderColor: '#E2E8F0',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: 'white',
                    color: '#0F172A'
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="preferredTime"
                  className="block text-sm tracking-wide uppercase mb-2"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: '#0EA5E9' }} strokeWidth={2} />
                    Preferred Time
                  </span>
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                  style={{
                    borderColor: '#E2E8F0',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: 'white',
                    color: formData.preferredTime ? '#0F172A' : '#94A3B8'
                  }}
                >
                  <option value="">Select a time...</option>
                  {timeOptions.map((time, i) => (
                    <option key={i} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm tracking-wide uppercase mb-2"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0F172A' }}
              >
                Anything Else We Should Know?
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none resize-none"
                style={{
                  borderColor: '#E2E8F0',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'white'
                }}
                placeholder="Surface condition, gate access, specific concerns, etc."
              />
            </div>

            {/* Form-level error */}
            {errors.form && (
              <p className="text-sm text-center" style={{ color: '#EF4444', fontFamily: 'Inter, sans-serif' }}>
                {errors.form}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-8 py-4 rounded-xl text-white transition-all hover:opacity-90 shadow-lg flex items-center justify-center gap-3"
              style={{
                backgroundColor: '#0EA5E9',
                fontFamily: 'Oswald, sans-serif',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '16px'
              }}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} /> : <Send className="w-5 h-5" strokeWidth={2.5} />}
              Book My Free Walkthrough
            </button>

            <p
              className="text-xs text-center leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
            >
              By submitting this form, you agree to be contacted about your quote request. 
              We respect your privacy and will never share your information.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}