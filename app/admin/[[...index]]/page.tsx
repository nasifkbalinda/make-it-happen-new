import Studio from './Studio'

// The Studio is a client-side app: export one HTML shell at /admin and let
// the Studio handle its own routing. Deep links (/admin/...) are rewritten to
// this shell by public/_redirects.
export const dynamic = 'force-static'

export function generateStaticParams() {
  return [{ index: [] }]
}

export default function StudioPage() {
  return <Studio />
}
