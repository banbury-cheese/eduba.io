import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { WorkloomPage } from "@/components/WorkloomPage";

export const metadata: Metadata = {
  title: "Workloom — Privacy-First Activity Tracking",
  description:
    "Local-first activity tracking for knowledge workers. Smart daily digests, interactive chat, no cloud required.",
};

export default function Workloom() {
  return (
    <Layout>
      <WorkloomPage />
    </Layout>
  );
}
