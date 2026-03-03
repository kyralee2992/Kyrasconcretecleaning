import { Outlet } from 'react-router';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import { MobileCTABar } from './MobileCTABar';
import { CookieConsent } from './CookieConsent';
import { BackToTop } from './BackToTop';
import { useState } from 'react';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    } else {
      // If not on home page, navigate to home page with contact hash
      window.location.href = '/#contact';
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <DesktopNav onGetQuoteClick={scrollToContact} />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile CTA Bar */}
      <MobileCTABar />

      {/* Page Content */}
      <Outlet />

      {/* Back to Top Button */}
      <BackToTop />

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </>
  );
}