import { defineArrayMember, defineField, defineType } from 'sanity'

export const contact = defineType({
  name: 'contact',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Label',
      type: 'string',
      description: 'The small pill above the heading, e.g. "Contact".',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
    }),
    defineField({ name: 'officeHours', title: 'Office hours', type: 'string', description: 'e.g. "Mon–Fri, 8:00–18:00 EAT"' }),
    defineField({ name: 'formHeading', title: 'Form heading', type: 'string' }),
    defineField({
      name: 'formNote',
      title: 'Form note',
      type: 'text',
      rows: 2,
      description: 'Shown under the send buttons.',
    }),
    defineField({
      name: 'serviceOptions',
      title: '"What do you need?" options',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'budgetOptions',
      title: 'Budget options',
      type: 'array',
      description: 'Leave empty to hide the budget question.',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
})
