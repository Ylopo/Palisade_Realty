import { defineField, defineType } from 'sanity'

/**
 * Cron-generated SEO expansion pages (communities, condo buildings, lifestyle
 * hubs) from the phased niche-expansion plan. Served at /communities/<slug>
 * as a fallback when the slug isn't in lib/community-data.ts.
 */
export const communityPage = defineType({
  name: 'communityPage',
  title: 'Community / Niche Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page H1', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', validation: (r) => r.required() }),
    defineField({ name: 'name', title: 'Display name', type: 'string' }),
    defineField({
      name: 'pageType',
      title: 'Page type',
      type: 'string',
      options: { list: ['community', 'neighborhood', 'condo-building', 'condo-hub', 'lifestyle-hub', 'enclave'] },
    }),
    defineField({ name: 'phase', title: 'Plan phase', type: 'number' }),
    defineField({ name: 'targetKeyword', title: 'Target keyword', type: 'string' }),
    defineField({ name: 'searchVolume', title: 'Search volume /mo', type: 'number' }),
    defineField({ name: 'heroTagline', title: 'Hero tagline', type: 'string' }),
    defineField({ name: 'heroDescription', title: 'Hero description', type: 'text' }),
    defineField({
      name: 'stats',
      title: 'Hero stats',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'value', type: 'string' },
        { name: 'label', type: 'string' },
      ] }],
    }),
    defineField({
      name: 'sections',
      title: 'Body sections',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'heading', type: 'string' },
        { name: 'paragraphs', type: 'array', of: [{ type: 'text' }] },
      ] }],
    }),
    defineField({
      name: 'quickFacts',
      title: 'Quick facts',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'label', type: 'string' },
        { name: 'value', type: 'string' },
      ] }],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'question', type: 'string' },
        { name: 'answer', type: 'text' },
      ] }],
    }),
    defineField({
      name: 'idxLocation',
      title: 'IDX widget location',
      type: 'object',
      fields: [
        { name: 'city', type: 'string' },
        { name: 'state', type: 'string' },
        { name: 'neighborhood', type: 'string' },
      ],
    }),
    defineField({ name: 'idxPropertyTypes', title: 'IDX property types', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'fallbackIdxLocation',
      title: 'Fallback IDX location (when no listings)',
      type: 'object',
      fields: [
        { name: 'city', type: 'string' },
        { name: 'state', type: 'string' },
        { name: 'neighborhood', type: 'string' },
      ],
    }),
    defineField({
      name: 'nearby',
      title: 'Nearby communities',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'name', type: 'string' },
        { name: 'url', type: 'string' },
        { name: 'reason', type: 'text' },
      ] }],
    }),
    defineField({ name: 'metaTitle', title: 'Meta title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'text' }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime' }),
    defineField({ name: 'aiGenerated', title: 'AI generated', type: 'boolean' }),
    defineField({ name: 'sourceUrls', title: 'Research sources', type: 'array', of: [{ type: 'url' }] }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'pageType' },
  },
})
