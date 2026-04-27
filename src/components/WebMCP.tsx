"use client";

import { useEffect } from "react";
import { allWorkItems } from "@/data/homeContent";

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
};

type ModelContext = {
  provideContext: (config: { tools: ToolDefinition[] }) => void;
};

export function WebMCP() {
  useEffect(() => {
    const nav = navigator as Navigator & { modelContext?: ModelContext };
    if (!nav.modelContext?.provideContext) return;

    nav.modelContext.provideContext({
      tools: [
        {
          name: "list_works",
          description:
            "List all EDUBA portfolio work cases (id, title, client, year, summary).",
          inputSchema: { type: "object", properties: {} },
          execute: async () =>
            allWorkItems.map(({ id, title, client, year, summary }) => ({
              id,
              title,
              client,
              year,
              summary,
            })),
        },
        {
          name: "navigate_to_work",
          description: "Navigate the user to a specific work case by id.",
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Work id, e.g. 'pacific-colgate'",
              },
            },
            required: ["id"],
          },
          execute: async (input) => {
            const id = String((input as { id?: unknown }).id ?? "");
            if (!id) return { ok: false, error: "id is required" };
            window.location.href = `/works/${id}`;
            return { ok: true };
          },
        },
        {
          name: "contact_eduba",
          description: "Get EDUBA contact email.",
          inputSchema: { type: "object", properties: {} },
          execute: async () => ({ email: "info@eduba.io" }),
        },
      ],
    });
  }, []);

  return null;
}
