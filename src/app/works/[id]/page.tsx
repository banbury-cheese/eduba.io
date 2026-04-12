import { notFound } from "next/navigation";
import { Layout } from "@/components/Layout";
import { WorkDetail } from "@/components/WorkDetail";
import { allWorkItems, getWorkById } from "@/data/homeContent";

interface WorkRouteProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return allWorkItems.map((work) => ({ id: work.id }));
}

export async function generateMetadata({ params }: WorkRouteProps) {
  const { id } = await params;
  const work = getWorkById(id);

  if (!work) {
    return {};
  }

  return {
    title: `${work.title} | EDUBA`,
    description: work.summary,
  };
}

export default async function WorkRoute({ params }: WorkRouteProps) {
  const { id } = await params;
  const work = getWorkById(id);

  if (!work) {
    notFound();
  }

  return (
    <Layout>
      <WorkDetail work={work} />
    </Layout>
  );
}
