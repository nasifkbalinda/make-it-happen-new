import { defineArrayMember, defineField, defineType } from 'sanity'

export const footer = defineType({
  name: 'footer',
  title: 'Site Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'companyText',
      title: 'Company text',
      type: 'text',
      rows: 4,
      description: 'Short blurb shown next to the logo.',
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City, region, or one-line address.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links (legacy)',
      type: 'array',
      description:
        'Deprecated — manage social media under Global Site Settings → Social Media. Links kept here are still shown if Global Site Settings has none.',
      of: [defineArrayMember({ type: 'socialLink' })],
      readOnly: true,
    }),
  ],
})
