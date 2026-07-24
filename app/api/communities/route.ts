import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN      = process.env.SANITY_API_TOKEN
const SECRET     = process.env.ADMIN_SECRET
const BASE       = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`
const QUERY_URL  = `${BASE}/data/query/${DATASET}`
const MUTATE_URL = `${BASE}/data/mutate/${DATASET}`
const HDR        = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` } as Record<string,string>)
const CORS       = { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }

// ── communityIndexPage GROQs ──────────────────────────────────────────────────

const PUBLIC_GROQ = `*[_type == "communityIndexPage" && slug.current == $slug][0] {
  _id, cityName, slug, pageUrl, pageTitle,
  heroHeadline, heroSubheadline,
  "heroBackgroundImageUrl": heroBackgroundImage.asset->url,
  introHeading, introContent,
  "communityCards": communityCards[] | order(displayOrder asc) {
    _key, areaName, description, imageAlt, buttonText, buttonUrl, detailPageSlug, displayOrder, active,
    "imageUrl": image.asset->url
  },
  ctaHeadline, ctaDescription, ctaButtonText, ctaButtonUrl,
  seoTitle, seoDescription,
  "ogImageUrl": ogImage.asset->url,
  communityMapSection {
    title, subtitle, description, active, mapCenterLat, mapCenterLng, zoom,
    "serviceAreas": serviceAreas[] | order(displayOrder asc) {
      _key, areaName, subLabel, lat, lng, description, buttonText, buttonUrl,
      markerLabel, displayOrder, active, imageAlt, "imageUrl": image.asset->url
    }
  }
}`

const ADMIN_GROQ = `*[_type == "communityIndexPage" && slug.current == $slug][0] {
  _id, cityName, slug, pageUrl, pageTitle, active,
  heroHeadline, heroSubheadline,
  "heroBackgroundImageUrl": heroBackgroundImage.asset->url,
  "heroBackgroundImageRef": heroBackgroundImage.asset->_id,
  introHeading, introContent,
  "communityCards": communityCards[] | order(displayOrder asc) {
    _key, areaName, description, imageAlt, buttonText, buttonUrl, detailPageSlug, displayOrder, active,
    "imageUrl": image.asset->url,
    "imageRef": image.asset->_id
  },
  ctaHeadline, ctaDescription, ctaButtonText, ctaButtonUrl,
  seoTitle, seoDescription,
  "ogImageUrl": ogImage.asset->url,
  "ogImageRef": ogImage.asset->_id,
  communityMapSection {
    title, subtitle, description, active, mapCenterLat, mapCenterLng, zoom,
    "serviceAreas": serviceAreas[] | order(displayOrder asc) {
      _key, areaName, subLabel, lat, lng, description, buttonText, buttonUrl,
      markerLabel, displayOrder, active, imageAlt, "imageUrl": image.asset->url,
      "imageRef": image.asset->_id
    }
  }
}`

// ── communityDetailPage GROQs ─────────────────────────────────────────────────

