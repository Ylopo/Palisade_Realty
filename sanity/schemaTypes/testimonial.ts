import { defineField, defineType } from "sanity"

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "authorName", title: "Client Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "authorTitle", title: "Client Description", type: "string" }),
    defineField({ name: "quote", title: "Testimonial Quote", type: "text", validation: (r) => r.required() }),
    defineField({ name: "rating", title: "Star Rating (1–5)", type: "number" }),
    defineField({ name: "source", title: "Review Source", type: "string" }),
    defineField({ name: "sourceUrl", title: "Review URL", type: "url" }),
    defineField({ name: "date", title: "Review Date", type: "date" }),
    defineField({ name: "featured", title: "Featured", type: "boolean" }),
    defineField({ name: "order", title: "Sort Order", type: "number" }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Newest First", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "authorName", subtitle: "quote" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? String(subtitle).slice(0, 80) : "",
    }),
  },
})
