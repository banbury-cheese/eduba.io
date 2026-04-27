import { NextRequest, NextResponse } from "next/server";
import {
  allWorkItems,
  getWorkById,
  threeWheelStrategyContent,
  servicesContent,
  type WorkItem,
} from "@/data/homeContent";
import { getSectorBySlug } from "@/lib/sectors";
import type { Sector } from "@/lib/sectorTypes";

const md = (body: string) =>
  new NextResponse(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });

const notFound = () => md("# Not Found\n\nThis page does not exist.\n");

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await ctx.params;
  const route = "/" + path.join("/");

  if (route === "/") return md(renderHome());
  if (route === "/works") return md(renderWorksIndex());

  if (route.startsWith("/works/")) {
    const work = getWorkById(path[1]);
    return work ? md(renderWork(work)) : notFound();
  }

  if (route.startsWith("/sectors/")) {
    const sector = await getSectorBySlug(path[1]);
    if (!sector) return notFound();
    return md(path[2] === "chat" ? renderSectorChat(sector) : renderSector(sector));
  }

  if (route === "/workloom") {
    return md("# Workloom\n\nInternal tracker page.\n");
  }

  return notFound();
}

function renderHome(): string {
  const services = servicesContent.items
    .map((item) => `- **${item.title}** — ${item.headline}`)
    .join("\n");
  const wheel = threeWheelStrategyContent.sections
    .map((s) => `### ${s.title}\n\n${s.description}`)
    .join("\n\n");
  const works = allWorkItems
    .slice(0, 6)
    .map((w) => `- [${w.title}](https://eduba.io/works/${w.id}) — ${w.client}, ${w.year}`)
    .join("\n");

  return [
    "# EDUBA — The Faces of Interface",
    "",
    "Veteran-owned AI consulting and training firm. We help organizations figure out which problems belong to AI, which belong to traditional software, which belong to people, and which should not be built at all. Then we train their teams to build and govern what works.",
    "",
    "## Build. Teach. Govern.",
    "",
    wheel,
    "",
    "## What We Do",
    "",
    services,
    "",
    "## Selected Work",
    "",
    works,
    "",
    "## Contact",
    "",
    "info@eduba.io",
    "",
  ].join("\n");
}

function renderWorksIndex(): string {
  const items = allWorkItems
    .map(
      (w) =>
        `### [${w.title}](https://eduba.io/works/${w.id})\n\n` +
        `*${w.client} · ${w.year}*\n\n${w.summary}\n`
    )
    .join("\n");

  return ["# All Case Studies", "", items].join("\n");
}

function renderWork(work: WorkItem): string {
  const tags = work.tags.length ? `**Tags:** ${work.tags.join(", ")}\n` : "";
  const details = work.details.map((p) => p).join("\n\n");
  const gallery = work.gallery.length
    ? "\n## Gallery\n\n" + work.gallery.map((g) => `- ${g.label}`).join("\n")
    : "";
  const link = work.url ? `\n**Live:** ${work.url}\n` : "";

  return [
    `# ${work.title}`,
    "",
    `**Client:** ${work.client}  `,
    `**Year:** ${work.year}`,
    "",
    tags,
    `## Summary\n\n${work.summary}`,
    "",
    `## Details\n\n${details}`,
    link,
    gallery,
    "",
  ].join("\n");
}

function renderSector(sector: Sector): string {
  const consulting = sector.consulting.cards
    .map((c) => `- **${c.title}** — ${c.body}`)
    .join("\n");
  const services = sector.services.cards
    .map((c) => `- **${c.title}**${c.price ? ` (${c.price})` : ""} — ${c.body}`)
    .join("\n");
  const methodology = sector.methodology.steps
    .map((s, i) => `${i + 1}. **${s.title}** — ${s.description}`)
    .join("\n");
  const faq = sector.faq.items
    .map((f) => `**Q: ${f.question}**\n\n${f.answer}`)
    .join("\n\n");

  return [
    `# ${sector.title}`,
    "",
    `## ${sector.hero.title}`,
    "",
    sector.hero.subtitle,
    "",
    `## ${sector.consulting.title}`,
    "",
    sector.consulting.description.join("\n\n"),
    "",
    consulting,
    "",
    `## ${sector.services.title}`,
    "",
    sector.services.intro,
    "",
    services,
    "",
    `## ${sector.methodology.title}`,
    "",
    methodology,
    "",
    `## ${sector.faq.title}`,
    "",
    faq,
    "",
    `## ${sector.cta.title}`,
    "",
    `[${sector.cta.buttonLabel}](${sector.cta.buttonHref})`,
    "",
  ].join("\n");
}

function renderSectorChat(sector: Sector): string {
  return [
    `# ${sector.title} — Chat`,
    "",
    sector.hero.subtitle,
    "",
    "Interactive chat interface for this sector. Open the page in a browser to use it.",
    "",
  ].join("\n");
}
