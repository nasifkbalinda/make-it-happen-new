import { defineField, defineType } from 'sanity'

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services Page Settings',
  type: 'document',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker Text', type: 'string', description: 'e.g., SERVICES' }),
    defineField({ name: 'heading', title: 'Page Heading', type: 'string' }),
    defineField({ name: 'description', title: 'Page Description', type: 'text' }),
  ],
})
export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A 1–2 sentence overview for the card.',
      rows: 3,
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points shown on the service card.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      description: 'Used as the card background.',
      options: { hotspot: true },
    }),
  ],
})
