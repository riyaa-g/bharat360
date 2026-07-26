import { createFileRoute, notFound } from "@tanstack/react-router";
import { DOMAINS, type DomainSlug } from "@/lib/domains";
import { DomainDashboard } from "@/components/dashboard/DomainDashboard";

export const Route = createFileRoute("/dashboard/$domain")({
  loader: ({ params }) => {
    const slug = params.domain as DomainSlug;
    if (!DOMAINS[slug]) throw notFound();
    return { slug };
  },
  head: ({ loaderData }) => {
    const slug = loaderData?.slug;
    const d = slug ? DOMAINS[slug] : undefined;
    const title = d ? `${d.name} of India — Bharat360` : "Dashboard — Bharat360";
    const desc = d
      ? `${d.tagline}. India's ${d.name.toLowerCase()} performance across global benchmarks, trends and state-level insights.`
      : "India domain dashboard.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { slug } = Route.useLoaderData();
  const domain = DOMAINS[slug];
  return <DomainDashboard domain={domain} />;
}
