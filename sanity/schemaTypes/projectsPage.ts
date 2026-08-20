import { defineField, defineType } from 'sanity'

export const projectsPage = defineType({
  name: 'projectsPage',
  title: 'Projects Page Settings',
  type: 'document',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker Text', type: 'string', description: 'e.g., PORTFOLIO' }),
    defineField({ name: 'heading', title: 'Page Heading', type: 'string' }),
    defineField({ name: 'description', title: 'Page Description', type: 'text' }),
    
    // --- NEW "PLAYLIST" FIELD ---
    defineField({
      name: 'projectList',
      title: 'Arranged Projects (Playlist)',
      description: 'Add projects here and drag them up or down to set their exact order on the live website.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
  ],
})