import LegalPage, { buildLegalMetadata } from "@/components/LegalPage";

export const revalidate = 3600;

export function generateMetadata() {
  return buildLegalMetadata("privacy", "Privacy Policy");
}

export default function PrivacyPage() {
  return <LegalPage id="privacy" fallbackTitle="Privacy Policy" />;
}
