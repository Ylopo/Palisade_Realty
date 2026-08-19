import type { AdminField } from "./fieldTypes"

export interface CollectionConfig {
  type: string
  label: string
  singularLabel?: string
  sort: string
  hidden?: boolean
  archivable?: boolean
  layout?: string
  groupByField?: string
  groupLabels?: Record<string, string>
  listProjection?: string
  listFilter?: string
  cardPhotoField?: string
  cardTitleField?: string
  cardSubtitleField?: string
  fields: AdminField[]
}

export const COLLECTIONS_CONFIG: Record<string, CollectionConfig> = {
  teamMember: {
    type: "teamMember",
    label: "Team Members",
    singularLabel: "Team Member",
    sort: "displayOrder asc, name asc",
    cardPhotoField: "photo",
    cardTitleField: "name",
    cardSubtitleField: "role",
    fields: [
      { key: "name", label: "Full Name", type: "text", required: true },
      { key: "slug", label: "URL Slug", type: "slug", required: true, hint: "Used in the /team/<slug> URL" },
      { key: "photo", label: "Headshot Photo", type: "image", withAlt: true },
      {
        key: "photoUrl",
        label: "Headshot URL (fallback until photo is uploaded above)",
        type: "text",
        placeholder: "/assets/images/agents/first-last.jpg",
        hint: "Points to an existing asset path while a real upload hasn't been done yet",
      },
      { key: "role", label: "Role / Title", type: "text", required: true, placeholder: "REALTOR®" },
      { key: "department", label: "Department", type: "text", placeholder: "agent | leadership | support" },
      { key: "location", label: "Location", type: "text", placeholder: "San Diego, CA" },
      { key: "bio", label: "Short Bio", type: "textarea", rows: 4, placeholder: "Short bio shown on homepage/roster..." },
      { key: "fullBio", label: "Full Biography", type: "textarea", rows: 8, placeholder: "Full bio shown on agent profile page..." },
      { key: "phone", label: "Phone", type: "text", placeholder: "(619) 000-0000" },
      { key: "email", label: "Email", type: "text", placeholder: "agent@palisaderealty.com" },
      { key: "imageAlt", label: "Photo Alt Text", type: "text", placeholder: "Headshot of Jane Doe, REALTOR®" },
      { key: "linkedin", label: "LinkedIn URL", type: "text" },
      { key: "instagram", label: "Instagram URL", type: "text" },
      { key: "facebook", label: "Facebook URL", type: "text" },
      { key: "websiteUrl", label: "Personal Website URL", type: "text" },
      { key: "active", label: "Active (visible on site)", type: "boolean" },
      { key: "showOnHomepage", label: "Show on Homepage", type: "boolean" },
      { key: "showOnTeamPage", label: "Show on Team Page", type: "boolean" },
      { key: "featured", label: "Featured (highlighted position)", type: "boolean" },
      { key: "displayOrder", label: "Sort Order", type: "number", hint: "Lower numbers appear first" },
      { key: "subdomain", label: "Agent Subdomain", type: "text", placeholder: "e.g. erick for erick.palisaderealty.com" },
    ],
  },

  testimonial: {
    type: "testimonial",
    label: "Testimonials",
    singularLabel: "Testimonial",
    sort: "_createdAt desc",
    layout: "testimonial",
    cardTitleField: "authorName",
    cardSubtitleField: "authorTitle",
    fields: [
      { key: "authorName", label: "Client Name", type: "text", required: true },
      { key: "authorTitle", label: "Client Description", type: "text", placeholder: "Home Buyer, San Diego" },
      { key: "quote", label: "Testimonial Quote", type: "textarea", required: true, rows: 5 },
      { key: "rating", label: "Star Rating (1–5)", type: "number" },
      { key: "source", label: "Review Source", type: "text", placeholder: "Google, Zillow, Yelp…" },
      { key: "sourceUrl", label: "Review URL", type: "text" },
      { key: "date", label: "Review Date", type: "date" },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "order", label: "Sort Order", type: "number" },
    ],
  },

  communityPage: {
    type: "communityPage",
    label: "Community Pages",
    singularLabel: "Community Page",
    sort: "name asc",
    cardPhotoField: "heroBackgroundImage",
    cardTitleField: "title",
    cardSubtitleField: "pageType",
    fields: [
      { key: "title", label: "Page H1 Title", type: "text", required: true },
      { key: "slug", label: "URL Slug", type: "slug", required: true },
      { key: "name", label: "Display Name", type: "text" },
      {
        key: "pageType",
        label: "Page Type",
        type: "text",
        placeholder: "community | neighborhood | condo-building | lifestyle-hub",
      },
      { key: "targetKeyword", label: "Target Keyword", type: "text" },
      { key: "heroTagline", label: "Hero Tagline", type: "text" },
      { key: "heroDescription", label: "Hero Description", type: "textarea", rows: 3 },
      { key: "metaTitle", label: "Meta Title", type: "text" },
      { key: "metaDescription", label: "Meta Description", type: "textarea", rows: 2 },
      { key: "publishedAt", label: "Published At", type: "date" },
      {
        key: "aiGenerated",
        label: "AI Generated",
        type: "readonly",
        hint: "Edit complex sections (stats, FAQs, body) in Sanity Studio",
      },

      // ── Hero ──────────────────────────────────────────────────────────────
      {
        key: "heroBackgroundImage",
        label: "Hero — Background Image",
        type: "image",
        withAlt: false,
        hint: "Replaces the default community hero background photo. Upload a high-resolution landscape image.",
      },
      {
        key: "heroBackgroundAlt",
        label: "Hero — Image Alt Text",
        type: "text",
        placeholder: "Aerial view of Downtown San Diego waterfront",
        hint: "Screen-reader description of the hero image. Required for accessibility.",
      },

      // ── About ─────────────────────────────────────────────────────────────
      {
        key: "aboutHeading",
        label: "About — Section Heading",
        type: "text",
        placeholder: "About Downtown San Diego",
        hint: "Replaces the default 'About [Community Name]' heading.",
      },
      {
        key: "aboutDescription",
        label: "About — Description",
        type: "textarea",
        rows: 8,
        placeholder: "Write your overview paragraphs here...",
        hint: "Replaces the existing overview text. Separate paragraphs with a blank line.",
      },

      // ── Description ───────────────────────────────────────────────────────
      {
        key: "descriptionHeading",
        label: "Description — Section Heading",
        type: "text",
        placeholder: "Life in Downtown San Diego",
        hint: "Optional dedicated description section heading. Section only appears when Description Content is set.",
      },
      {
        key: "descriptionContent",
        label: "Description — Content",
        type: "textarea",
        rows: 10,
        placeholder: "Write additional editorial content here...",
        hint: "Optional extended description shown below the About section. Separate paragraphs with a blank line.",
      },

      // ── Lifestyle ─────────────────────────────────────────────────────────
      {
        key: "lifestyleHeading",
        label: "Lifestyle — Section Heading",
        type: "text",
        placeholder: "Urban Living, Effortlessly Connected",
        hint: "Replaces the default lifestyle section heading.",
      },
      {
        key: "lifestyleDescription",
        label: "Lifestyle — Description",
        type: "textarea",
        rows: 6,
        placeholder: "Write about the lifestyle experience...",
        hint: "Replaces the lifestyle body text. Separate paragraphs with a blank line.",
      },
      {
        key: "lifestyleImage",
        label: "Lifestyle — Section Image",
        type: "image",
        withAlt: false,
        hint: "Replaces the right-side image in the Lifestyle section.",
      },
      {
        key: "lifestyleImageAlt",
        label: "Lifestyle — Image Alt Text",
        type: "text",
        placeholder: "Gaslamp Quarter at sunset, Downtown San Diego",
      },

      // ── CTA ───────────────────────────────────────────────────────────────
      {
        key: "ctaBackgroundImage",
        label: "CTA — Background Image",
        type: "image",
        withAlt: false,
        hint: "Replaces the default CTA section background. Use a wide, atmospheric photo.",
      },
      {
        key: "ctaBackgroundAlt",
        label: "CTA — Background Alt Text",
        type: "text",
        placeholder: "San Diego skyline at dusk",
      },
      {
        key: "ctaHeading",
        label: "CTA — Heading",
        type: "text",
        placeholder: "Ready to Find Your Downtown San Diego Home?",
        hint: "Replaces the default 'Ready to Find Your … Home?' heading.",
      },
      {
        key: "ctaDescription",
        label: "CTA — Description",
        type: "textarea",
        rows: 3,
        placeholder: "Our agents have deep local knowledge...",
        hint: "Replaces the default CTA paragraph text.",
      },
      {
        key: "ctaButtonText",
        label: "CTA — Primary Button Text",
        type: "text",
        placeholder: "Call (619) 794-0218",
        hint: "Label for the primary CTA button. Defaults to the office phone number.",
      },
      {
        key: "ctaButtonUrl",
        label: "CTA — Primary Button URL",
        type: "text",
        placeholder: "tel:+16197940218",
        hint: "URL for the primary CTA button. Use tel:+1xxxxxxxxxx for phone links.",
      },
    ],
  },
}
