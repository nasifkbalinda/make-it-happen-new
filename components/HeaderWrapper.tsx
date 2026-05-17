import { createClient } from "next-sanity";
import Header from "./Header";

// Connect to Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default async function HeaderWrapper() {
  // Fetch the Site Settings document we just created
  const query = `*[_type == "siteSettings"][0]{
    siteTitle,
    "logoUrl": logo.asset->url
  }`;
  
  const settings = await client.fetch(query);

  // Pass the data down to the client component
  return (
    <Header 
      logoUrl={settings?.logoUrl} 
      siteTitle={settings?.siteTitle} 
    />
  );
}