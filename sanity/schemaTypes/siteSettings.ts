import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Global Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      description: 'Upload your brand logo here. If left blank, the site will display the fallback text.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'siteTitle',
      title: 'Site Title (Fallback Text)',
      type: 'string',
      description: 'Text to show in the navigation bar if no logo image is uploaded (e.g., Make It Happen).',
    }),
  ],
})