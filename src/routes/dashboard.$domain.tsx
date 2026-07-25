import { createFileRoute, notFound } from "@tanstack/react-router";
import { DOMAINS, type DomainSlug } from "@/lib/domains";
import { DomainDashboard } from "@/components/dashboard/DomainDashboard";

export const Route = createFileRoute("/dashboard/$domain")({
  loader: ({ params }) => {
    const domain = DOMAINS[params.domain as DomainSlug];
    if (!domain) throw notFound();
    return { domain };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.domain;
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
  const { domain } = Route.useLoaderData();
  return <DomainDashboard domain={domain} />;
}
