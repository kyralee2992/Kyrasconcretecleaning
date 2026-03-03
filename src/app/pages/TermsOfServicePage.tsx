import { LegalPageLayout } from '../components/LegalPageLayout';

export default function TermsOfServicePage() {
  const sections = [
    {
      heading: 'What This Is',
      content: (
        <p>
          These terms apply to your use of this website and to any services you book with
          Kyra Lee's Concrete Cleaning. By using this site or scheduling an appointment, you're
          agreeing to the terms below. They're written to be straightforward — if something isn't
          clear, just ask.
        </p>
      )
    },
    {
      heading: 'Our Services',
      content: (
        <>
          <p className="mb-4">
            We provide residential exterior cleaning services in the Salem, Oregon area. Specifically:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              'Soft Washing (Siding) — low-pressure cleaning for exterior siding, safe for vinyl and painted surfaces',
              'Deep Cleaning (Concrete) — high-pressure cleaning for driveways, walkways, and concrete surfaces'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: '#0EA5E9', fontWeight: 700, flexShrink: 0 }}>—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            We only offer cleaning services. We don't perform repairs, sealing, painting, or any
            work that would require a contractor's license.
          </p>
        </>
      )
    },
    {
      heading: 'How Booking Works',
      content: (
        <>
          <p className="mb-4">
            This site is a booking request form, not a confirmation system. Here's the process:
          </p>
          <ul className="space-y-2">
            {[
              'You submit a request with your contact details and address.',
              'We reach out to confirm a time to come out for a free walkthrough.',
              'We walk the property with you, assess what needs to be done, and give you a firm quote on the spot.',
              'If you want to move forward, we schedule the job. If not, no hard feelings.'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: '#0F172A', color: '#0EA5E9', fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}
                >
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      heading: 'Pricing',
      content: (
        <>
          <p className="mb-4">
            The prices listed on this site ("From $149," "From $249") are starting prices for
            standard residential jobs. Your actual price is determined at the walkthrough and
            confirmed before any work begins.
          </p>
          <p>
            We won't start work without your approval of the final price. If conditions on-site
            are significantly different from what was expected, we'll tell you before we touch anything.
          </p>
        </>
      )
    },
    {
      heading: 'Scheduling & Cancellations',
      content: (
        <>
          <p className="mb-3">
            <span style={{ color: '#0F172A', fontWeight: 600 }}>Weather:</span>{' '}
            Pressure washing in the rain doesn't work well and can be unsafe. If we need to reschedule
            due to weather, we'll give you as much notice as possible and get you rebooked quickly.
          </p>
          <p className="mb-3">
            <span style={{ color: '#0F172A', fontWeight: 600 }}>Cancellations:</span>{' '}
            If you need to cancel or reschedule, please let us know as soon as you can. We don't
            charge cancellation fees — we just ask for a heads up so we can fill the time slot.
          </p>
          <p>
            <span style={{ color: '#0F172A', fontWeight: 600 }}>No-shows:</span>{' '}
            If we show up for a scheduled job and nobody is home and we can't reach you, we may
            need to charge a trip fee for the return visit. We'll always try to contact you first.
          </p>
        </>
      )
    },
    {
      heading: 'Payment',
      content: (
        <>
          <p className="mb-4">Payment is due when the job is done and you're satisfied.</p>
          <ul className="space-y-2">
            {[
              'We accept cash, check, Venmo, and most major credit or debit cards.',
              "We don't require deposits for residential jobs.",
              "If for any reason you're not happy with the work, tell us before we pack up — we'd rather fix it on the spot than have you leave a bad review."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: '#0EA5E9', fontWeight: 700, flexShrink: 0 }}>—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      heading: 'Your Responsibilities',
      content: (
        <>
          <p className="mb-4">To help the job go smoothly, we ask that you:</p>
          <ul className="space-y-2">
            {[
              'Give us accurate information about what needs to be cleaned and any known hazards on the property.',
              'Make sure we have access to the work area on the scheduled day.',
              'Move vehicles, patio furniture, or any valuables out of the work area beforehand.',
              'Keep pets and children away from the work area while we\'re working.',
              'Let us know about any fragile landscaping, recently sealed surfaces, or areas we should avoid.',
              'Have an outdoor water connection accessible — we bring our own equipment but need a water source.'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: '#0EA5E9', fontWeight: 700, flexShrink: 0 }}>—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      heading: 'Our Guarantee',
      content: (
        <>
          <p className="mb-4">
            We stand behind our work. If something doesn't look right after we're done, contact us
            within 7 days and we'll come back out and make it right at no charge.
          </p>
          <p className="mb-4">
            That said, there are some things outside our control that we can't be responsible for:
          </p>
          <ul className="space-y-2">
            {[
              'Pre-existing damage or staining that cleaning reveals but didn\'t cause.',
              'Surfaces that are in poor structural condition — cleaning can sometimes make existing cracks or flaking more visible.',
              'Natural color variations in concrete or siding that become more apparent after cleaning.',
              'Damage caused by hazards that weren\'t disclosed to us before we started.'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: '#FACC15', fontWeight: 700, flexShrink: 0 }}>—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      heading: 'Photos',
      content: (
        <p>
          We may take before and after photos of the work area for our own records and for use
          in marketing. We won't photograph the interior of your home or anything unrelated to the
          job. If you'd prefer we don't use your property photos publicly, just let us know and
          we'll keep them private.
        </p>
      )
    },
    {
      heading: 'Liability',
      content: (
        <p>
          Kyra Lee's Concrete Cleaning carries general liability insurance. In the unlikely event
          that our work causes damage to your property, our liability is limited to the cost of
          the service performed. We're not responsible for indirect or consequential damages.
          If something goes wrong, the best first step is always to just call us directly — we'd
          rather resolve it quickly and fairly than make it complicated.
        </p>
      )
    },
    {
      heading: 'Governing Law',
      content: (
        <p>
          These terms are governed by the laws of the State of Oregon. Any disputes that can't
          be resolved informally would be handled in Marion County, Oregon.
        </p>
      )
    },
    {
      heading: 'Questions?',
      content: (
        <>
          <p className="mb-4">If you have questions about any of this, just reach out:</p>
          <div className="space-y-1" style={{ color: '#0F172A' }}>
            <p style={{ fontWeight: 600 }}>Kyra Lee's Concrete Cleaning</p>
            <p>Salem, Oregon</p>
            <p>
              <a
                href="mailto:kyraleecleaning@gmail.com"
                style={{ color: '#0EA5E9', textDecoration: 'underline' }}
              >
                kyraleecleaning@gmail.com
              </a>
            </p>
            <p>
              <a
                href="tel:+19715100926"
                style={{ color: '#0EA5E9', textDecoration: 'underline' }}
              >
                (971) 510-0926
              </a>
            </p>
          </div>
        </>
      )
    }
  ];

  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="What to expect when you book with us. Written plainly — no fine print designed to confuse you."
      lastUpdated="March 3, 2026"
      sections={sections}
    />
  );
}