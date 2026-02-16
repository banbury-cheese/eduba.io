import { notFound } from "next/navigation";
import { Layout } from "@/components/Layout";
import { getVideoJob } from "@/lib/videoJobs";
import { VideoEditStudio } from "./VideoEditStudio";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export default async function CreateVideoEditPage({ params }: PageProps) {
  const { jobId } = await params;
  const job = await getVideoJob(jobId);

  if (!job) {
    notFound();
  }

  return (
    <Layout>
      <VideoEditStudio initialJob={job} />
    </Layout>
  );
}
