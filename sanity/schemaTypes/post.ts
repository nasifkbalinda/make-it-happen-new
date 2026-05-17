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
export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
      description: 'Short summary shown in listings.',
    }),
    // The WordPress-style Rich Text Editor
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'array',
      of: [
        { type: 'block' }, // Enables headings, bold, links, lists, etc.
        { type: 'image', options: { hotspot: true } } // Enables inline images
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'mainImage',
    },
    prepare({ title, author, media }) {
      return {
        title: title ?? 'Untitled',
        subtitle: author ? `By ${author}` : undefined,
        media,
      }
    },
  },
})