import { authorityTop25 } from "../src/authorityTop25.js";
import { createSign } from "node:crypto";

export const SEO_ORIGINS = {
  production: "https://temporary123.com",
  preview: "https://temp123-nine.vercel.app",
} as const;

export type LivePageCheck = {
  url: string;
  status: number | null;
  finalUrl: string | null;
  redirectLocation: string | null;
  responseMs: number;
  canonical: string | null;
  title: string | null;
  noindex: boolean | null;
  error: string | null;
};

type ProviderState = "connected" | "not_configured" | "error";

type AuthorityProviderResult = {
  state: ProviderState;
  checkedAt: string | null;
  source: string;
  domainRating?: number;
  domainAuthority?: number;
  pageAuthority?: number;
  error?: string;
};

type GoogleInspectionResult = {
  url: string;
  indexed: boolean | null;
  verdict: string;
  coverageState: string;
  indexingState: string;
  lastCrawlTime: string | null;
  pageFetchState: string;
  googleCanonical: string | null;
  userCanonical: string | null;
  inspectionResultLink: string | null;
  error: string | null;
};

export type SearchPerformanceMetrics = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type SearchPerformanceSnapshot = {
  state: ProviderState;
  checkedAt: string | null;
  startDate: string | null;
  endDate: string | null;
  source: string;
  totals: SearchPerformanceMetrics | null;
  knownNonBranded: SearchPerformanceMetrics | null;
  pageRows: Array<SearchPerformanceMetrics & { page: string }>;
  pageRowsAvailable: number;
  pageRowsLimited: boolean;
  prioritizationStartDate: string | null;
  prioritizationEndDate: string | null;
  prioritizationPageRows: Array<SearchPerformanceMetrics & { page: string }>;
  prioritizationPageRowsAvailable: number;
  prioritizationPageRowsLimited: boolean;
  queryRowsReturned: number;
  queryRowLimitReached: boolean;
  error?: string;
};

type ProviderSnapshot = {
  ahrefs: AuthorityProviderResult;
  moz: AuthorityProviderResult;
  searchConsole: {
    state: ProviderState;
    checkedAt: string | null;
    siteUrl: string | null;
    urls: GoogleInspectionResult[];
    performance: SearchPerformanceSnapshot;
    error?: string;
  };
};

const PROVIDER_CACHE_MS = 6 * 60 * 60 * 1_000;
let providerCache: { expiresAt: number; value: ProviderSnapshot } | null = null;
const googleTokenCache = new Map<string, { token: string; expiresAt: number }>();

export function safeError(error: unknown) {
  if (!(error instanceof Error)) return "Provider request failed";
  return error.message
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/Basic\s+\S+/gi, "Basic [redacted]")
    .slice(0, 240);
}

