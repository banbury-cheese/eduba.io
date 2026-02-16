import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export default async function VideoJobPage({ params }: PageProps) {
  const { jobId } = await params;
  redirect(`/create-video/${jobId}/edit`);
}
