import type { Metadata } from 'next'
import ContactSection from './ContactSection'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Palisade Realty. Call (619) 794-0218, email us, or fill out our contact form. Offices in Lemon Grove, Spring Valley, and San Diego, CA.',
}

export default function ContactPage() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="contact-hero" aria-label="Contact Palisade Realty">
        <div className="contact-hero-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-background/hero-2.jpg" alt="San Diego skyline" loading="eager" />
        </div>
        <div className="contact-hero-overlay" aria-hidden="true" />
        <div className="contact-hero-content">
          <span className="contact-hero-eyebrow reveal">Palisade Realty, Inc.</span>
          <h1 className="contact-hero-title reveal reveal-delay-1">Let&rsquo;s <em>Connect</em></h1>
          <p className="contact-hero-sub reveal reveal-delay-2">
            Whether you&rsquo;re buying, selling, or just exploring — our team is ready to guide you every step of the way.
          </p>
          <a href="#contact-form" className="btn btn-brand reveal reveal-delay-3">Send Us a Message</a>
        </div>
      </section>

      {/* ── CONTACT INFO CARDS ──────────────────────────────── */}
      <section className="contact-info" aria-labelledby="contact-info-heading">
        <div className="contact-info-inner">
          <div className="contact-info-head">
            <span className="eyebrow reveal">How to Reach Us</span>
            <h2 className="section-title reveal reveal-delay-1" id="contact-info-heading">We&rsquo;re Here to Help</h2>
          </div>
          <div className="contact-cards">

            <div className="contact-card reveal">
              <div className="contact-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 0 1 14 0c0 5-7 12.5-7 12.5z" />
                  <circle cx="12" cy="8.5" r="2.5" />
                </svg>
              </div>
              <span className="contact-card-label">Main Office</span>
              <h3 className="contact-card-title">Lemon Grove</h3>
              <p className="contact-card-body">3434 Grove Street<br />Lemon Grove, CA 91945</p>
            </div>

            <div className="contact-card reveal reveal-delay-1">
              <div className="contact-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.83 5.83l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="contact-card-label">Call Us</span>
              <h3 className="contact-card-title">Phone</h3>
              <p className="contact-card-body">
                <a href="tel:+16197940218">(619) 794-0218</a><br />Mon – Fri: 9 AM – 5 PM
              </p>
            </div>

            <div className="contact-card reveal reveal-delay-2">
              <div className="contact-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 7 10-7" />
                </svg>
              </div>
              <span className="contact-card-label">Email Us</span>
              <h3 className="contact-card-title">Email</h3>
              <p className="contact-card-body">
                <a href="mailto:contactus@palisaderealty.com">contactus@<br />palisaderealty.com</a>
              </p>
            </div>

            <div className="contact-card reveal reveal-delay-3">
              <div className="contact-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <span className="contact-card-label">Office Hours</span>
              <h3 className="contact-card-title">Hours</h3>
              <p className="contact-card-body">Mon – Fri: 9:00 AM – 5:00 PM<br />Sat – Sun: By Appointment</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── FORM + MAP (client component) ──────────────────── */}
      <ContactSection />

      {/* ── CTA BANNER ──────────────────────────────────────── */}
      <section className="contact-cta" aria-labelledby="cta-heading">
        <div className="contact-cta-texture" aria-hidden="true" />
        <div className="contact-cta-inner">
          <span className="eyebrow reveal">Your San Diego Real Estate Team</span>
          <h2 className="contact-cta-title reveal reveal-delay-1"><em>Ready to Find</em><br />Your Dream Home?</h2>
          <p className="contact-cta-body reveal reveal-delay-2" id="cta-heading">
            Hedda Parashos and the Palisade Realty team bring 15+ years of San Diego expertise to every transaction — whether you&rsquo;re buying your first home or your fifth.
          </p>
          <div className="contact-cta-btns reveal reveal-delay-3">
            <a href="https://search.palisaderealty.com/" className="btn btn-brand" target="_blank" rel="noopener noreferrer">
              Search Listings
            </a>
            <a href="tel:+16197940218" className="btn btn-outline-white">(619) 794-0218</a>
          </div>
        </div>
      </section>
    </>
  )
}
