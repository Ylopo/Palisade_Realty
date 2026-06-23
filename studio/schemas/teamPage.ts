import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'teamPage',
  title: 'Team Page Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow',     title: 'Eyebrow Text',   type: 'string', description: 'e.g. "Licensed Professionals"' }),
        defineField({ name: 'headline',    title: 'Headline (H1)',  type: 'string' }),
        defineField({ name: 'subheadline', title: 'Subheadline',    type: 'text', rows: 2 }),
        defineField({ name: 'bgImage',     title: 'Background Image', type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Stats Bar',
      type: 'object',
      fields: [
        defineField({ name: 's1Value', title: 'Stat 1 Value', type: 'string', description: 'e.g. "29"' }),
        defineField({ name: 's1Label', title: 'Stat 1 Label', type: 'string', description: 'e.g. "Licensed Agents"' }),
        defineField({ name: 's2Value', title: 'Stat 2 Value', type: 'string' }),
        defineField({ name: 's2Label', title: 'Stat 2 Label', type: 'string' }),
        defineField({ name: 's3Value', title: 'Stat 3 Value', type: 'string' }),
        defineField({ name: 's3Label', title: 'Stat 3 Label', type: 'string' }),
        defineField({ name: 's4Value', title: 'Stat 4 Value', type: 'string' }),
        defineField({ name: 's4Label', title: 'Stat 4 Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'pageContent',
      title: 'Team Grid Section',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow',  title: 'Eyebrow Text', type: 'string' }),
        defineField({ name: 'title',    title: 'Section Title (H2)', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Section Subtitle',   type: 'string' }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'CTA Section',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow',  title: 'Eyebrow Text',      type: 'string' }),
        defineField({ name: 'headline', title: 'Headline',           type: 'string' }),
        defineField({ name: 'btn1Text', title: 'Button 1 Text',      type: 'string' }),
        defineField({ name: 'btn1Url',  title: 'Button 1 URL',       type: 'url' }),
        defineField({ name: 'btn2Text', title: 'Button 2 Text',      type: 'string' }),
        defineField({ name: 'btn2Url',  title: 'Button 2 URL',       type: 'url' }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({ name: 'title',       title: 'Page Title (SEO)',    type: 'string' }),
        defineField({ name: 'description', title: 'Meta Description',    type: 'text', rows: 2 }),
        defineField({ name: 'ogImage',     title: 'OG / Social Image',   type: 'image', options: { hotspot: true } }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Team Page Settings' }
    },
  },
})
