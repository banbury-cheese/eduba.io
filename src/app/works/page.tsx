import { Layout } from "@/components/Layout";
import { WorksArchive } from "@/components/WorksArchive";

export const metadata = {
  title: "All Case Studies | EDUBA",
  description:
    "Browse the full EDUBA case study archive and expand each folder for more context.",
};

export default function WorksArchivePage() {
  return (
    <Layout>
      <WorksArchive />
    </Layout>
  );
}
