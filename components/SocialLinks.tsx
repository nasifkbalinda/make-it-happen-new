import { resolvePlatform } from "@/lib/socialPlatforms";

export type SocialLinkItem = {
  platform: string | null;
  label?: string | null;
  url: string | null;
};

/** GROQ projection for a socialLinks array — keep every query in sync via this. */
export const socialLinksProjection = `socialLinks[]{ platform, label, url }`;

type ResolvedSocialLink = {
  platform: string;
  label: string | null;
  url: string;
};

/**
 * Drops entries an editor left half-finished, and keeps the Studio's ordering.
 */
export function cleanSocialLinks(
  links: SocialLinkItem[] | null | undefined,
): ResolvedSocialLink[] {
  return (links ?? [])
    .filter((link): link is SocialLinkItem => Boolean(link?.url))
    .map((link) => ({
      platform: link.platform ?? "other",
      label: link.label ?? null,
      url: link.url as string,
    }));
}

const SIZES = {
  sm: { button: "h-9 w-9", icon: "h-3.5 w-3.5" },
  md: { button: "h-10 w-10", icon: "h-4 w-4" },
  lg: { button: "h-12 w-12", icon: "h-5 w-5" },
} as const;

type SocialLinksProps = {
  links: SocialLinkItem[] | null | undefined;
  size?: keyof typeof SIZES;
  className?: string;
  /** Tints each icon with its own brand colour on hover instead of the site accent. */
  brandColorOnHover?: boolean;
};

export default function SocialLinks({
  links,
  size = "md",
  className = "",
  brandColorOnHover = true,
}: SocialLinksProps) {
  const items = cleanSocialLinks(links);
  if (items.length === 0) return null;

  const sizing = SIZES[size];

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map((link, index) => {
        const platform = resolvePlatform(link.platform);
        const Icon = platform.icon;
        const name = link.label || platform.title;

        return (
          <li key={`${link.url}-${index}`}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              title={name}
              style={
                brandColorOnHover
                  ? ({ "--brand": platform.color } as React.CSSProperties)
                  : undefined
              }
              className={`group flex ${sizing.button} items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand,var(--accent-primary))] hover:text-[var(--brand,var(--accent-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1016]`}
            >
              <Icon className={sizing.icon} aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
