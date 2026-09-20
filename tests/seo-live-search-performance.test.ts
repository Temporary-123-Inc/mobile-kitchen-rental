import { afterEach, describe, expect, it, vi } from "vitest";
import {
  aggregateSearchPerformance,
  fetchSearchPerformance,
  finalizedSearchPerformanceRange,
  isTemporary123BrandedQuery,
  providerJson,
  rankSearchPerformancePages,
} from "../server/seo-live";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Search Console performance measurement", () => {
  it("parses valid provider JSON larger than the former 2 MB truncation boundary", async () => {
    const payload = { rows: [{ keys: ["x".repeat(2_100_000)] }] };
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })));

    const result = await providerJson("https://provider.example/query", {});

    expect((result.rows as Array<{ keys: string[] }>)[0].keys[0]).toHaveLength(2_100_000);
  });

  it("uses the latest finalized 28-day window", () => {
    expect(finalizedSearchPerformanceRange(new Date("2026-09-20T12:00:00Z"))).toEqual({
      startDate: "2026-08-21",
      endDate: "2026-09-17",
    });
    expect(finalizedSearchPerformanceRange(new Date("2026-09-20T12:00:00Z"), 90)).toEqual({
      startDate: "2026-06-20",
      endDate: "2026-09-17",
    });
  });

  it("recognizes Temporary123 brand variants without classifying generic searches", () => {
    expect(isTemporary123BrandedQuery("temporary123")).toBe(true);
    expect(isTemporary123BrandedQuery("Temporary 123 Inc")).toBe(true);
    expect(isTemporary123BrandedQuery("temporary-123.com")).toBe(true);
    expect(isTemporary123BrandedQuery("mobile kitchen trailer rental")).toBe(false);
  });

  it("aggregates CTR and position using impression weighting", () => {
    expect(aggregateSearchPerformance([
      { clicks: 4, impressions: 20, ctr: 0.2, position: 2 },
      { clicks: 6, impressions: 80, ctr: 0.075, position: 12 },
    ])).toEqual({ clicks: 10, impressions: 100, ctr: 0.1, position: 10 });
  });

  it("ranks page evidence by clicks, impressions, then strongest position", () => {
    expect(rankSearchPerformancePages([
      { page: "https://temporary123.com/b/", clicks: 1, impressions: 100, ctr: 0.01, position: 8 },
      { page: "https://temporary123.com/c/", clicks: 2, impressions: 20, ctr: 0.1, position: 4 },
      { page: "https://temporary123.com/a/", clicks: 1, impressions: 100, ctr: 0.01, position: 3 },
    ]).map((row) => row.page)).toEqual([
      "https://temporary123.com/c/",
      "https://temporary123.com/a/",
      "https://temporary123.com/b/",
    ]);
  });

  it("returns aggregate and page evidence without exposing raw search queries", async () => {
    vi.stubGlobal("fetch", vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as { dimensions: string[]; startDate: string; endDate: string };
      const days = (Date.parse(body.endDate) - Date.parse(body.startDate)) / 86_400_000 + 1;
      const rows = body.dimensions.length === 0
        ? [{ clicks: 15, impressions: 1_000, ctr: 0.015, position: 8.5 }]
        : body.dimensions[0] === "page"
          ? days > 28
            ? [{ keys: ["https://temporary123.com/catering/"], clicks: 9, impressions: 400, ctr: 0.0225, position: 11 }]
            : [
                { keys: ["https://temporary123.com/contact-us/"], clicks: 4, impressions: 100, ctr: 0.04, position: 5 },
                { keys: ["https://temporary123.com/rental-calculator/"], clicks: 3, impressions: 60, ctr: 0.05, position: 7 },
              ]
          : [
              { keys: ["temporary 123"], clicks: 5, impressions: 200, ctr: 0.025, position: 1 },
              { keys: ["commercial kitchen trailer rental"], clicks: 8, impressions: 500, ctr: 0.016, position: 9 },
            ];
      return new Response(JSON.stringify({ rows }), { status: 200, headers: { "Content-Type": "application/json" } });
    }));

    const result = await fetchSearchPerformance("test-token", "sc-domain:temporary123.com");

    expect(result.state).toBe("connected");
    expect(result.totals).toMatchObject({ clicks: 15, impressions: 1_000 });
    expect(result.knownNonBranded).toEqual({ clicks: 8, impressions: 500, ctr: 0.016, position: 9 });
    expect(result.pageRows).toHaveLength(2);
    expect(result.pageRowsAvailable).toBe(2);
    expect(result.pageRowsLimited).toBe(false);
    expect(result.prioritizationPageRows).toEqual([
      { page: "https://temporary123.com/catering/", clicks: 9, impressions: 400, ctr: 0.0225, position: 11 },
    ]);
    expect(result.prioritizationStartDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.prioritizationEndDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.prioritizationPageRowsAvailable).toBe(1);
    expect(result.prioritizationPageRowsLimited).toBe(false);
    expect(result.queryRowsReturned).toBe(2);
    expect(JSON.stringify(result)).not.toContain("commercial kitchen trailer rental");
    expect(JSON.stringify(result)).not.toContain("temporary 123");
  });
});