const DETAIL_PUBLIC_GROQ = `*[_type == "communityDetailPage" && slug.current == $slug && active != false][0] {
  _id, communityName, slug, pageUrl, city,
  hero { headline, subheadline, "backgroundImageUrl": backgroundImage.asset->url, overlayColor, overlayOpacity, breadcrumbText, active },
  overview { pageTitle, introHeading, introContent, description, "imageUrl": image.asset->url, imageAlt, active },
  "highlights": highlights[] | order(displayOrder asc) {
    _key, title, description, icon, "imageUrl": image.asset->url, imageAlt, displayOrder, active
  },
  "featuredListings": featuredListings[] | order(displayOrder asc) {
    _key, title, price, address, beds, baths, sqft, "imageUrl": image.asset->url, listingUrl, active, displayOrder
  },
  mapArea {
    title, description, mapCenterLat, mapCenterLng, zoom, active,
    "serviceAreas": serviceAreas[] | order(displayOrder asc) {
      _key, areaName, subLabel, lat, lng, description, imageAlt, "imageUrl": image.asset->url, buttonText, buttonUrl, displayOrder, active
    }
  },
  "gallery": gallery[] | order(displayOrder asc) {
    _key, "imageUrl": image.asset->url, imageAlt, caption, displayOrder, active
  },
  listingsSection {
    listingSource, ylopoCode, updatedAt,
    "listings": listings[] | order(displayOrder asc) {
      _key, listingId, listingUrl, title, price, address, city, state, zip,
      beds, baths, sqft, propertyType, mainImage, galleryImages, status, displayOrder, active
    }
  },
  testimonialsSection {
    title, subtitle, active,
    "selectedTestimonials": selectedTestimonials[] | order(displayOrder asc) {
      _key, displayOrder, active,
      "testimonial": testimonial-> {
        _id, name, title, review, rating, imageAlt, active,
        "imageUrl": image.asset->url
      }
    }
  },
  nearbyCommunitiesSection {
    title, subtitle, active,
    "selectedCommunities": selectedCommunities[] | order(displayOrder asc) {
      _key, sourceCardKey, areaName, city, description, imageUrl, imageAlt,
      buttonText, buttonUrl, detailPageSlug, displayOrder, active
    }
  },
  faqSection {
    title, subtitle, description, active,
    "faqs": faqs[] | order(displayOrder asc) {
      _key, question, answer, displayOrder, active
    }
  },
  cta { headline, description, buttonText, buttonUrl, "backgroundImageUrl": backgroundImage.asset->url, active },
  seoTitle, seoDescription, "ogImageUrl": ogImage.asset->url, canonicalUrl, active, updatedAt
}`

