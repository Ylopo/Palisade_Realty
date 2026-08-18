import { defineField, defineType } from "sanity"

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "companyName", title: "Company Name", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "favicon", title: "Favicon", type: "image" }),
    defineField({
      name: "seoDefaults",
      title: "SEO Defaults",
      type: "object",
      fields: [
        { name: "title", title: "Default Title", type: "string" },
        { name: "description", title: "Default Meta Description", type: "text" },
        { name: "ogImage", title: "Default OG Image", type: "image" },
      ],
    }),
    // Contact
    defineField({ name: "phone", title: "Main Phone", type: "string" }),
    defineField({ name: "email", title: "Main Email", type: "string" }),
    defineField({ name: "address", title: "Office Address", type: "string" }),
    defineField({
      name: "businessHours",
      title: "Business Hours",
      type: "array",
      of: [{ type: "object", fields: [
        { name: "days", title: "Days", type: "string" },
        { name: "hours", title: "Hours", type: "string" },
      ] }],
    }),
    // Social
    defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
    defineField({ name: "x", title: "X (Twitter) URL", type: "url" }),
  ],
  preview: {
    select: { title: "companyName" },
    prepare: ({ title }) => ({ title: title ?? "Site Settings" }),
  },
})
