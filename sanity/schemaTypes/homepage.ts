import { defineField, defineType } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'The big main title on the homepage',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      description: 'The smaller paragraph under the title',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'Upload the 3D hands/globe image here',
      options: { hotspot: true },
    }),
    
    // --- CTA Buttons ---
    defineField({
      name: 'primaryCtaText',
      title: 'Primary Button Text',
      type: 'string',
      description: 'e.g., Get Started',
    }),
    defineField({
      name: 'primaryCtaLink',
      title: 'Primary Button Link',
      type: 'string',
      description: 'e.g., /contact',
    }),
    defineField({
      name: 'secondaryCtaText',
      title: 'Secondary Button Text',
      type: 'string',
      description: 'e.g., Learn more',
    }),
    defineField({
      name: 'secondaryCtaLink',
      title: 'Secondary Button Link',
      type: 'string',
      description: 'e.g., /about',
    }),

    // --- Featured Case Studies Section ---
    defineField({
      name: 'featuredProjectsKicker',
      title: 'Featured Projects Kicker',
      type: 'string',
      description: 'e.g., Featured Case Studies',
    }),
    defineField({
      name: 'featuredProjectsTitle',
      title: 'Featured Projects Title',
      type: 'text',
      description: 'The main heading. Press Enter to create new lines just like the design!',
    }),
    defineField({
      name: 'featuredProjectsDescription',
      title: 'Featured Projects Description',
      type: 'text',
    }),

    // --- Dynamic Stats ---
    defineField({
      name: 'stat1Label',
      title: 'Stat 1 Label (e.g., Projects Delivered)',
      type: 'string',
    }),
    defineField({
      name: 'stat1Value',
      title: 'Stat 1 Value (e.g., 150+)',
      type: 'string',
    }),
    defineField({
      name: 'stat2Label',
      title: 'Stat 2 Label (e.g., Global Partners)',
      type: 'string',
    }),
    defineField({
      name: 'stat2Value',
      title: 'Stat 2 Value (e.g., 40+)',
      type: 'string',
    }),
    defineField({
      name: 'stat3Label',
      title: 'Stat 3 Label (e.g., Team Experts)',
      type: 'string',
    }),
    defineField({
      name: 'stat3Value',
      title: 'Stat 3 Value (e.g., 25+)',
      type: 'string',
    }),
    defineField({
      name: 'stat4Label',
      title: 'Stat 4 Label (e.g., Client Retention)',
      type: 'string',
    }),
    defineField({
      name: 'stat4Value',
      title: 'Stat 4 Value (e.g., 98%)',
      type: 'string',
    }),
  ],
})