const DETAIL_ADMIN_GROQ = `*[_type == "communityDetailPage" && slug.current == $slug][0] {
  _id, communityName, slug, pageUrl, city, active,
  hero {
    headline, subheadline, overlayColor, overlayOpacity, breadcrumbText, active,
    "backgroundImageUrl": backgroundImage.asset->url, "backgroundImageRef": backgroundImage.asset->_id
  },
  overview {
    pageTitle, introHeading, introContent, description, imageAlt, active,
    "imageUrl": image.asset->url, "imageRef": image.asset->_id
  },
  "highlights": highlights[] | order(displayOrder asc) {
    _key, title, description, icon, imageAlt, displayOrder, active,
    "imageUrl": image.asset->url, "imageRef": image.asset->_id
  },
  "featuredListings": featuredListings[] | order(displayOrder asc) {
    _key, title, price, address, beds, baths, sqft, listingUrl, active, displayOrder,
    "imageUrl": image.asset->url, "imageRef": image.asset->_id
  },
  mapArea {
    title, description, mapCenterLat, mapCenterLng, zoom, active,
    "serviceAreas": serviceAreas[] | order(displayOrder asc) {
      _key, areaName, subLabel, lat, lng, description, imageAlt, buttonText, buttonUrl, displayOrder, active,
      "imageUrl": image.asset->url, "imageRef": image.asset->_id
    }
  },
  "gallery": gallery[] | order(displayOrder asc) {
    _key, imageAlt, caption, displayOrder, active,
    "imageUrl": image.asset->url, "imageRef": image.asset->_id
  },
  listingsSection {
    listingSource, ylopoCode, updatedAt,
    "listings": listings[] | order(displayOrder asc) {
      _key, listingId, listingUrl, title, price, address, city, state, zip,
      beds, baths, sqft, propertyType, mainImage, galleryImages, status, displayOrder, active
    }
  },
  testimonialsSection {
    title, subtitle, active,
    "selectedTestimonials": selectedTestimonials[] | order(displayOrder asc) {
      _key, displayOrder, active,
      "testimonial": testimonial-> {
        _id, name, title, review, rating, imageAlt, active,
        "imageUrl": image.asset->url
      }
    }
  },
  nearbyCommunitiesSection {
    title, subtitle, active,
    "selectedCommunities": selectedCommunities[] | order(displayOrder asc) {
      _key, sourceCardKey, areaName, city, description, imageUrl, imageAlt,
      buttonText, buttonUrl, detailPageSlug, displayOrder, active
    }
  },
  faqSection {
    title, subtitle, description, active,
    "faqs": faqs[] | order(displayOrder asc) {
      _key, question, answer, displayOrder, active
    }
  },
  cta {
    headline, description, buttonText, buttonUrl, active,
    "backgroundImageUrl": backgroundImage.asset->url, "backgroundImageRef": backgroundImage.asset->_id
  },
  seoTitle, seoDescription, canonicalUrl, active, updatedAt,
  "ogImageUrl": ogImage.asset->url, "ogImageRef": ogImage.asset->_id
}`

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildImg(ref: string | undefined) {
  return ref ? { _type: 'image', asset: { _type: 'reference', _ref: ref } } : undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeYlopoListing(item: Record<string, any>, domain: string) {
  const DOMAIN = domain || 'search.palisaderealty.com'
  const id     = String(item.id || item.listingId || item.ListingId || item.mlsId || '')
  const addr   = item.address || {}
  const street = addr.fullStreetAddress || item.streetAddress || item.StreetAddress || item.title || ''
  const city   = addr.city || item.city || item.City || ''
  const state  = addr.stateOrProvince || item.stateOrProvince || item.StateOrProvince || item.state || ''
  const zip    = addr.postalCode || item.postalCode || item.zip || ''
  const addrStr = [street, city, state].filter(Boolean).join(', ')
  const price  = item.formattedPrice || item.listPrice || item.ListPrice || item.price || item.currentPrice || ''
  const img    = item.mainPhotoLarge || item.mainPhoto
              || (Array.isArray(item.listingPhotos) ? (item.listingPhotos[0] || '') : '')
              || item.photoUrl || item.thumbnailUrl || item.mainImage || ''
  const status = (item.listingStatus && (item.listingStatus.displayStatus || item.listingStatus.status))
              || item.standardStatus || item.StandardStatus || item.status || 'Active'
  const propType = (item.listingPropertyType && item.listingPropertyType.displayPropertyType)
                || item.propertyType || item.PropertyType || ''
  const url = id ? `https://${DOMAIN}/search/detail/${id}?` : ''
  const galleryRaw = item.largeListingPhotos || item.listingPhotos || []
  const galleryImages = Array.isArray(galleryRaw)
    ? galleryRaw.filter((p: unknown) => typeof p === 'string' && p).slice(0, 20)
    : []
  return {
    listingId:    id,
    listingUrl:   url,
    title:        street,
    price:        typeof price === 'number' ? '$' + price.toLocaleString() : String(price),
    address:      addrStr,
    city, state, zip,
    beds:         item.bedrooms  != null ? Number(item.bedrooms)  : null,
    baths:        item.bathrooms != null ? Number(item.bathrooms) : null,
    sqft:         item.livingAreaSqFt != null ? Number(item.livingAreaSqFt)
                  : item.livingArea != null ? Number(item.livingArea) : null,
    propertyType: propType,
    mainImage:    typeof img === 'string' ? img : '',
    galleryImages,
    status:       String(status),
    _key:         'ls-' + id,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildDoc(b: Record<string, any>) {
  const slug   = b.slug || ''
  const city   = slug.includes('henderson') ? 'henderson' : 'las-vegas'
  const docId  = b._id || ('communityIndex-' + city)
  const heroBg = buildImg(b.heroBackgroundImageRef)
  const ogImg  = buildImg(b.ogImageRef)
  return {
    _id:      docId,
    _type:    'communityIndexPage',
    cityName: b.cityName  || '',
    slug:     { _type: 'slug', current: slug },
    pageUrl:  b.pageUrl   || '',
    pageTitle:b.pageTitle || '',
    active:   b.active    !== false,
    heroHeadline:    b.heroHeadline    || '',
    heroSubheadline: b.heroSubheadline || '',
    ...(heroBg ? { heroBackgroundImage: heroBg } : {}),
    introHeading: b.introHeading || '',
    introContent: b.introContent || '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    communityCards: (b.communityCards || []).map((c: any, i: number) => ({
      _type:          'object',
      _key:           c._key || ('card-' + i),
      areaName:       c.areaName       || '',
      description:    c.description    || '',
      imageAlt:       c.imageAlt       || '',
      buttonText:     c.buttonText     || '',
      buttonUrl:      c.buttonUrl      || '',
      detailPageSlug: c.detailPageSlug || '',
      displayOrder:   Number(c.displayOrder) || i,
      active:         c.active !== false,
      ...(c.imageRef ? { image: buildImg(c.imageRef) } : {}),
    })),
    ctaHeadline:    b.ctaHeadline    || '',
    ctaDescription: b.ctaDescription || '',
    ctaButtonText:  b.ctaButtonText  || '',
    ctaButtonUrl:   b.ctaButtonUrl   || '',
    seoTitle:       b.seoTitle       || '',
    seoDescription: b.seoDescription || '',
    ...(ogImg ? { ogImage: ogImg } : {}),
    ...(b.communityMapSection ? {
      communityMapSection: {
        title:       b.communityMapSection.title       || '',
        subtitle:    b.communityMapSection.subtitle    || '',
        description: b.communityMapSection.description || '',
        active:      b.communityMapSection.active !== false,
        mapCenterLat: b.communityMapSection.mapCenterLat != null ? Number(b.communityMapSection.mapCenterLat) : null,
        mapCenterLng: b.communityMapSection.mapCenterLng != null ? Number(b.communityMapSection.mapCenterLng) : null,
        zoom:         b.communityMapSection.zoom != null ? Number(b.communityMapSection.zoom) : null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serviceAreas: (b.communityMapSection.serviceAreas || []).map((a: any, i: number) => ({
          _type:        'object',
          _key:         a._key || ('area-' + i),
          areaName:     a.areaName    || '',
          subLabel:     a.subLabel    || '',
          lat:          Number(a.lat) || 0,
          lng:          Number(a.lng) || 0,
          description:  a.description || '',
          buttonText:   a.buttonText  || '',
          buttonUrl:    a.buttonUrl   || '',
          markerLabel:  a.markerLabel || '',
          imageAlt:     a.imageAlt   || '',
          displayOrder: Number(a.displayOrder) || i,
          active:       a.active !== false,
          ...(a.imageRef ? { image: buildImg(a.imageRef) } : {}),
        })),
      },
    } : {}),
    updatedAt: new Date().toISOString(),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildDetailDoc(b: Record<string, any>) {
  const slug  = b.slug || ''
  const docId = b._id  || ('communityDetail-' + slug)
  const h  = b.hero     || {}
  const ov = b.overview || {}
  const ma = b.mapArea  || {}
  const ct = b.cta      || {}
  return {
    _id:           docId,
    _type:         'communityDetailPage',
    communityName: b.communityName || '',
    slug:          { _type: 'slug', current: slug },
    pageUrl:       b.pageUrl || '',
    city:          b.city    || 'henderson',
    active:        b.active !== false,
    hero: {
      headline:       h.headline       || '',
      subheadline:    h.subheadline     || '',
      overlayColor:   h.overlayColor    || '#000000',
      overlayOpacity: h.overlayOpacity  != null ? Number(h.overlayOpacity) : 0.4,
      breadcrumbText: h.breadcrumbText  || '',
      active:         h.active !== false,
      ...(h.backgroundImageRef ? { backgroundImage: buildImg(h.backgroundImageRef) } : {}),
    },
    overview: {
      pageTitle:    ov.pageTitle    || '',
      introHeading: ov.introHeading || '',
      introContent: ov.introContent || '',
      description:  ov.description  || '',
      imageAlt:     ov.imageAlt     || '',
      active:       ov.active !== false,
      ...(ov.imageRef ? { image: buildImg(ov.imageRef) } : {}),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    highlights: (b.highlights || []).map((hl: any, i: number) => ({
      _type:        'object',
      _key:         hl._key || ('hl-' + i),
      title:        hl.title       || '',
      description:  hl.description || '',
      icon:         hl.icon        || '',
      imageAlt:     hl.imageAlt    || '',
      displayOrder: Number(hl.displayOrder != null ? hl.displayOrder : i),
      active:       hl.active !== false,
      ...(hl.imageRef ? { image: buildImg(hl.imageRef) } : {}),
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    featuredListings: (b.featuredListings || []).map((ls: any, i: number) => ({
      _type:        'object',
      _key:         ls._key || ('ls-' + i),
      title:        ls.title      || '',
      price:        ls.price      || '',
      address:      ls.address    || '',
      beds:         ls.beds       ? Number(ls.beds)    : null,
      baths:        ls.baths      ? Number(ls.baths)   : null,
      sqft:         ls.sqft       ? Number(ls.sqft)    : null,
      listingUrl:   ls.listingUrl || '',
      displayOrder: Number(ls.displayOrder != null ? ls.displayOrder : i),
      active:       ls.active !== false,
      ...(ls.imageRef ? { image: buildImg(ls.imageRef) } : {}),
    })),
    mapArea: {
      title:        ma.title       || '',
      description:  ma.description || '',
      mapCenterLat: ma.mapCenterLat != null ? Number(ma.mapCenterLat) : null,
      mapCenterLng: ma.mapCenterLng != null ? Number(ma.mapCenterLng) : null,
      zoom:         ma.zoom        != null ? Number(ma.zoom)          : 13,
      active:       ma.active !== false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      serviceAreas: (ma.serviceAreas || []).map((a: any, i: number) => ({
        _type:        'object',
        _key:         a._key || ('area-' + i),
        areaName:     a.areaName    || '',
        subLabel:     a.subLabel    || '',
        lat:          Number(a.lat) || 0,
        lng:          Number(a.lng) || 0,
        description:  a.description || '',
        imageAlt:     a.imageAlt    || '',
        buttonText:   a.buttonText  || '',
        buttonUrl:    a.buttonUrl   || '',
        displayOrder: Number(a.displayOrder != null ? a.displayOrder : i),
        active:       a.active !== false,
        ...(a.imageRef ? { image: buildImg(a.imageRef) } : {}),
      })),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gallery: (b.gallery || []).map((g: any, i: number) => ({
      _type:        'object',
      _key:         g._key || ('gal-' + i),
      imageAlt:     g.imageAlt    || '',
      caption:      g.caption     || '',
      displayOrder: Number(g.displayOrder != null ? g.displayOrder : i),
      active:       g.active !== false,
      ...(g.imageRef ? { image: buildImg(g.imageRef) } : {}),
    })),
    ...(b.listingsSection ? {
      listingsSection: {
        _type:         'object',
        listingSource: b.listingsSection.listingSource || 'ylopo',
        ylopoCode:     b.listingsSection.ylopoCode     || null,
        updatedAt:     new Date().toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        listings: (b.listingsSection.listings || []).map((ls: any, i: number) => ({
          _type:         'object',
          _key:          ls._key || ('ls-' + i),
          listingId:     String(ls.listingId || ''),
          listingUrl:    ls.listingUrl   || '',
          title:         ls.title        || '',
          price:         ls.price        || '',
          address:       ls.address      || '',
          city:          ls.city         || '',
          state:         ls.state        || '',
          zip:           ls.zip          || '',
          beds:          ls.beds  != null ? Number(ls.beds)  : null,
          baths:         ls.baths != null ? Number(ls.baths) : null,
          sqft:          ls.sqft  != null ? Number(ls.sqft)  : null,
          propertyType:  ls.propertyType || '',
          mainImage:     ls.mainImage    || '',
          galleryImages: Array.isArray(ls.galleryImages) ? ls.galleryImages : [],
          status:        ls.status       || 'Active',
          displayOrder:  Number(ls.displayOrder != null ? ls.displayOrder : i),
          active:        ls.active !== false,
        })),
      },
    } : {}),
    ...(b.testimonialsSection ? {
      testimonialsSection: {
        _type:    'object',
        title:    b.testimonialsSection.title    || '',
        subtitle: b.testimonialsSection.subtitle || '',
        active:   b.testimonialsSection.active !== false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        selectedTestimonials: (b.testimonialsSection.selectedTestimonials || []).map((ts: any, i: number) => ({
          _type:        'object',
          _key:         ts._key || ('tsl-' + i),
          testimonial:  { _type: 'reference', _ref: String(ts.testimonialId || '') },
          displayOrder: Number(ts.displayOrder != null ? ts.displayOrder : i),
          active:       ts.active !== false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })).filter((ts: any) => ts.testimonial._ref),
      },
    } : {}),
    ...(b.nearbyCommunitiesSection ? {
      nearbyCommunitiesSection: {
        _type:    'object',
        title:    b.nearbyCommunitiesSection.title    || '',
        subtitle: b.nearbyCommunitiesSection.subtitle || '',
        active:   b.nearbyCommunitiesSection.active !== false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        selectedCommunities: (b.nearbyCommunitiesSection.selectedCommunities || []).map((c: any, i: number) => ({
          _type:          'object',
          _key:           c._key || ('nc-' + i),
          sourceCardKey:  c.sourceCardKey || '',
          areaName:       c.areaName      || '',
          city:           c.city          || '',
          description:    c.description   || '',
          imageUrl:       c.imageUrl      || '',
          imageAlt:       c.imageAlt      || '',
          buttonText:     c.buttonText    || '',
          buttonUrl:      c.buttonUrl     || '',
          detailPageSlug: c.detailPageSlug || '',
          displayOrder:   Number(c.displayOrder != null ? c.displayOrder : i),
          active:         c.active !== false,
        })),
      },
    } : {}),
    ...(b.faqSection ? {
      faqSection: {
        _type:       'object',
        title:       b.faqSection.title       || '',
        subtitle:    b.faqSection.subtitle    || '',
        description: b.faqSection.description || '',
        active:      b.faqSection.active !== false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        faqs: (b.faqSection.faqs || []).map((f: any, i: number) => ({
          _type:        'object',
          _key:         f._key || ('faq-' + i),
          question:     f.question     || '',
          answer:       f.answer       || '',
          displayOrder: Number(f.displayOrder != null ? f.displayOrder : i),
          active:       f.active !== false,
        })),
      },
    } : {}),
    cta: {
      headline:    ct.headline    || '',
      description: ct.description || '',
      buttonText:  ct.buttonText  || '',
      buttonUrl:   ct.buttonUrl   || '',
      active:      ct.active !== false,
      ...(ct.backgroundImageRef ? { backgroundImage: buildImg(ct.backgroundImageRef) } : {}),
    },
    seoTitle:       b.seoTitle       || '',
    seoDescription: b.seoDescription || '',
    canonicalUrl:   b.canonicalUrl   || '',
    ...(b.ogImageRef ? { ogImage: buildImg(b.ogImageRef) } : {}),
    updatedAt: new Date().toISOString(),
  }
}

// ── Route Handlers ────────────────────────────────────────────────────────────

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS })
}

export async function GET(request: NextRequest) {
  const isAdmin     = SECRET && request.headers.get('x-admin-secret') === SECRET
  const slug        = request.nextUrl.searchParams.get('slug')
  const detailSlug  = request.nextUrl.searchParams.get('detailSlug')

  // Public detail page
  if (detailSlug && !isAdmin) {
    try {
      const r = await fetch(
        `${QUERY_URL}?query=${encodeURIComponent(DETAIL_PUBLIC_GROQ)}&%24slug=${encodeURIComponent(JSON.stringify(detailSlug))}`,
        { headers: HDR() }
      )
      const d = await r.json()
      return NextResponse.json(d.result || null, { headers: CORS })
    } catch (err: unknown) {
      return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
    }
  }

  // Public index page
  if (slug && !isAdmin) {
    try {
      const r = await fetch(
        `${QUERY_URL}?query=${encodeURIComponent(PUBLIC_GROQ)}&%24slug=${encodeURIComponent(JSON.stringify(slug))}`,
        { headers: HDR() }
      )
      const d = await r.json()
      return NextResponse.json(d.result || null, { headers: CORS })
    } catch (err: unknown) {
      return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
    }
  }

  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })

  // Admin detail page
  if (detailSlug) {
    try {
      const r = await fetch(
        `${QUERY_URL}?query=${encodeURIComponent(DETAIL_ADMIN_GROQ)}&%24slug=${encodeURIComponent(JSON.stringify(detailSlug))}`,
        { headers: HDR() }
      )
      const d = await r.json()
      return NextResponse.json(d.result || null, { headers: CORS })
    } catch (err: unknown) {
      return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
    }
  }

  // Admin index page
  if (slug) {
    try {
      const r = await fetch(
        `${QUERY_URL}?query=${encodeURIComponent(ADMIN_GROQ)}&%24slug=${encodeURIComponent(JSON.stringify(slug))}`,
        { headers: HDR() }
      )
      const d = await r.json()
      return NextResponse.json(d.result || null, { headers: CORS })
    } catch (err: unknown) {
      return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
    }
  }

  return NextResponse.json({ error: 'slug or detailSlug required' }, { status: 400, headers: CORS })
}

export async function POST(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })

  try {
    const body      = await request.json()
    const ylopoCode = body.ylopoCode || {}
    if (!ylopoCode.locations || !ylopoCode.locations.length) {
      return NextResponse.json({ error: 'ylopoCode must include at least one location.' }, { status: 400, headers: CORS })
    }
    const limit  = Math.min(Number(ylopoCode.limit) || 12, 50)
    const DOMAIN = process.env.YLOPO_DOMAIN || 'search.palisaderealty.com'
    const code   = { ...ylopoCode, limit }
    const params = new URLSearchParams({ s: JSON.stringify(code), partyWebsite: DOMAIN })

    const r = await fetch(`https://portal.ylopo.com/api/1.0/listings?${params}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer':    `https://${DOMAIN}/`,
        'Accept':     'application/json',
      },
      signal: AbortSignal.timeout(12000),
    })

    if (!r.ok) {
      const txt = await r.text()
      return NextResponse.json({ error: 'Ylopo API error: ' + txt.slice(0, 200), listings: [] }, { status: 502, headers: CORS })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw   = await r.json() as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = Array.isArray(raw) ? raw : (raw.results || raw.listings || raw.data || []) as any[]
    const listings = items.slice(0, limit).map((x: Record<string, unknown>) => normalizeYlopoListing(x, DOMAIN))
    return NextResponse.json({ listings, total: items.length }, { headers: CORS })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message, listings: [] }, { status: 500, headers: CORS })
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })
  try {
    const b   = await request.json()
    const doc = b.docType === 'communityDetailPage' ? buildDetailDoc(b) : buildDoc(b)
    const r   = await fetch(MUTATE_URL, {
      method: 'POST', headers: HDR(),
      body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
    })
    const d = await r.json()
    return NextResponse.json(d, { status: r.ok ? 200 : 400, headers: CORS })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
  }
}
