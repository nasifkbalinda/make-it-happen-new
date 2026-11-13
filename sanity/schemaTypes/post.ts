import { defineField, defineType } from 'sanity'
import { SLUG_PATTERN, slugify } from '../../lib/slug'

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
      description:
        'The end of the article URL: makeithappen.ug/blog/<slug>. Click Generate rather than typing it. Lowercase letters, numbers and hyphens only — no slashes.',
      options: {
        source: 'title',
        maxLength: 96,
        // Sanity's default keeps "/" — a title like "Now/Never" would produce
        // a slug whose URL can never be reached.
        slugify: (input: string) => slugify(input, 96),
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const current = (value as { current?: string } | undefined)?.current
          if (!current) return true // `required` reports the empty case
          if (current.includes('/'))
            return 'Remove the slashes — the slug is only the last part of the URL. Click Generate to rebuild it.'
          if (!SLUG_PATTERN.test(current))
            return 'Use lowercase letters, numbers and single hyphens only (e.g. my-article-title). Click Generate to rebuild it.'
          return true
        }),
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