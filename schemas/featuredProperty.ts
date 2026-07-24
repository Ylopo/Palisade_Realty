import { defineField, defineType } from 'sanity'

export const featuredProperty = defineType({
  name: 'featuredProperty',
  title: 'Featured Property',
  type: 'document',
  fields: [
    defineField({ name: 'address', title: 'Street Address', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'address', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'city', title: 'City', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'state', title: 'State', type: 'string', initialValue: 'CA' }),
    defineField({ name: 'zip', title: 'ZIP Code', type: 'string' }),
    defineField({ name: 'mls', title: 'MLS #', type: 'string' }),
    defineField({ name: 'price', title: 'Price', type: 'number' }),
    defineField({ name: 'beds', title: 'Bedrooms', type: 'number' }),
    defineField({ name: 'baths', title: 'Bathrooms', type: 'number' }),
    defineField({ name: 'sqft', title: 'Square Feet', type: 'number' }),
    defineField({ name: 'lotSize', title: 'Lot Size', type: 'string' }),
    defineField({ name: 'yearBuilt', title: 'Year Built', type: 'number' }),
    defineField({ name: 'neighborhood', title: 'Neighborhood', type: 'string' }),
    defineField({ name: 'communitySlug', title: 'Community Slug (for link)', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline (short)', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 5 }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'heroImage', title: 'Hero Image URL', type: 'url' }),
    defineField({
      name: 'gallery',
      title: 'Gallery Image URLs',
      type: 'array',
      of: [{ type: 'url' }],
    }),
    defineField({ name: 'ylopoDetailUrl', title: 'YLOPO Detail URL', type: 'url' }),
    defineField({ name: 'agentName', title: 'Listing Agent', type: 'string', initialValue: 'Hedda Parashos' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['active', 'pending', 'sold'] },
      initialValue: 'active',
    }),
    defineField({ name: 'featured', title: 'Show on Homepage Carousel', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'address', subtitle: 'city' },
    prepare({ title, subtitle }) {
      return { title, subtitle }
    },
  },
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
