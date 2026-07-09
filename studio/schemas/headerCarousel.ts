import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'headerCarousel',
  title: 'Header Carousel',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Slide Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Internal name for this slide (not shown on website).',
    }),
    defineField({
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for screen readers and SEO.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional short note shown only in admin.',
    }),
    defineField({
      name: 'headline',
      title: 'Slide Headline',
      type: 'string',
      description: 'Overrides the hero headline while this slide is active (optional).',
    }),
    defineField({
      name: 'subheadline',
      title: 'Slide Subheadline',
      type: 'string',
      description: 'Overrides the hero subheadline while this slide is active (optional).',
    }),
    defineField({
      name: 'headlineEs',
      title: 'Slide Headline (Spanish)',
      type: 'string',
      description: 'Spanish translation of the slide headline (optional).',
    }),
    defineField({
      name: 'subheadlineEs',
      title: 'Slide Subheadline (Spanish)',
      type: 'string',
      description: 'Spanish translation of the slide subheadline (optional).',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Overrides the primary CTA button text for this slide (optional).',
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Button URL',
      type: 'string',
      description: 'Overrides the primary CTA button URL for this slide (optional).',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first.',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to hide this slide without deleting it.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'headline',
      media: 'image',
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
