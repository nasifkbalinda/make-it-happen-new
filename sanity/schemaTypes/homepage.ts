import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Every piece of homepage copy lives here. Fields left empty fall back to the
 * default wording in app/page.tsx, so a half-filled document never breaks the page.
 */
export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage Settings',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'intro', title: 'Intro & clients' },
    { name: 'stats', title: 'Numbers' },
    { name: 'services', title: 'Services' },
    { name: 'work', title: 'Work' },
    { name: 'faq', title: 'FAQ' },
    { name: 'journal', title: 'Journal' },
  ],
  fields: [
    // --- Hero ---
    defineField({
      name: 'heroKicker',
      title: 'Hero label',
      type: 'string',
      group: 'hero',
      description: 'The small pill above the headline, e.g. "Software · Web · AI · Marketing".',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      group: 'hero',
      description: 'The big main title on the homepage',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      group: 'hero',
      description: 'The smaller paragraph under the title',
    }),
    defineField({
      name: 'heroAside',
      title: 'Hero side statement',
      type: 'string',
      group: 'hero',
      description: 'The short sentence above the buttons at the bottom right of the hero.',
    }),
    defineField({
      name: 'heroMeta',
      title: 'Hero details',
      type: 'array',
      group: 'hero',
      description: 'Up to three short lines at the bottom left of the hero, e.g. "Based: Kampala, UG".',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'primaryCtaText',
      title: 'Primary Button Text',
      type: 'string',
      group: 'hero',
      description: 'e.g., Start a project',
    }),
    defineField({
      name: 'primaryCtaLink',
      title: 'Primary Button Link',
      type: 'string',
      group: 'hero',
      description: 'e.g., /contact',
    }),
    defineField({
      name: 'secondaryCtaText',
      title: 'Secondary Button Text',
      type: 'string',
      group: 'hero',
      description: 'e.g., View our work',
    }),
    defineField({
      name: 'secondaryCtaLink',
      title: 'Secondary Button Link',
      type: 'string',
      group: 'hero',
      description: 'e.g., /projects',
    }),
    defineField({
      name: 'heroChatQuestion',
      title: 'Animation: customer question',
      type: 'string',
      group: 'hero',
      description: 'The question a customer asks in the animated chat scene.',
    }),
    defineField({
      name: 'heroChatAnswer',
      title: 'Animation: AI answer',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'The reply the AI agent types back. Keep it to one or two short sentences.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      description: 'Used when a link to the homepage is shared on social media or WhatsApp.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video (optional)',
      type: 'file',
      group: 'hero',
      description: 'A short, silent MP4 loop played faintly behind the hero. Leave empty to show only the animation.',
      options: { accept: 'video/mp4' },
    }),
    defineField({
      name: 'heroVideoPoster',
      title: 'Hero Video Poster',
      type: 'image',
      group: 'hero',
      description: 'A still from the hero video, shown for the split second before it starts playing.',
    }),

    // --- Intro & clients ---
    defineField({
      name: 'clientsLabel',
      title: 'Client strip label',
      type: 'string',
      group: 'intro',
      description: 'Text beside the scrolling project names. Leave empty to build it from Stat 1.',
    }),
    defineField({
      name: 'introKicker',
      title: 'Intro label',
      type: 'string',
      group: 'intro',
      description: 'e.g. "Who we are"',
    }),
    defineField({
      name: 'introStatement',
      title: 'Intro Statement',
      type: 'text',
      rows: 3,
      group: 'intro',
      description: 'The large sentence under "Who we are". It fills in word by word as visitors scroll.',
    }),
    defineField({
      name: 'introLinkText',
      title: 'Intro link text',
      type: 'string',
      group: 'intro',
      description: 'e.g. "About the studio" — links to the About page.',
    }),
    defineField({
      name: 'introImages',
      title: 'Intro Photo Strip',
      type: 'array',
      group: 'intro',
      description: 'Photos of the team and the work. They drift slowly across the page under the intro statement.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
      ],
    }),

    // --- Numbers ---
    defineField({
      name: 'statsKicker',
      title: 'Numbers label',
      type: 'string',
      group: 'stats',
      description: 'e.g. "By the numbers"',
    }),
    defineField({ name: 'stat1Value', title: 'Stat 1 Value (e.g., 50+)', type: 'string', group: 'stats' }),
    defineField({ name: 'stat1Label', title: 'Stat 1 Label (e.g., Projects delivered)', type: 'string', group: 'stats' }),
    defineField({ name: 'stat2Value', title: 'Stat 2 Value', type: 'string', group: 'stats' }),
    defineField({ name: 'stat2Label', title: 'Stat 2 Label', type: 'string', group: 'stats' }),
    defineField({ name: 'stat3Value', title: 'Stat 3 Value', type: 'string', group: 'stats' }),
    defineField({ name: 'stat3Label', title: 'Stat 3 Label', type: 'string', group: 'stats' }),
    defineField({ name: 'stat4Value', title: 'Stat 4 Value', type: 'string', group: 'stats' }),
    defineField({ name: 'stat4Label', title: 'Stat 4 Label', type: 'string', group: 'stats' }),

    // --- Services ---
    defineField({
      name: 'servicesKicker',
      title: 'Services label',
      type: 'string',
      group: 'services',
      description: 'e.g. "Services"',
    }),
    defineField({
      name: 'servicesHeading',
      title: 'Services heading',
      type: 'string',
      group: 'services',
      description: 'Put [image] where the small round photo should sit, e.g. "Everything [image] your business needs to grow online."',
    }),
    defineField({
      name: 'servicesDescription',
      title: 'Services description',
      type: 'text',
      rows: 3,
      group: 'services',
    }),

    // --- Work ---
    defineField({
      name: 'featuredProjectsKicker',
      title: 'Featured Projects Kicker',
      type: 'string',
      group: 'work',
      description: 'e.g., Featured projects',
    }),
    defineField({
      name: 'featuredProjectsTitle',
      title: 'Featured Projects Title',
      type: 'text',
      rows: 2,
      group: 'work',
    }),
    defineField({
      name: 'featuredProjectsDescription',
      title: 'Featured Projects Description',
      type: 'text',
      group: 'work',
    }),
    defineField({
      name: 'workLinkText',
      title: 'Work link text',
      type: 'string',
      group: 'work',
      description: 'e.g. "All cases" — links to the Projects page.',
    }),

    // --- FAQ ---
    defineField({ name: 'faqKicker', title: 'FAQ label', type: 'string', group: 'faq' }),
    defineField({ name: 'faqHeading', title: 'FAQ heading', type: 'string', group: 'faq' }),
    defineField({ name: 'faqDescription', title: 'FAQ description', type: 'text', rows: 3, group: 'faq' }),
    defineField({ name: 'faqButtonText', title: 'FAQ button text', type: 'string', group: 'faq', description: 'Links to the Contact page.' }),
    defineField({
      name: 'faqs',
      title: 'Frequently Asked Questions',
      type: 'array',
      group: 'faq',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faq',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: 'question', subtitle: 'answer' } },
        }),
      ],
    }),

    // --- Journal ---
    defineField({ name: 'journalKicker', title: 'Journal label', type: 'string', group: 'journal' }),
    defineField({ name: 'journalHeading', title: 'Journal heading', type: 'string', group: 'journal' }),
    defineField({ name: 'journalLinkText', title: 'Journal link text', type: 'string', group: 'journal', description: 'Links to the Blog page.' }),
  ],
})
