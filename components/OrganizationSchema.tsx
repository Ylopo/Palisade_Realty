import COMMUNITIES from '@/lib/community-data'
import reviewsData from '@/data/reviews.json'

const SITE_URL = 'https://www.palisaderealty.com'

// Sourced from the Zillow team-wide rating (the only figure with a live, working
// review-destination link today — see data/reviews.json). The Google figure is
// intentionally excluded here (structuredDataEligible: false) until its GBP
// listing/link is verified — see findings/local.md.
const zillow = reviewsData.summary.zillow

export default function OrganizationSchema() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#organization`,
    name: 'Palisade Realty, Inc.',
    url: SITE_URL,
    telephone: '+1-619-794-0218',
    email: 'contactus@palisaderealty.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3434 Grove Street',
      addressLocality: 'Lemon Grove',
      addressRegion: 'CA',
      postalCode: '91945',
      addressCountry: 'US',
    },
    areaServed: COMMUNITIES.map((c) => ({ '@type': 'City', name: `${c.name}, CA` })),
    sameAs: [
      'https://www.facebook.com/PalisadeRealty/',
      'https://www.instagram.com/palisade_realty/',
      'https://www.pinterest.com/palisaderealty/',
      'https://www.zillow.com/profile/Hedda%20Parashos#reviews',
    ],
    // Second confirmed office/GBP listing (findings/local.md: "no local schema
    // on the 18 community pages" / "multi-location schema pattern not
    // implemented"). Represented via `department` per schema.org's documented
    // multi-location pattern rather than a second top-level entity.
    department: [
      {
        '@type': 'RealEstateAgent',
        '@id': `${SITE_URL}/#location-north-park`,
        name: 'Hedda Parashos – North Park',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '2828 University Ave., Suite 102',
          addressLocality: 'San Diego',
          addressRegion: 'CA',
          postalCode: '92104',
          addressCountry: 'US',
        },
      },
    ],
    ...(zillow && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: zillow.averageRating,
        bestRating: 5,
        reviewCount: zillow.reviewCount,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