export async function providerJson(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(20_000),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Provider returned ${response.status}`);
  if (text.length > 12_000_000) {
    throw new Error("Provider response exceeded 12 MB safety limit");
  }
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error("Provider returned invalid JSON");
  }
}

async function fetchAhrefsAuthority(): Promise<AuthorityProviderResult> {
  const token = process.env.AHREFS_API_TOKEN?.trim();
  if (!token) {
    return {
      state: "not_configured",
      checkedAt: null,
      source: "Ahrefs Domain Rating API is not configured",
    };
  }
  try {
    const json = await providerJson(
      "https://api.ahrefs.com/v3/public/domain-rating-free",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targets: ["temporary123.com"] }),
      },
    );
    const targets = (json.domain_rating as { targets?: Array<{ domain_rating?: number }> } | undefined)?.targets;
    const domainRating = targets?.[0]?.domain_rating;
    if (!Number.isFinite(domainRating)) throw new Error("Ahrefs response did not include Domain Rating");
    return {
      state: "connected",
      checkedAt: new Date().toISOString(),
      source: "Ahrefs Domain Rating API",
      domainRating,
    };
  } catch (error) {
    return {
      state: "error",
      checkedAt: new Date().toISOString(),
      source: "Ahrefs Domain Rating API",
      error: safeError(error),
    };
  }
}

async function fetchMozAuthority(): Promise<AuthorityProviderResult> {
  const accessId = process.env.MOZ_ACCESS_ID?.trim();
  const secretKey = process.env.MOZ_SECRET_KEY?.trim();
  if (!accessId || !secretKey) {
    return {
      state: "not_configured",
      checkedAt: null,
      source: "Moz URL Metrics API is not configured",
    };
  }
  try {
    const credentials = Buffer.from(`${accessId}:${secretKey}`).toString("base64");
    const json = await providerJson("https://lsapi.seomoz.com/v2/url_metrics", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targets: ["temporary123.com"] }),
    });
    const record = ((json.results as Array<Record<string, unknown>> | undefined)?.[0] || json) as Record<string, unknown>;
    const domainAuthority = Number(record.domain_authority);
    const pageAuthority = Number(record.page_authority);
    if (!Number.isFinite(domainAuthority)) throw new Error("Moz response did not include Domain Authority");
    return {
      state: "connected",
      checkedAt: new Date().toISOString(),
      source: "Moz URL Metrics API",
      domainAuthority,
      ...(Number.isFinite(pageAuthority) ? { pageAuthority } : {}),
    };
  } catch (error) {
    return {
      state: "error",
      checkedAt: new Date().toISOString(),
      source: "Moz URL Metrics API",
      error: safeError(error),
    };
  }
}

function base64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

export async function getGoogleServiceAccountToken(email: string, privateKey: string, scope: string) {
  const cacheKey = `${email}|${scope}`;
  const cached = googleTokenCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
  if (!email || !privateKey) return null;
  const now = Math.floor(Date.now() / 1_000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: email,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3_600,
  }));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  signer.end();
  const assertion = `${header}.${payload}.${signer.sign(privateKey, "base64url")}`;
  const json = await providerJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const token = typeof json.access_token === "string" ? json.access_token : null;
  if (!token) throw new Error("Google token response did not include an access token");
  const expiresIn = Number(json.expires_in) || 3_600;
  googleTokenCache.set(cacheKey, { token, expiresAt: Date.now() + expiresIn * 1_000 });
  return token;
}

export async function getGoogleAccessToken() {
  const directToken = process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN?.trim();
  if (directToken) return directToken;
  const email = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  if (!email || !privateKey) return null;
  return getGoogleServiceAccountToken(email, privateKey, "https://www.googleapis.com/auth/webmasters.readonly");
}

export async function inspectGoogleUrl(token: string, siteUrl: string, url: string): Promise<GoogleInspectionResult> {
  try {
    const json = await providerJson(
      "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inspectionUrl: url, siteUrl, languageCode: "en-US" }),
      },
    );
    const inspection = (json.inspectionResult || {}) as Record<string, unknown>;
    const index = (inspection.indexStatusResult || {}) as Record<string, unknown>;
    const verdict = typeof index.verdict === "string" ? index.verdict : "UNKNOWN";
    return {
      url,
      indexed: verdict === "PASS" ? true : verdict === "FAIL" ? false : null,
      verdict,
      coverageState: typeof index.coverageState === "string" ? index.coverageState : "Unknown",
      indexingState: typeof index.indexingState === "string" ? index.indexingState : "Unknown",
      lastCrawlTime: typeof index.lastCrawlTime === "string" ? index.lastCrawlTime : null,
      pageFetchState: typeof index.pageFetchState === "string" ? index.pageFetchState : "Unknown",
      googleCanonical: typeof index.googleCanonical === "string" ? index.googleCanonical : null,
      userCanonical: typeof index.userCanonical === "string" ? index.userCanonical : null,
      inspectionResultLink: typeof inspection.inspectionResultLink === "string" ? inspection.inspectionResultLink : null,
      error: null,
    };
  } catch (error) {
    return {
      url,
      indexed: null,
      verdict: "ERROR",
      coverageState: "Unknown",
      indexingState: "Unknown",
      lastCrawlTime: null,
      pageFetchState: "Unknown",
      googleCanonical: null,
      userCanonical: null,
      inspectionResultLink: null,
      error: safeError(error),
    };
  }
}

type SearchAnalyticsApiRow = {
  keys?: unknown;
  clicks?: unknown;
  impressions?: unknown;
  ctr?: unknown;
  position?: unknown;
};

const SEARCH_ANALYTICS_ROW_LIMIT = 25_000;
const SEARCH_PERFORMANCE_PAGE_OUTPUT_LIMIT = 500;
const SEARCH_PERFORMANCE_PRIORITY_OUTPUT_LIMIT = 1_000;

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function finalizedSearchPerformanceRange(now = new Date(), days = 28) {
  if (!Number.isInteger(days) || days < 1) {
    throw new Error("Search performance range must contain at least one day");
  }
  const end = new Date(now);
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return { startDate: dateOnly(start), endDate: dateOnly(end) };
}

export function isTemporary123BrandedQuery(query: string) {
  return /\btemporary[\s._-]*123\b/i.test(query);
}

function finiteMetric(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function apiRowMetrics(row: SearchAnalyticsApiRow): SearchPerformanceMetrics {
  return {
    clicks: finiteMetric(row.clicks),
    impressions: finiteMetric(row.impressions),
    ctr: finiteMetric(row.ctr),
    position: finiteMetric(row.position),
  };
}

export function aggregateSearchPerformance(rows: SearchAnalyticsApiRow[]) {
  const totals = rows.reduce<{ clicks: number; impressions: number; weightedPosition: number }>(
    (result, row) => {
      const metrics = apiRowMetrics(row);
      result.clicks += metrics.clicks;
      result.impressions += metrics.impressions;
      result.weightedPosition += metrics.position * metrics.impressions;
      return result;
    },
    { clicks: 0, impressions: 0, weightedPosition: 0 },
  );
  return {
    clicks: totals.clicks,
    impressions: totals.impressions,
    ctr: totals.impressions > 0 ? totals.clicks / totals.impressions : 0,
    position: totals.impressions > 0 ? totals.weightedPosition / totals.impressions : 0,
  };
}

export function rankSearchPerformancePages(
  rows: Array<SearchPerformanceMetrics & { page: string }>,
) {
  return [...rows].sort((left, right) =>
    right.clicks - left.clicks
    || right.impressions - left.impressions
    || left.position - right.position
    || left.page.localeCompare(right.page));
}

async function querySearchAnalytics(
  token: string,
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions: string[],
) {
  const json = await providerJson(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        type: "web",
        dataState: "final",
        aggregationType: dimensions.includes("page") ? "auto" : "byProperty",
        rowLimit: dimensions.length ? SEARCH_ANALYTICS_ROW_LIMIT : 1,
      }),
    },
  );
  return Array.isArray(json.rows) ? json.rows as SearchAnalyticsApiRow[] : [];
}

function emptySearchPerformance(
  state: ProviderState,
  source: string,
  error?: string,
): SearchPerformanceSnapshot {
  return {
    state,
    checkedAt: state === "not_configured" ? null : new Date().toISOString(),
    startDate: null,
    endDate: null,
    source,
    totals: null,
    knownNonBranded: null,
    pageRows: [],
    pageRowsAvailable: 0,
    pageRowsLimited: false,
    prioritizationStartDate: null,
    prioritizationEndDate: null,
    prioritizationPageRows: [],
    prioritizationPageRowsAvailable: 0,
    prioritizationPageRowsLimited: false,
    queryRowsReturned: 0,
    queryRowLimitReached: false,
    ...(error ? { error } : {}),
  };
}

export async function fetchSearchPerformance(
  token: string,
  siteUrl: string,
): Promise<SearchPerformanceSnapshot> {
  const now = new Date();
  const { startDate, endDate } = finalizedSearchPerformanceRange(now);
  const {
    startDate: prioritizationStartDate,
    endDate: prioritizationEndDate,
  } = finalizedSearchPerformanceRange(now, 90);
  try {
    const [totalRows, pageRows, queryRows, prioritizationRows] = await Promise.all([
      querySearchAnalytics(token, siteUrl, startDate, endDate, []),
      querySearchAnalytics(token, siteUrl, startDate, endDate, ["page"]),
      querySearchAnalytics(token, siteUrl, startDate, endDate, ["query"]),
      querySearchAnalytics(
        token,
        siteUrl,
        prioritizationStartDate,
        prioritizationEndDate,
        ["page"],
      ),
    ]);
    const knownNonBrandedRows = queryRows.filter((row) => {
      const query = Array.isArray(row.keys) && typeof row.keys[0] === "string" ? row.keys[0] : "";
      return query.length > 0 && !isTemporary123BrandedQuery(query);
    });
    const pages = pageRows.flatMap((row) => {
      const page = Array.isArray(row.keys) && typeof row.keys[0] === "string" ? row.keys[0] : null;
      if (!page) return [];
      return [{ page, ...apiRowMetrics(row) }];
    });
    const prioritizationPages = prioritizationRows.flatMap((row) => {
      const page = Array.isArray(row.keys) && typeof row.keys[0] === "string" ? row.keys[0] : null;
      if (!page) return [];
      return [{ page, ...apiRowMetrics(row) }];
    });
    const rankedPages = rankSearchPerformancePages(pages);
    const rankedPrioritizationPages = rankSearchPerformancePages(prioritizationPages);
    return {
      state: "connected",
      checkedAt: new Date().toISOString(),
      startDate,
      endDate,
      source: "Google Search Console Search Analytics API (finalized web data)",
      totals: totalRows[0] ? apiRowMetrics(totalRows[0]) : { clicks: 0, impressions: 0, ctr: 0, position: 0 },
      knownNonBranded: aggregateSearchPerformance(knownNonBrandedRows),
      pageRows: rankedPages.slice(0, SEARCH_PERFORMANCE_PAGE_OUTPUT_LIMIT),
      pageRowsAvailable: rankedPages.length,
      pageRowsLimited: rankedPages.length > SEARCH_PERFORMANCE_PAGE_OUTPUT_LIMIT,
      prioritizationStartDate,
      prioritizationEndDate,
      prioritizationPageRows: rankedPrioritizationPages.slice(
        0,
        SEARCH_PERFORMANCE_PRIORITY_OUTPUT_LIMIT,
      ),
      prioritizationPageRowsAvailable: rankedPrioritizationPages.length,
      prioritizationPageRowsLimited:
        rankedPrioritizationPages.length > SEARCH_PERFORMANCE_PRIORITY_OUTPUT_LIMIT,
      queryRowsReturned: queryRows.length,
      queryRowLimitReached: queryRows.length === SEARCH_ANALYTICS_ROW_LIMIT,
    };
  } catch (error) {
    return {
      ...emptySearchPerformance(
        "error",
        "Google Search Console Search Analytics API",
        safeError(error),
      ),
      startDate,
      endDate,
      prioritizationStartDate,
      prioritizationEndDate,
    };
  }
}

async function fetchSearchConsole(): Promise<ProviderSnapshot["searchConsole"]> {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim() || null;
  const hasCredential = Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN?.trim() ||
    (process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL?.trim() && process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY?.trim()),
  );
  if (!siteUrl || !hasCredential) {
    return {
      state: "not_configured",
      checkedAt: null,
      siteUrl,
      urls: [],
      performance: emptySearchPerformance(
        "not_configured",
        "Google Search Console Search Analytics API is not configured",
      ),
    };
  }
  try {
    const token = await getGoogleAccessToken();
    if (!token) throw new Error("Google Search Console credentials are incomplete");
    const [urls, performance] = await Promise.all([
      Promise.all(authorityTop25.map((row) => inspectGoogleUrl(token, siteUrl, row.exactUrl))),
      fetchSearchPerformance(token, siteUrl),
    ]);
    const allFailed = urls.length > 0 && urls.every((row) => row.error);
    return {
      state: allFailed ? "error" : "connected",
      checkedAt: new Date().toISOString(),
      siteUrl,
      urls,
      performance,
      ...(allFailed ? { error: "All URL Inspection requests failed" } : {}),
    };
  } catch (error) {
    return {
      state: "error",
      checkedAt: new Date().toISOString(),
      siteUrl,
      urls: [],
      performance: emptySearchPerformance(
        "error",
        "Google Search Console Search Analytics API",
        safeError(error),
      ),
      error: safeError(error),
    };
  }
}

async function getProviderSnapshot() {
  if (providerCache && providerCache.expiresAt > Date.now()) return providerCache.value;
  const [ahrefs, moz, searchConsole] = await Promise.all([
    fetchAhrefsAuthority(),
    fetchMozAuthority(),
    fetchSearchConsole(),
  ]);
  const value = { ahrefs, moz, searchConsole };
  providerCache = { expiresAt: Date.now() + PROVIDER_CACHE_MS, value };
  return value;
}

function firstMatch(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1]?.trim() || null;
}

export function parseSeoHtml(html: string, xRobotsTag = "") {
  const robots = [
    xRobotsTag,
    ...Array.from(
      html.matchAll(
        /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/gi,
      ),
      (match) => match[1],
    ),
  ]
    .join(",")
    .toLowerCase();

  return {
    title: firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    canonical:
      firstMatch(
        html,
        /<link[^>]+rel=["'][^"']*canonical[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/i,
      ) ||
      firstMatch(
        html,
        /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*canonical[^"']*["'][^>]*>/i,
      ),
    noindex: /(?:^|[,\s])noindex(?:[,\s]|$)/i.test(robots),
  };
}

export async function inspectPage(url: string): Promise<LivePageCheck> {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": "Temporary123-SEO-Dashboard/1.0" },
      signal: AbortSignal.timeout(8_000),
    });
    const location = response.headers.get("location");
    const contentType = response.headers.get("content-type") || "";
    const html =
      response.status === 200 && contentType.includes("text/html")
        ? (await response.text()).slice(0, 1_000_000)
        : "";
    const parsed = html
      ? parseSeoHtml(html, response.headers.get("x-robots-tag") || "")
      : { title: null, canonical: null, noindex: null };
    return {
      url,
      status: response.status,
      finalUrl: response.url || url,
      redirectLocation: location,
      responseMs: Date.now() - started,
      ...parsed,
      error: null,
    };
  } catch (error) {
    return {
      url,
      status: null,
      finalUrl: null,
      redirectLocation: null,
      responseMs: Date.now() - started,
      canonical: null,
      title: null,
      noindex: null,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

async function inspectText(url: string) {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": "Temporary123-SEO-Dashboard/1.0" },
      signal: AbortSignal.timeout(8_000),
    });
    const text = response.status === 200 ? (await response.text()).slice(0, 2_000_000) : "";
    return {
      url,
      status: response.status,
      responseMs: Date.now() - started,
      entries: Array.from(text.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)).length,
      error: null,
    };
  } catch (error) {
    return {
      url,
      status: null,
      responseMs: Date.now() - started,
      entries: 0,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

async function inspectHost(origin: string) {
  const [homepage, robots, ...sitemaps] = await Promise.all([
    inspectPage(`${origin}/`),
    inspectText(`${origin}/robots.txt`),
    inspectText(`${origin}/sitemap.xml`),
    inspectText(`${origin}/sitemap_index.xml`),
    inspectText(`${origin}/wp-sitemap.xml`),
  ]);
  return {
    origin,
    homepage,
    robots,
    sitemap: sitemaps.find((item) => item.status === 200) || sitemaps[0],
  };
}

export async function createLiveSeoSnapshot() {
  const [production, preview, priorityUrls, providers] = await Promise.all([
    inspectHost(SEO_ORIGINS.production),
    inspectHost(SEO_ORIGINS.preview),
    Promise.all(
      authorityTop25.map(async (row) => {
        const [productionCheck, previewCheck] = await Promise.all([
          inspectPage(row.exactUrl),
          inspectPage(`${SEO_ORIGINS.preview}${row.exactPath}`),
        ]);
        return { rank: row.rank, production: productionCheck, preview: previewCheck };
      }),
    ),
    getProviderSnapshot(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    evidence: "Live server-side HTTP checks with cached provider evidence",
    refreshSeconds: 300,
    production,
    preview,
    priorityUrls,
    providers,
    providerBoundaries: {
      googleIndexing: providers.searchConsole.state,
      domainAuthority: providers.moz.state,
      domainRating: providers.ahrefs.state,
    },
  };
}
