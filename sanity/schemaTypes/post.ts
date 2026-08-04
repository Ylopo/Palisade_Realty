import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['Buyer', 'Seller', 'Homeowner', 'General'] },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', validation: (R) => R.required() }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({ name: 'author', title: 'Author', type: 'string' }),
    defineField({ name: 'readTime', title: 'Read Time (minutes)', type: 'number' }),
  ],
  preview: {
    select: { title: 'title', category: 'category', media: 'coverImage' },
    prepare({ title, category, media }) {
      return { title, subtitle: category, media }
    },
  },
  orderings: [{ title: 'Published Date (newest first)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
})
