export type Action = { label: string; href: string };
export type Topic = {
  id: string;
  title: string;
  phrases: string[];
  priority?: number;
  answer: string;
  actions?: Action[];
  followUp?: string;
};
export type GuideConfig = {
  siteId: string;
  title: string;
  greeting: string;
  fallback: string;
  topics: Topic[];
  suggestions: string[];
  contact?: Action;
  accent?: string;
  position?: "left" | "right";
  bottom?: number;
};
export type Reply = {
  text: string;
  actions: Action[];
  suggestions: string[];
  intentId?: string;
};
export const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
export function safeHref(href: string): boolean {
  if (/^[\s]*[\/\\]{2}|\\|[\u0000-\u001f]/.test(href)) return false;
  try {
    return ["https:", "http:", "tel:", "mailto:"].includes(
      new URL(href, "https://example.invalid").protocol,
    );
  } catch {
    return false;
  }
}
export function validateConfig(config: GuideConfig): void {
  if (
    !config.siteId ||
    !config.title ||
    !config.greeting ||
    !config.fallback ||
    !config.topics.length
  )
    throw new Error(
      "Guide needs a site ID, title, greeting, fallback and topics.",
    );
  const ids = new Set<string>();
  for (const topic of config.topics) {
    if (
      !topic.id ||
      ids.has(topic.id) ||
      !topic.answer ||
      !topic.phrases.length ||
      topic.phrases.some((p) => !normalize(p))
    )
      throw new Error("Invalid or duplicate guide topic.");
    ids.add(topic.id);
  }
  if (
    config.suggestions.some((id) => !ids.has(id)) ||
    config.topics.some((t) => t.followUp && !ids.has(t.followUp))
  )
    throw new Error("Unknown guide topic reference.");
  for (const action of [
    ...config.topics.flatMap((t) => t.actions ?? []),
    ...(config.contact ? [config.contact] : []),
  ])
    if (!safeHref(action.href)) throw new Error("Unsafe guide link.");
  if (config.accent && !/^#[0-9a-f]{6}$/i.test(config.accent))
    throw new Error("Accent must be a six-digit hex color.");
  if (config.position && !["left", "right"].includes(config.position))
    throw new Error("Invalid guide position.");
  if (
    config.bottom !== undefined &&
    (!Number.isFinite(config.bottom) ||
      config.bottom < 0 ||
      config.bottom > 500)
  )
    throw new Error("Invalid guide offset.");
}
/** Deterministic, page-memory-only answers. No network, storage or generated claims. */
export function createGuide(source: GuideConfig) {
  const config: GuideConfig = JSON.parse(JSON.stringify(source));
  validateConfig(config);
  let previous: string | undefined;
  const initial = (): Reply => ({
    text: config.greeting,
    actions: [],
    suggestions: config.suggestions,
  });
  const select = (id: string): Reply => {
    const topic = config.topics.find((t) => t.id === id);
    if (!topic) return fallback();
    previous = topic.id;
    return {
      text: topic.answer,
      actions: topic.actions ?? [],
      suggestions: topic.followUp ? [topic.followUp] : config.suggestions,
      intentId: topic.id,
    };
  };
  const fallback = (): Reply => ({
    text: config.fallback,
    actions: config.contact ? [config.contact] : [],
    suggestions: config.suggestions,
  });
  return {
    initial,
    select,
    reset(): Reply {
      previous = undefined;
      return initial();
    },
    respond(raw: string): Reply {
      const query = normalize(raw.slice(0, 400));
      if (!query) return initial();
      if (["reset", "restart", "start over"].includes(query)) {
        previous = undefined;
        return initial();
      }
      if (["hi", "hello", "hey"].includes(query)) return initial();
      if (["thanks", "thank you"].includes(query))
        return {
          text: "You're welcome. What else can I help you find?",
          actions: [],
          suggestions: config.suggestions,
        };
      if (["yes", "tell me more", "more"].includes(query) && previous) {
        const next = config.topics.find((t) => t.id === previous)?.followUp;
        if (next) return select(next);
      }
      const matches = config.topics
        .map((topic) => ({
          topic,
          score: Math.max(
            0,
            ...topic.phrases
              .filter((p) => ` ${query} `.includes(` ${normalize(p)} `))
              .map((p) => normalize(p).split(" ").length),
          ),
        }))
        .filter((m) => m.score > 0);
      matches.sort(
        (a, b) =>
          (b.topic.priority ?? 0) - (a.topic.priority ?? 0) ||
          b.score - a.score,
      );
      if (!matches.length) return fallback();
      const top = matches[0];
      const tied = matches.filter(
        (m) => (m.topic.priority ?? 0) === (top.topic.priority ?? 0),
      );
      if (tied.length > 1)
        return {
          text: "Which topic would you like to explore?",
          actions: [],
          suggestions: tied.slice(0, 6).map((m) => m.topic.id),
        };
      return select(top.topic.id);
    },
  };
}
