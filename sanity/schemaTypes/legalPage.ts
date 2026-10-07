import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Legal pages (Privacy Policy, Terms of Service).
 *
 * Two singleton documents use this type, with the IDs `privacy` and `terms`,
 * wired up in sanity/structure.ts and read by /privacy and /terms.
 */
export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown under the title.',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last updated',
      type: 'date',
      description:
        'Shown at the top of the page. Bump this whenever you change the wording — visitors rely on it.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      description: 'The policy itself. Use Heading 2 for each numbered section.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'lastUpdated' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled legal page',
        subtitle: subtitle ? `Last updated ${subtitle}` : 'No date set',
      }
    },
  },
})
