import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-texture" aria-hidden="true" />
      <div className="footer-stripe" aria-hidden="true" />

      <div className="footer-inner">

        {/* Brand Column */}
        <div className="footer-col-brand">
          <div className="footer-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Palisade Realty" />
          </div>

          <div className="footer-copy-mls-row">
            <div>
              <p className="footer-copy">
                &copy;Palisade Realty, Inc. 2026<br />
                All Rights Reserved<br /><br />
                Brokerage CA DRE #01848565<br /><br />
                Hedda Parashos<br />
                CA DRE #01773167
              </p>
            </div>
            <div className="footer-mls-badge" aria-label="Move Safe Certified by HomeLight">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/move-safe-offsite-stacked.png" alt="Move Safe Certified by HomeLight" />
            </div>
          </div>

          <div className="footer-social">
            <a href="https://www.facebook.com/PalisadeRealty/" target="_blank" rel="noopener noreferrer" aria-label="Palisade Realty on Facebook">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M15 8a7 7 0 1 0-8.094 6.915V10.3H4.947V8h1.959V6.257C6.906 4.32 8.067 3.25 9.832 3.25c.847 0 1.733.151 1.733.151v1.9h-.976c-.962 0-1.261.597-1.261 1.209V8h2.147l-.343 2.3H9.328v4.615A7.003 7.003 0 0 0 15 8z" />
              </svg>
            </a>
            <a href="https://www.pinterest.com/palisaderealty/" target="_blank" rel="noopener noreferrer" aria-label="Palisade Realty on Pinterest">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.984-4.172.984-4.172s-.252-.503-.252-1.246c0-1.167.678-2.041 1.52-2.041.717 0 1.065.539 1.065 1.184 0 .721-.46 1.801-.698 2.8-.198.835.42 1.515 1.242 1.515 1.49 0 2.638-1.571 2.638-3.836 0-2.006-1.441-3.408-3.499-3.408-2.382 0-3.78 1.787-3.78 3.634 0 .72.276 1.49.621 1.91a.25.25 0 0 1 .057.239c-.063.264-.204.835-.232.952-.037.154-.124.186-.285.112-1.05-.489-1.707-2.028-1.707-3.264 0-2.653 1.928-5.09 5.559-5.09 2.919 0 5.187 2.081 5.187 4.862 0 2.902-1.83 5.237-4.371 5.237-.854 0-1.658-.444-1.932-.967l-.525 1.958c-.19.733-.705 1.65-1.05 2.208A8.001 8.001 0 0 0 8 16a8 8 0 0 0 0-16z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/palisade_realty/" target="_blank" rel="noopener noreferrer" aria-label="Palisade Realty on Instagram">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <nav className="footer-col-links" aria-label="Quick links">
          <span className="footer-col-title">Quick Links</span>
          <div className="footer-links">
            <a href="https://search.palisaderealty.com/" target="_blank" rel="noopener noreferrer">Buy a Home</a>
            <a href="https://search.palisaderealty.com/seller" target="_blank" rel="noopener noreferrer">Sell Your Home</a>
            <Link href="/communities">Communities</Link>
            <Link href="/properties">Featured Properties</Link>
            <Link href="/testimonials">Testimonials</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/team">Our Team</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </nav>

        {/* Contact Column */}
        <address className="footer-col-contact" style={{ fontStyle: 'normal' }}>
          <span className="footer-col-title">Contact</span>
          <span className="footer-contact-line"><strong>3434 Grove Street</strong></span>
          <span className="footer-contact-line"><strong>Lemon Grove, CA 91945</strong></span>
          <a href="tel:+16197940218" className="footer-contact-line">(619) 794-0218</a>
          <a href="mailto:contactus@palisaderealty.com" className="footer-contact-line footer-contact-line--email">contactus@palisaderealty.com</a>
          <span className="footer-contact-line">Mon – Fri: 9:00 AM – 5:00 PM</span>
        </address>

      </div>
    </footer>
  )
}
