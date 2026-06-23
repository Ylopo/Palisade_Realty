import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'featuredListing',
  title: 'Featured Listing',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Listing Title',
      type: 'string',
      description: 'e.g. "Stunning Henderson Estate"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'featured',
      title: 'Show on Homepage',
      type: 'boolean',
      description: 'Toggle on to display this listing in the Featured Listings section.',
      initialValue: true,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first. Use whole numbers (1, 2, 3…).',
      initialValue: 0,
    }),
    defineField({
      name: 'status',
      title: 'Status Badge',
      type: 'string',
      options: {
        list: [
          { title: 'For Sale', value: 'for-sale' },
          { title: 'Just Listed', value: 'just-listed' },
          { title: 'Open House', value: 'open-house' },
          { title: 'Under Contract', value: 'under-contract' },
          { title: 'Price Reduced', value: 'price-reduced' },
          { title: 'Coming Soon', value: 'coming-soon' },
          { title: 'Sold', value: 'sold' },
        ],
        layout: 'radio',
      },
      initialValue: 'for-sale',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g. "$1,250,000" or "Contact for price"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({ name: 'street', title: 'Street', type: 'string' }),
        defineField({ name: 'city',   title: 'City',   type: 'string' }),
        defineField({ name: 'state',  title: 'State',  type: 'string', initialValue: 'NV' }),
        defineField({ name: 'zip',    title: 'ZIP',    type: 'string' }),
      ],
    }),
    defineField({
      name: 'bedrooms',
      title: 'Bedrooms',
      type: 'number',
    }),
    defineField({
      name: 'bathrooms',
      title: 'Bathrooms',
      type: 'number',
    }),
    defineField({
      name: 'squareFootage',
      title: 'Square Footage',
      type: 'number',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Photos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Optional teaser text shown on the card.',
    }),
    defineField({
      name: 'listingUrl',
      title: 'Listing URL',
      type: 'url',
      description: 'Full link to the MLS or detail page.',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Uncheck to hide this listing from the homepage without deleting it.',
      initialValue: true,
    }),
    defineField({
      name: 'externalListingId',
      title: 'External Listing ID',
      type: 'string',
      description: 'Numeric ID from the Ylopo search site (auto-filled on import).',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'price',
      media: 'mainImage',
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
})
