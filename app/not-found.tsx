import PageHero from "@/components/PageHero";
import { PillLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="bg-paper pb-3 text-ink">
      <PageHero kicker="404" title="This page didn’t make it." description="The link may be old, or the page has moved. Try one of these instead.">
        <div className="mt-8 flex flex-wrap gap-3">
          <PillLink href="/" variant="accent">Back to home</PillLink>
          <PillLink href="/projects" variant="light">See our work</PillLink>
          <PillLink href="/contact" variant="outline">Contact us</PillLink>
        </div>
      </PageHero>
    </div>
  );
}
