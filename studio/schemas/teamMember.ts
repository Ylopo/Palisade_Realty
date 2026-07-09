import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      initialValue: 'Real Estate Agent',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      initialValue: 'Las Vegas, NV',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Digits only or formatted — e.g. 7026050759',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Headshot Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      description: 'Brief description shown on the team card (3 lines max).',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Personal Website URL',
      type: 'url',
    }),
    defineField({
      name: 'department',
      title: 'Department / Filter Category',
      type: 'string',
      description: 'Used for the filter buttons on the Team page.',
      options: {
        list: [
          { title: 'Leadership', value: 'leader'  },
          { title: 'REALTOR®',   value: 'realtor' },
          { title: 'Agent',      value: 'agent'   },
        ],
        layout: 'radio',
      },
      initialValue: 'agent',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Photo Alt Text',
      type: 'string',
      description: 'Accessibility description for the headshot photo.',
    }),
    defineField({
      name: 'fullBio',
      title: 'Full Bio (Team Page)',
      type: 'text',
      rows: 5,
      description: 'Longer bio displayed on the Team page (optional).',
    }),
    defineField({
      name: 'bioEs',
      title: 'Short Bio (Spanish)',
      type: 'text',
      rows: 3,
      description: 'Spanish translation of the short bio. Leave blank to fall back to English.',
    }),
    defineField({
      name: 'fullBioEs',
      title: 'Full Bio (Spanish)',
      type: 'text',
      rows: 5,
      description: 'Spanish translation of the full bio. Leave blank to fall back to English.',
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      description: 'Include this member in the homepage team carousel.',
      initialValue: true,
    }),
    defineField({
      name: 'showOnTeamPage',
      title: 'Show on Team Page',
      type: 'boolean',
      description: 'Include this member on the Team page grid.',
      initialValue: true,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Uncheck to hide from the homepage without deleting.',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Badge',
      type: 'boolean',
      description: 'Show a "Featured" label on this card.',
      initialValue: false,
    }),

    // ── Agent Detail Page ────────────────────────────────────────────────────
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Used to build the agent detail page URL (e.g. frank-rinaldi).',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      description: 'Shown on the agent detail page sidebar (e.g. "Team Leader · REALTOR®").',
    }),

    // Hero section
    defineField({ name: 'heroImage',       title: 'Hero / Banner Image',    type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroHeadline',    title: 'Hero Headline',          type: 'string' }),
    defineField({ name: 'heroSubheadline', title: 'Hero Subheadline',       type: 'string' }),
    defineField({ name: 'heroCTAText',     title: 'Hero CTA Button Text',   type: 'string' }),
    defineField({ name: 'heroCTAUrl',      title: 'Hero CTA Button URL',    type: 'url' }),

    // Extended contact
    defineField({ name: 'licenseNumber',  title: 'License Number',             type: 'string' }),
    defineField({ name: 'officePhone',    title: 'Office Phone',               type: 'string' }),
    defineField({ name: 'address',        title: 'Office Address',             type: 'string' }),
    defineField({ name: 'appointmentUrl', title: 'Appointment / Calendly URL', type: 'url' }),
    defineField({ name: 'youtubeUrl',     title: 'YouTube URL',                type: 'url' }),

    // Biography & content
    defineField({ name: 'biographyHeadline', title: 'Biography Section Headline', type: 'string' }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      description: 'Shown in the bio stats grid (e.g. "500+" / "Homes Sold").',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'value',        title: 'Value',         type: 'string' }),
          defineField({ name: 'label',        title: 'Label',         type: 'string' }),
          defineField({ name: 'displayOrder', title: 'Order',         type: 'number', initialValue: 0 }),
          defineField({ name: 'active',       title: 'Active',        type: 'boolean', initialValue: true }),
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      })],
    }),
    defineField({
      name: 'featuredListings',
      title: 'Featured Listings',
      type: 'array',
      description: 'Listings shown on this agent\'s detail page.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'featuredListing' }] })],
    }),

    // Map / Service Area
    defineField({
      name: 'mapArea',
      title: 'Map / Service Area',
      type: 'object',
      fields: [
        defineField({ name: 'centerLat',       title: 'Center Latitude',    type: 'number' }),
        defineField({ name: 'centerLng',       title: 'Center Longitude',   type: 'number' }),
        defineField({ name: 'zoom',            title: 'Zoom Level',         type: 'number', initialValue: 10 }),
        defineField({ name: 'areaTitle',       title: 'Section Title',      type: 'string' }),
        defineField({ name: 'areaDescription', title: 'Section Description',type: 'string' }),
        defineField({
          name: 'serviceAreas',
          title: 'Service Areas',
          type: 'array',
          of: [defineArrayMember({
            type: 'object',
            fields: [
              defineField({ name: 'name', title: 'Area Name',   type: 'string' }),
              defineField({ name: 'sub',  title: 'Sub-label',   type: 'string' }),
              defineField({ name: 'lat',  title: 'Latitude',    type: 'number' }),
              defineField({ name: 'lng',  title: 'Longitude',   type: 'number' }),
            ],
            preview: { select: { title: 'name', subtitle: 'sub' } },
          })],
        }),
      ],
    }),

    // SEO
    defineField({ name: 'seoTitle',       title: 'SEO Title',       type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3 }),
    defineField({ name: 'ogImage',        title: 'OG / Social Image', type: 'image' }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
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
