import { defineField, defineType } from 'sanity'
import {
  SOCIAL_PLATFORM_OPTIONS,
  SOCIAL_PLATFORMS,
  resolvePlatform,
} from '../../lib/socialPlatforms'

const placeholderHint = SOCIAL_PLATFORMS.filter((p) => p.value !== 'other')
  .slice(0, 4)
  .map((p) => p.placeholder)
  .join(', ')

/**
 * A single social media profile: pick the platform, paste the link.
 * The brand icon is derived from the platform, so editors never touch icons.
 */
export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      description: 'Pick the network — the official brand icon is applied automatically.',
      options: {
        list: SOCIAL_PLATFORM_OPTIONS,
      },
      initialValue: 'facebook',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Custom label',
      type: 'string',
      description:
        'Only needed when Platform is "Other". Used as the accessible name of the icon.',
      hidden: ({ parent }) => parent?.platform !== 'other',
      validation: (Rule) =>
        Rule.custom((label, context) => {
          const parent = context.parent as { platform?: string } | undefined
          if (parent?.platform === 'other' && !label) {
            return 'Add a label so the icon has an accessible name.'
          }
          return true
        }),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: `Full link to the profile, e.g. ${placeholderHint}`,
      validation: (Rule) =>
        Rule.required().uri({
          allowRelative: false,
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
  ],
  preview: {
    select: { platform: 'platform', label: 'label', url: 'url' },
    prepare({ platform, label, url }) {
      const resolved = resolvePlatform(platform)
      const Icon = resolved.icon
      return {
        title: label || resolved.title,
        subtitle: url || 'No link yet',
        media: <Icon style={{ color: resolved.color }} />,
      }
    },
  },
})
