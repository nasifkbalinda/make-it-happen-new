import LegalPage, { buildLegalMetadata } from "@/components/LegalPage";

export const revalidate = 3600;

export function generateMetadata() {
  return buildLegalMetadata("terms", "Terms of Service");
}

export default function TermsPage() {
  return <LegalPage id="terms" fallbackTitle="Terms of Service" />;
}
