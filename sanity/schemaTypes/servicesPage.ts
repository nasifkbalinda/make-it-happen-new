import { defineArrayMember, defineField, defineType } from 'sanity'

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services Page Settings',
  type: 'document',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker Text', type: 'string', description: 'e.g., SERVICES' }),
    defineField({ name: 'heading', title: 'Page Heading', type: 'string' }),
    defineField({ name: 'description', title: 'Page Description', type: 'text' }),
    defineField({ name: 'processKicker', title: 'Process label', type: 'string', description: 'e.g. "How we work"' }),
    defineField({ name: 'processHeading', title: 'Process heading', type: 'string' }),
    defineField({
      name: 'processSteps',
      title: 'Process steps',
      type: 'array',
      description: 'The steps of an engagement, in order. Four works best.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'processStep',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
    }),
  ],
})