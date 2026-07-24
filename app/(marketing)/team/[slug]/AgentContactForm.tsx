'use client'

import { useState } from 'react'

interface Props {
  agentName: string
  agentEmail: string
}

interface Fields {
  firstName: string
  lastName: string
  email: string
  phone: string
  interest: string
  message: string
}

type Errors = Partial<Record<Exclude<keyof Fields, 'phone'>, string>>

export default function AgentContactForm({ agentName, agentEmail }: Props) {
  const [fields, setFields] = useState<Fields>({
    firstName: '', lastName: '', email: '', phone: '', interest: '', message: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)

  function update(key: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => { const e = { ...prev }; delete e[key as keyof Errors]; return e })
  }

  function validate(): Errors {
    const e: Errors = {}
    if (!fields.firstName.trim()) e.firstName = 'Required'
    if (!fields.lastName.trim()) e.lastName = 'Required'
    if (!fields.email.trim() || !/\S+@\S+\.\S+/.test(fields.email)) e.email = 'Valid email required'
    if (!fields.message.trim()) e.message = 'Please tell us about your goals'
    return e
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    const sub = encodeURIComponent(fields.interest || `Real estate inquiry from ${fields.firstName} ${fields.lastName}`)
    const body = encodeURIComponent(
      `Name: ${fields.firstName} ${fields.lastName}\nPhone: ${fields.phone || 'N/A'}\nInterest: ${fields.interest || 'General'}\n\n${fields.message}`
    )
    window.location.href = `mailto:${agentEmail}?subject=${sub}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="form-success" role="status">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="var(--brand,#58172a)" opacity=".1" />
          <path d="M12 20l6 6 10-12" stroke="var(--brand,#58172a)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>Message Sent!</h3>
        <p>Your email client should open shortly. {agentName} will be in touch soon.</p>
      </div>
    )
  }

  return (
    <form className="ap-form" onSubmit={handleSubmit} noValidate aria-label={`Contact ${agentName}`}>
      <div className="ap-form-row">
        <div className="form-group">
          <label htmlFor="af-first">First Name</label>
          <input
            id="af-first" type="text" placeholder="Jane" required
            value={fields.firstName} onChange={(e) => update('firstName', e.target.value)}
            aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? 'af-first-err' : undefined}
          />
          {errors.firstName && <span id="af-first-err" className="form-error" role="alert">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="af-last">Last Name</label>
          <input
            id="af-last" type="text" placeholder="Smith" required
            value={fields.lastName} onChange={(e) => update('lastName', e.target.value)}
            aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? 'af-last-err' : undefined}
          />
          {errors.lastName && <span id="af-last-err" className="form-error" role="alert">{errors.lastName}</span>}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="af-email">Email Address</label>
        <input
          id="af-email" type="email" placeholder="jane@example.com" required
          value={fields.email} onChange={(e) => update('email', e.target.value)}
          aria-invalid={!!errors.email} aria-describedby={errors.email ? 'af-email-err' : undefined}
        />
        {errors.email && <span id="af-email-err" className="form-error" role="alert">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="af-phone">Phone Number <span style={{ color: '#999', fontWeight: 400 }}>(optional)</span></label>
        <input
          id="af-phone" type="tel" placeholder="(619) 555-0000"
          value={fields.phone} onChange={(e) => update('phone', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="af-interest">I&apos;m Interested In</label>
        <select id="af-interest" value={fields.interest} onChange={(e) => update('interest', e.target.value)}>
          <option value="">Select one…</option>
          <option>Buying a Home</option>
          <option>Selling My Home</option>
          <option>Buying &amp; Selling</option>
          <option>Investment Property</option>
          <option>Other</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="af-message">Message</label>
        <textarea
          id="af-message" placeholder="Tell me about your real estate goals…" rows={4} required
          value={fields.message} onChange={(e) => update('message', e.target.value)}
          aria-invalid={!!errors.message} aria-describedby={errors.message ? 'af-message-err' : undefined}
          style={{ minHeight: '118px' }}
        />
        {errors.message && <span id="af-message-err" className="form-error" role="alert">{errors.message}</span>}
      </div>
      <p className="ap-form-consent">
        By providing your telephone number, you are consenting to allow Palisade Realty, Inc. to contact you with
        informational communications via voice call, AI voice call, and/or text message for real estate services.
        Message and data rates may apply. Reply STOP to opt out.
      </p>
      <button type="submit" className="ap-form-submit">
        Send Message
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7h10M7 2.5 11.5 7 7 11.5" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  )
}
