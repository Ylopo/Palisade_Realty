'use client'

import { useState } from 'react'

interface Fields {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
}

type Errors = Partial<Record<Exclude<keyof Fields, 'phone'>, string>>

export default function ContactSection() {
  const [fields, setFields] = useState<Fields>({
    firstName: '', lastName: '', email: '', phone: '', subject: '', message: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)

  function update(key: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
    if (key !== 'phone' && errors[key as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function validate(): Errors {
    const e: Errors = {}
    if (!fields.firstName.trim()) e.firstName = 'Please enter your first name.'
    if (!fields.lastName.trim()) e.lastName = 'Please enter your last name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) e.email = 'Please enter a valid email address.'
    if (!fields.subject) e.subject = 'Please select a subject.'
    if (fields.message.trim().length <= 5) e.message = 'Please enter a message.'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const body = `Name: ${fields.firstName} ${fields.lastName}\nEmail: ${fields.email}\nPhone: ${fields.phone}\nSubject: ${fields.subject}\n\n${fields.message}`
    window.location.href =
      `mailto:contactus@palisaderealty.com?subject=${encodeURIComponent('Website Inquiry: ' + fields.subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <section className="contact-main" id="contact-form" aria-labelledby="form-heading">
      <div className="contact-main-inner">

        {/* ── Form column ── */}
        <div className="contact-form-col">
          <span className="eyebrow reveal">Send a Message</span>
          <h2 className="section-title reveal reveal-delay-1" id="form-heading">
            Talk to Our <em style={{ fontStyle: 'italic', color: 'var(--brand)' }}>Team</em>
          </h2>
          <p className="contact-form-intro reveal reveal-delay-2">
            Fill out the form below and a member of the Palisade Realty team will reach out within one business day.
          </p>

          {submitted ? (
            <div className="form-success" role="alert" aria-live="polite">
              <div className="form-success-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3>Message Received!</h3>
              <p>Thank you for reaching out. We&rsquo;ll be in touch within one business day.</p>
            </div>
          ) : (
            <form className="contact-form reveal reveal-delay-2" onSubmit={handleSubmit} noValidate aria-label="Contact form">

              <div className="form-row">
                <div className={`form-group${errors.firstName ? ' has-error' : ''}`}>
                  <label htmlFor="first-name">First Name <span aria-hidden="true">*</span></label>
                  <input
                    type="text" id="first-name" name="firstName" autoComplete="given-name"
                    required placeholder="Jane"
                    className={errors.firstName ? 'error' : ''}
                    value={fields.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                  />
                  {errors.firstName && <span className="form-error-msg">{errors.firstName}</span>}
                </div>
                <div className={`form-group${errors.lastName ? ' has-error' : ''}`}>
                  <label htmlFor="last-name">Last Name <span aria-hidden="true">*</span></label>
                  <input
                    type="text" id="last-name" name="lastName" autoComplete="family-name"
                    required placeholder="Smith"
                    className={errors.lastName ? 'error' : ''}
                    value={fields.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                  />
                  {errors.lastName && <span className="form-error-msg">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className={`form-group${errors.email ? ' has-error' : ''}`}>
                  <label htmlFor="email">Email Address <span aria-hidden="true">*</span></label>
                  <input
                    type="email" id="email" name="email" autoComplete="email"
                    required placeholder="jane@example.com"
                    className={errors.email ? 'error' : ''}
                    value={fields.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                  {errors.email && <span className="form-error-msg">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel" id="phone" name="phone" autoComplete="tel" placeholder="(619) 555-0100"
                    value={fields.phone}
                    onChange={(e) => update('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className={`form-group${errors.subject ? ' has-error' : ''}`}>
                <label htmlFor="subject">Subject <span aria-hidden="true">*</span></label>
                <select
                  id="subject" name="subject" required
                  className={errors.subject ? 'error' : ''}
                  value={fields.subject}
                  onChange={(e) => update('subject', e.target.value)}
                >
                  <option value="" disabled>Select a topic…</option>
                  <option value="buying">I&rsquo;m interested in buying a home</option>
                  <option value="selling">I&rsquo;d like to sell my home</option>
                  <option value="valuation">I want a home valuation</option>
                  <option value="communities">Community information</option>
                  <option value="financing">Financing questions</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && <span className="form-error-msg">{errors.subject}</span>}
              </div>

              <div className={`form-group${errors.message ? ' has-error' : ''}`}>
                <label htmlFor="message">Message <span aria-hidden="true">*</span></label>
                <textarea
                  id="message" name="message" required placeholder="Tell us how we can help…"
                  className={errors.message ? 'error' : ''}
                  value={fields.message}
                  onChange={(e) => update('message', e.target.value)}
                />
                {errors.message && <span className="form-error-msg">{errors.message}</span>}
              </div>

              <p className="form-consent">
                By providing your telephone number, you are consenting to allow Palisade Realty, Inc. to contact you with informational communications via voice call, AI voice call, and/or text message, or similar automated means for real estate services. To opt out you can reply &ldquo;stop&rdquo; at any time. Message and data rates may apply. See our{' '}
                <a href="https://search.palisaderealty.com/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy &amp; Terms
                </a>.
              </p>

              <button type="submit" className="btn btn-brand" aria-label="Submit contact form">
                Send Message
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                  strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true" style={{ marginLeft: 8 }}
                >
                  <path d="M2 8h12" /><path d="M8 4l4 4-4 4" />
                </svg>
              </button>

            </form>
          )}
        </div>

        {/* ── Map column ── */}
        <div className="contact-map-col">
          <span className="eyebrow reveal">Find Us</span>
          <h2 className="section-title reveal reveal-delay-1">
            Our <em style={{ fontStyle: 'italic', color: 'var(--brand)' }}>Offices</em>
          </h2>
          <p className="contact-map-intro reveal reveal-delay-2">
            We serve the greater San Diego area from three convenient locations.
          </p>

          <div className="contact-map-wrap reveal reveal-delay-2">
            <iframe
              title="Palisade Realty main office location"
              src="https://www.google.com/maps?q=3434+Grove+Street,+Lemon+Grove,+CA+91945&output=embed"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Map showing Palisade Realty at 3434 Grove Street, Lemon Grove, CA"
            />
          </div>

          <div className="contact-offices reveal reveal-delay-3">
            <div className="contact-office">
              <div className="contact-office-dot" aria-hidden="true" />
              <div>
                <p className="contact-office-name">Main Office</p>
                <p className="contact-office-addr">3434 Grove Street<br />Lemon Grove, CA 91945</p>
              </div>
            </div>
            <div className="contact-office">
              <div className="contact-office-dot" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              <div>
                <p className="contact-office-name" style={{ color: 'var(--mid-gray)' }}>Spring Valley</p>
                <p className="contact-office-addr">9847 Campo Road<br />Spring Valley, CA 91977</p>
              </div>
            </div>
            <div className="contact-office">
              <div className="contact-office-dot" style={{ background: 'var(--mid-gray)' }} aria-hidden="true" />
              <div>
                <p className="contact-office-name" style={{ color: 'var(--mid-gray)' }}>San Diego</p>
                <p className="contact-office-addr">2828 University Ave., Suite 102<br />San Diego, CA 92104</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
