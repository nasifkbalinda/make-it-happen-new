import { defineField, defineType } from 'sanity'

export const projectsPage = defineType({
  name: 'projectsPage',
  title: 'Projects Page Settings',
  type: 'document',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker Text', type: 'string', description: 'e.g., PORTFOLIO' }),
    defineField({ name: 'heading', title: 'Page Heading', type: 'string' }),
    defineField({ name: 'description', title: 'Page Description', type: 'text' }),
  ],
})
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
      name: 'projectUrl',
      title: 'Live Project URL (Optional)',
      type: 'url',
      description: 'Add the link to the live website (e.g., https://example.com). If filled, clicking the project will open this link in a new tab.',
    }),
    defineField({
      name: 'slug',
      title: 'Internal Slug (Optional)',
      type: 'slug',
      description: 'Click "Generate" to create a URL for an internal case study page (e.g., /projects/my-cool-project).',
      options: {
        source: 'title',
        maxLength: 96,
      },
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