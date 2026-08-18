import type { AdminField } from "./fieldTypes"

export interface SettingsConfig {
  type: string
  docId?: string
  label: string
  group: string
  fields: AdminField[]
}

export const SETTINGS_CONFIG: Record<string, SettingsConfig> = {
  siteSettings: {
    type: "siteSettings",
    label: "Site Identity",
    group: "Global Settings",
    fields: [
      { key: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Palisade Realty" },
      { key: "tagline", label: "Tagline", type: "text", placeholder: "San Diego's Premier Independent Brokerage" },
      { key: "logo", label: "Logo", type: "image", withAlt: true },
      { key: "favicon", label: "Favicon", type: "image" },
      {
        key: "seoDefaults",
        label: "SEO Defaults",
        type: "object",
        itemFields: [
          { key: "title", label: "Default Title", type: "text", placeholder: "Palisade Realty | San Diego Real Estate" },
          { key: "description", label: "Default Meta Description", type: "textarea", rows: 3 },
          { key: "ogImage", label: "Default OG Image", type: "image" },
        ],
      },
    ],
  },

  contactInfo: {
    type: "contactInfo",
    docId: "siteSettings",
    label: "Contact Info",
    group: "Global Settings",
    fields: [
      { key: "phone", label: "Main Phone", type: "text", required: true, placeholder: "(619) 794-0218" },
      { key: "email", label: "Main Email", type: "text", required: true, placeholder: "info@palisaderealty.com" },
      { key: "address", label: "Office Address", type: "text", placeholder: "123 Main St, San Diego, CA 92101" },
      {
        key: "businessHours",
        label: "Business Hours",
        type: "repeater",
        itemFields: [
          { key: "days", label: "Days", type: "text", required: true, placeholder: "Mon–Fri" },
          { key: "hours", label: "Hours", type: "text", required: true, placeholder: "9:00 AM – 6:00 PM" },
        ],
      },
    ],
  },

  socialLinks: {
    type: "socialLinks",
    docId: "siteSettings",
    label: "Social Links",
    group: "Global Settings",
    fields: [
      { key: "facebook", label: "Facebook URL", type: "text", placeholder: "https://facebook.com/palisaderealty" },
      { key: "instagram", label: "Instagram URL", type: "text", placeholder: "https://instagram.com/palisaderealty" },
      { key: "linkedin", label: "LinkedIn URL", type: "text" },
      { key: "youtube", label: "YouTube URL", type: "text" },
      { key: "x", label: "X (Twitter) URL", type: "text" },
    ],
  },
}
