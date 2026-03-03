import { LegalPageLayout } from '../components/LegalPageLayout';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      heading: 'The Short Version',
      content: (
        <p>
          This is a simple brochure website. You can browse it without giving us any personal information at all.
          The only time we collect your information is when you choose to reach out — by filling out the contact
          form or calling or emailing us directly. We use that information to get back to you and nothing else.
          We don't sell it. We don't share it. We don't send you newsletters you didn't ask for.
        </p>
      )
    },
    {
      heading: 'What We Collect',
      content: (
        <>
          <p className="mb-4">
            When you contact us through our booking form, we collect whatever you choose to provide:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              'Your name',
              'Your phone number or email address',
              'Your property address (so we can come out and take a look)',
              'Any notes or details you include in your message'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: '#0EA5E9', fontWeight: 700, flexShrink: 0 }}>—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            We may also collect basic analytics data automatically (like which pages were visited and what
            browser was used) through standard website tools. This data is anonymous and is only used to
            understand how the site is performing.
          </p>
        </>
      )
    },
    {
      heading: 'How We Use It',
      content: (
        <>
          <p className="mb-4">We use your contact information for one purpose: to follow up with you about your appointment request.</p>
          <p>
            That means we'll use your phone number or email to confirm your appointment, let you know if we
            need to reschedule due to weather, and send your quote after the walkthrough. That's it.
          </p>
        </>
      )
    },
    {
      heading: 'We Don\'t Sell Your Information',
      content: (
        <p>
          Full stop. We are a one-person local cleaning business. We have no interest in selling, renting,
          or sharing your personal information with anyone. Your address and contact info stay between us.
          The only exception would be if we were legally required to disclose something — but for a
          residential cleaning service, that's not a scenario we ever expect to encounter.
        </p>
      )
    },
    {
      heading: 'Cookies',
      content: (
        <p>
          This site may use basic cookies for analytics and to remember your cookie consent preference.
          You can control or disable cookies in your browser settings at any time. If you opt out,
          the site will still work normally — you just won't see the cookie banner again on your next visit.
        </p>
      )
    },
    {
      heading: 'How Long We Keep Your Information',
      content: (
        <p>
          We keep your contact details and appointment history in our records for as long as we have an
          active business relationship, or until you ask us to remove them. If you'd like us to delete your
          information, just send us an email and we'll take care of it.
        </p>
      )
    },
    {
      heading: 'Your Rights',
      content: (
        <>
          <p className="mb-4">
            Under Oregon law and general privacy principles, you have the right to know what information
            we hold about you, request that we correct or delete it, and opt out of any marketing
            communications (though we rarely send those in the first place).
          </p>
          <p>
            To exercise any of these rights, email us at{' '}
            <a
              href="mailto:kyraleecleaning@gmail.com"
              style={{ color: '#0EA5E9', textDecoration: 'underline' }}
            >
              kyraleecleaning@gmail.com
            </a>
            {' '}and we'll respond promptly.
          </p>
        </>
      )
    },
    {
      heading: 'Changes to This Policy',
      content: (
        <p>
          If we make any meaningful changes to how we handle your information, we'll update this page
          and the "Last updated" date at the top. Since we're a small local business and this policy
          is already pretty minimal, significant changes are unlikely.
        </p>
      )
    },
    {
      heading: 'Questions?',
      content: (
        <>
          <p className="mb-4">If anything here is unclear or you have a question, just reach out:</p>
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
      title="Privacy Policy"
      subtitle="Plain language. No legal runaround. Here's exactly what we do with your information."
      lastUpdated="March 3, 2026"
      sections={sections}
    />
  );
}
