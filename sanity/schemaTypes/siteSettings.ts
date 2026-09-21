import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Global Site Settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'social', title: 'Social Media' },
  ],
  fields: [
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      group: 'brand',
      description: 'Upload your brand logo here. If left blank, the site will display the fallback text.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'siteTitle',
      title: 'Site Title (Fallback Text)',
      type: 'string',
      group: 'brand',
      description: 'Text to show in the navigation bar if no logo image is uploaded (e.g., Make It Happen).',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social media links',
      type: 'array',
      group: 'social',
      description:
        'Add as many networks as you like. Each one shows as its official brand icon in the footer, the mobile menu and the contact page. Drag to reorder — the site follows this order.',
      of: [defineArrayMember({ type: 'socialLink' })],
      validation: (Rule) => Rule.unique(),
    }),
  ],
})
