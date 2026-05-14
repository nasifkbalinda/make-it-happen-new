import { defineField, defineType } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    {
      name: 'stat1Label',
      title: 'Stat 1 Label (e.g., Projects Delivered)',
      type: 'string',
    },
    {
      name: 'stat1Value',
      title: 'Stat 1 Value (e.g., 150+)',
      type: 'string',
    },
    {
      name: 'stat2Label',
      title: 'Stat 2 Label (e.g., Global Partners)',
      type: 'string',
    },
    {
      name: 'stat2Value',
      title: 'Stat 2 Value (e.g., 40+)',
      type: 'string',
    },
    {
      name: 'stat3Label',
      title: 'Stat 3 Label (e.g., Team Experts)',
      type: 'string',
    },
    {
      name: 'stat3Value',
      title: 'Stat 3 Value (e.g., 25+)',
      type: 'string',
    },
    {
      name: 'stat4Label',
      title: 'Stat 4 Label (e.g., Client Retention)',
      type: 'string',
    },
    {
      name: 'stat4Value',
      title: 'Stat 4 Value (e.g., 98%)',
      type: 'string',
    },
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
      options: {
        hotspot: true, // Allows you to crop the image inside Sanity
      },
    }),
  ],
})