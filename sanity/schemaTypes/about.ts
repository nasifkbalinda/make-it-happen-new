import { defineArrayMember, defineField, defineType } from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'About Us',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'e.g. “Our Story”',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'A short, catchy line under the heading',
    }),
    defineField({
      name: 'mainDescription',
      title: 'Main description',
      type: 'text',
      rows: 8,
      description: 'Primary story copy (use blank lines between paragraphs)',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured image',
      type: 'image',
      description: 'Team or group photo',
      options: { hotspot: true },
    }),
    defineField({
      name: 'valuesList',
      title: 'Core values',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'aboutCoreValue',
          title: 'Core value',
          fields: [
            defineField({
              name: 'valueTitle',
              title: 'Title',
              type: 'string',
              description: 'e.g. “Excellence”',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'valueDescription',
              title: 'Description',
              type: 'text',
              rows: 4,
            }),
          ],
          preview: {
            select: { title: 'valueTitle', subtitle: 'valueDescription' },
            prepare({ title, subtitle }) {
              return {
                title: title ?? 'Untitled value',
                subtitle: subtitle ? String(subtitle).slice(0, 80) : undefined,
              }
            },
          },
        }),
      ],
    }),
  ],
})
