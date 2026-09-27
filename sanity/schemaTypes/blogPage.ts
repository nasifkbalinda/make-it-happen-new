import { defineField, defineType } from 'sanity'

export const blogPage = defineType({
  name: 'blogPage',
  title: 'Blog Page Settings',
  type: 'document',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker Text', type: 'string', description: 'e.g., JOURNAL' }),
    defineField({ name: 'heading', title: 'Page Heading', type: 'string' }),
    defineField({ name: 'description', title: 'Page Description', type: 'text' }),
    defineField({ name: 'featuredLabel', title: 'Featured post label', type: 'string', description: 'Shown on the newest post, e.g. "Latest"' }),
    defineField({ name: 'moreHeading', title: '"More posts" heading on articles', type: 'string', description: 'Shown under each article, e.g. "Keep reading"' }),
  ],
})