import site from "../../site.json" with { type: "json" };
import { serviceCategories } from "../serviceMenu";
import type { GuideConfig, Topic } from "../../packages/website-guide/src/core";
const phrases: Record<string, string[]> = {
  "Mobile Kitchens": ["kitchen", "kitchens", "cooking"],
  Dishwashing: ["dishwashing", "dishwasher", "dishwashers"],
  Refrigeration: ["refrigeration", "refrigerated", "cold storage", "freezer"],
  Shower: ["shower", "showers"],
  Restroom: ["restroom", "restrooms", "toilet", "toilets"],
  "Shower and Restroom Combination Trailers": [
    "shower and restroom",
    "shower restroom",
    "shower restroom combination",
  ],
  Sleeper: ["sleeper", "sleepers", "sleeping", "berthing"],
  Laundry: ["laundry", "washing machines"],
  "Handwashing Trailers": ["handwashing", "hand washing"],
};
const equipment: Topic[] = serviceCategories.map((category) => ({
  id: `equipment-${category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  title: category.name,
  phrases: phrases[category.name] ?? [category.name],
  priority:
    category.name === "Shower and Restroom Combination Trailers" ? 10 : 0,
  answer: category.description,
  actions: [{ label: `Explore ${category.name}`, href: category.href }],
  followUp: "quote",
}));
export const temporaryGuide: GuideConfig = {
  siteId: "temporary123",
  title: "Rental guide",
  accent: "#164e63",
  position: "left",
  bottom: 88,
  greeting:
    "Welcome to Temporary123. I can help you find rental equipment, service information and the quote process. These are prepared website answers—not live availability or a final quote. What would you like to find?",
  fallback:
    "I don't have a prepared answer for that question. Choose a topic below or contact the team for project-specific help. Please don't enter sensitive information here.",
  contact: { label: "Contact the rental team", href: "/contact-us/" },
  suggestions: ["equipment", "pricing", "areas", "quote"],
  topics: [
    ...equipment,
    {
      id: "equipment",
      title: "Browse equipment",
      phrases: ["equipment", "services", "what do you rent", "rental options"],
      answer:
        "Explore commercial and institutional rental equipment, including kitchens, dishwashing, refrigeration, showers, restrooms, sleeping facilities, laundry and handwashing.",
      actions: [{ label: "All rental equipment", href: "/equipment-rental/" }],
      followUp: "quote",
    },
    {
      id: "pricing",
      title: "Pricing & estimates",
      priority: 100,
      phrases: [
        "price",
        "prices",
        "pricing",
        "cost",
        "costs",
        "how much",
        "rate",
        "rates",
        "budget",
      ],
      answer:
        "Pricing depends on the equipment and project requirements. The rental calculator shows starting estimates, not a final quote or confirmed availability. Contact the team for a project-specific quote.",
      actions: [
        { label: "Open rental calculator", href: "/rental-calculator/" },
        { label: "Request a quote", href: "/contact-us/" },
      ],
      followUp: "quote",
    },
    {
      id: "areas",
      title: "Service areas",
      phrases: [
        "service area",
        "service areas",
        "where",
        "location",
        "locations",
        "delivery",
        "deliver",
        "nationwide",
      ],
      answer:
        "Use the service-area directory to explore US locations. The team must confirm delivery arrangements and equipment availability for your project address.",
      actions: [{ label: "Explore service areas", href: "/service-areas/" }],
      followUp: "quote",
    },
    {
      id: "quote",
      title: "How to request a quote",
      priority: 30,
      phrases: [
        "quote",
        "contact",
        "call",
        "phone",
        "book",
        "booking",
        "reserve",
      ],
      answer:
        "Tell the team what equipment you need, the project location, dates and expected number of users. Use the existing inquiry form or call. This guide does not submit inquiries or reserve equipment.",
      actions: [
        { label: "Open quote form", href: "/contact-us/" },
        { label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneE164}` },
      ],
    },
    {
      id: "availability",
      title: "Availability",
      priority: 50,
      phrases: ["available", "availability", "in stock", "emergency", "urgent"],
      answer:
        "This guide cannot check live inventory or guarantee delivery times. Contact the team directly to confirm equipment availability and discuss urgent requirements.",
      actions: [
        { label: "Contact the team", href: "/contact-us/" },
        { label: "Call the team", href: `tel:${site.phoneE164}` },
      ],
    },
  ],
};
