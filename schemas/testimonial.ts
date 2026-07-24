import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'clientName', title: 'Client Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'location', title: 'Location (e.g. La Jolla, CA)', type: 'string' }),
    defineField({ name: 'rating', title: 'Rating (1–5)', type: 'number', validation: (R) => R.min(1).max(5) }),
    defineField({ name: 'body', title: 'Quote', type: 'text', rows: 4, validation: (R) => R.required() }),
    defineField({ name: 'agentName', title: 'Agent Name (if specific)', type: 'string' }),
    defineField({
      name: 'transactionType',
      title: 'Transaction Type',
      type: 'string',
      options: { list: ['Buyer', 'Seller', 'Both'] },
    }),
    defineField({ name: 'publishedAt', title: 'Date', type: 'date' }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'clientName', subtitle: 'location' },
  },
  orderings: [{ title: 'Newest first', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
})
