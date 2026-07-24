import { defineField, defineType } from 'sanity'

export const agent = defineType({
  name: 'agent',
  title: 'Agent',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Full Name', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title / Role',
      type: 'string',
      initialValue: 'REALTOR®',
    }),
    defineField({
      name: 'isLeadership',
      title: 'Leadership Team',
      type: 'boolean',
      initialValue: false,
      description: 'Show in the leadership section (above the agent grid)',
    }),
    defineField({ name: 'photo', title: 'Headshot', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Direct Phone', type: 'string' }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 5 }),
    defineField({
      name: 'areasServed',
      title: 'Areas Served',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', description: 'Lower = earlier in grid' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'photo' },
  },
  orderings: [
    { title: 'Leadership First', name: 'leadershipFirst', by: [{ field: 'isLeadership', direction: 'desc' }, { field: 'order', direction: 'asc' }] },
    { title: 'Name A→Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
})
