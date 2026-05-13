import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project Case Studies',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'e.g., Fintech, Healthcare, E-Commerce',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
    }),
    defineField({
      name: 'mainImage',
      title: 'Project Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})