import { Phone, MessageSquare } from 'lucide-react';

export function MobileCTABar() {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{ backgroundColor: '#0F172A', boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.3)' }}
    >
      <div className="grid grid-cols-2 gap-0">
        {/* Call Button */}
        <a
          href="tel:9715100926"
          className="flex items-center justify-center gap-3 py-5 transition-colors active:bg-opacity-80"
          style={{ backgroundColor: '#0EA5E9' }}
        >
          <Phone className="w-6 h-6 text-white" strokeWidth={2.5} />
          <span
            className="text-base tracking-wide uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
          >
            Call Now
          </span>
        </a>

        {/* Text Button */}
        <a
          href="sms:9715100926"
          className="flex items-center justify-center gap-3 py-5 transition-colors active:bg-opacity-80"
          style={{ backgroundColor: '#FACC15' }}
        >
          <MessageSquare className="w-6 h-6" style={{ color: '#0F172A' }} strokeWidth={2.5} />
          <span
            className="text-base tracking-wide uppercase"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            Text Us
          </span>
        </a>
      </div>
    </div>
  );
}