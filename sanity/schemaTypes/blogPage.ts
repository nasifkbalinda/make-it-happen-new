import { defineField, defineType } from 'sanity'

export const blogPage = defineType({
  name: 'blogPage',
  title: 'Blog Page Settings',
  type: 'document',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker Text', type: 'string', description: 'e.g., JOURNAL' }),
    defineField({ name: 'heading', title: 'Page Heading', type: 'string' }),
    defineField({ name: 'description', title: 'Page Description', type: 'text' }),
  ],
})