import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { allWorkItems } from "@/data/homeContent";

const BASE = "https://eduba.io";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export function GET() {
  const skills = [
    {
      name: "view-portfolio",
      type: "page",
      description: "Browse the EDUBA portfolio of work cases.",
      url: `${BASE}/works`,
    },
    ...allWorkItems.map((work) => ({
      name: `work-${work.id}`,
      type: "page",
      description: work.summary,
      url: `${BASE}/works/${work.id}`,
    })),
  ].map((skill) => ({ ...skill, sha256: sha(skill.url) }));

  return NextResponse.json({
    $schema: "https://agentskills.io/schema/v0.2.0.json",
    skills,
  });
}
