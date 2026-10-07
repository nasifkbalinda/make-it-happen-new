import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Global Site Settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'social', title: 'Social Media' },
    { name: 'contact', title: 'Buttons & WhatsApp' },
    { name: 'cta', title: 'Closing call to action' },
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

    // --- Buttons & WhatsApp ---
    defineField({
      name: 'headerCtaText',
      title: 'Header button text',
      type: 'string',
      group: 'contact',
      description: 'The button at the top right of every page, e.g. "Start a project".',
    }),
    defineField({
      name: 'headerCtaLink',
      title: 'Header button link',
      type: 'string',
      group: 'contact',
      description: 'e.g. /contact',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp number',
      type: 'string',
      group: 'contact',
      description: 'International format, e.g. +256790879117. Every "Chat on WhatsApp" button uses it.',
    }),

    // --- Closing call to action (bottom of every page) ---
    defineField({ name: 'ctaKicker', title: 'Label', type: 'string', group: 'cta', description: 'e.g. "Get started"' }),
    defineField({ name: 'ctaHeading', title: 'Heading', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaDescription', title: 'Description', type: 'text', rows: 2, group: 'cta' }),
    defineField({ name: 'ctaPrimaryText', title: 'Main button text', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaPrimaryLink', title: 'Main button link', type: 'string', group: 'cta', description: 'e.g. /contact' }),
    defineField({ name: 'ctaWhatsappText', title: 'WhatsApp button text', type: 'string', group: 'cta', description: 'Leave empty to hide the WhatsApp button.' }),
  ],
})
