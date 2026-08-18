import { defineField, defineType } from "sanity"

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Full Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "headshot", title: "Headshot Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "headshotUrl", title: "Headshot URL (fallback)", type: "string" }),
    defineField({ name: "title", title: "Role / Title", type: "string" }),
    defineField({ name: "isLeader", title: "Leadership Team", type: "boolean" }),
    defineField({ name: "bio", title: "Biography", type: "text" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "licenseNumber", title: "License Number", type: "string" }),
    defineField({
      name: "languages",
      title: "Languages Spoken",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "specialties",
      title: "Specialties",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "subdomain", title: "Agent Subdomain", type: "string" }),
    defineField({ name: "featured", title: "Featured", type: "boolean" }),
    defineField({ name: "order", title: "Sort Order", type: "number" }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Name A–Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "title", media: "headshot" },
  },
})
