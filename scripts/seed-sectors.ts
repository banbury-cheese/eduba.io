import { createClient } from "@sanity/client";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import path from "path";

import { fallbackSectors } from "../src/data/sectors";

function loadEnvFile(filePath: string) {
  const env: Record<string, string> = {};
  try {
    const contents = readFileSync(filePath, "utf8");
    contents.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const [key, ...rest] = trimmed.split("=");
      if (!key) return;
      env[key] = rest.join("=").trim();
    });
  } catch {
    // ignore missing env file
  }
  return env;
}

const envFile = path.resolve(process.cwd(), ".env.local");
const envFromFile = loadEnvFile(envFile);

const projectId =
  process.env.SANITY_PROJECT_ID || envFromFile.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || envFromFile.SANITY_DATASET;
const apiVersion =
  process.env.SANITY_API_VERSION ||
  envFromFile.SANITY_API_VERSION ||
  "2023-08-01";
const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  envFromFile.SANITY_API_WRITE_TOKEN ||
  envFromFile.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing SANITY_PROJECT_ID, SANITY_DATASET, or SANITY_API_*_TOKEN in .env.local"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

function withKey<T extends Record<string, unknown>>(item: T) {
  return { _key: randomUUID(), ...item };
}

function toSectorDoc(sector: (typeof fallbackSectors)[number]) {
  return {
    _id: `sector-${sector.slug}`,
    _type: "sector",
    title: sector.title,
    slug: { current: sector.slug },
    pageIndex: sector.pageIndex,
    pageTag: sector.pageTag,
    hero: sector.hero,
    consulting: {
      ...sector.consulting,
      cards: sector.consulting.cards.map(withKey),
    },
    whyUs: {
      ...sector.whyUs,
      items: sector.whyUs.items.map(withKey),
    },
    services: {
      ...sector.services,
      cards: sector.services.cards.map(withKey),
    },
    methodology: {
      ...sector.methodology,
      steps: sector.methodology.steps.map(withKey),
    },
    engagement: {
      ...sector.engagement,
      cards: sector.engagement.cards.map(withKey),
    },
    faq: {
      ...sector.faq,
      items: sector.faq.items.map(withKey),
    },
    cta: sector.cta,
  };
}

async function run() {
  const docs = fallbackSectors.map(toSectorDoc);
  const desiredIds = new Set(docs.map((doc) => doc._id));
  const existingIds = await client.fetch<string[]>(`*[_type == "sector"]._id`);
  const staleIds = existingIds.filter((id) => !desiredIds.has(id));

  const transaction = client.transaction();
  staleIds.forEach((id) => {
    transaction.delete(id);
  });
  docs.forEach((doc) => {
    transaction.createOrReplace(doc);
  });

  const result = await transaction.commit();

  console.log(
    `Cleaned ${staleIds.length} stale sector docs, seeded ${docs.length} sectors.`,
  );
  if (staleIds.length > 0) {
    console.log("Deleted ids:", staleIds);
  }
  console.log(`Seeded ${docs.length} sectors.`);
  console.log(result);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
