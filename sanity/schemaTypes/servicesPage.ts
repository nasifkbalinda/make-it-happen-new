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