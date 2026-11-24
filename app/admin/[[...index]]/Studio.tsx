"use client";

import dynamic from 'next/dynamic'

// Sanity Studio touches `window` when it loads, so it is rendered in the
// browser only; the exported /admin HTML is just an empty shell for it.
const StudioApp = dynamic(() => import('./StudioApp'), { ssr: false })

export default function Studio() {
  return <StudioApp />
}
