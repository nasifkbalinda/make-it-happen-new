/**
 * Brand colours for JavaScript contexts that cannot read the CSS variables in
 * app/globals.css — chiefly the Sanity Studio, which never loads that
 * stylesheet. Everything rendered on the site itself should use the Tailwind
 * accent classes instead.
 *
 * Keep in step with `--accent-primary` in app/globals.css.
 */
export const BRAND = {
  /** Flat brand green, measured from the logo. */
  green: "#5DD400",
} as const;
