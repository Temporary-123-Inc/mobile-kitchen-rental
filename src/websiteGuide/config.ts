import site from "../../site.json" with { type: "json" };
import { serviceCategories } from "../serviceMenu";
import type { GuideConfig, Topic } from "../../packages/website-guide/src/core";
import { businessTopics } from "../../packages/website-guide/src/core";
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
  answer: `${category.description}\n\nListed options: ${category.links.map((link) => link.name).join("; ")}. Confirm the configuration and availability with the rental team.`,
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
    "Welcome to Temporary123. Ask me about our phone number, 24/7 rental team, equipment options, nationwide service, site preparation or quote process. I answer from prepared website information—not live inventory or final quotes.",
  fallback:
    "I don't have a prepared answer for that question. Choose a topic below or contact the team for project-specific help. Please don't enter sensitive information here.",
  contact: { label: "Contact the rental team", href: "/contact-us/" },
  suggestions: ["business-phone", "equipment", "pricing", "areas", "quote"],
  topics: [
    ...businessTopics({
      name: site.brand,
      phone: { display: site.phoneDisplay, href: `tel:${site.phoneE164}` },
      hours: `The Temporary123 rental team is available 24/7. Call ${site.phoneDisplay}. Equipment availability and dispatch timing require confirmation.`,
      about: "Temporary123 provides nationwide rental and leasing of temporary facilities for commercial and institutional projects, including kitchens, dishwashing, refrigeration, showers, restrooms, sleeping facilities, laundry and handwashing.",
    }),
    ...equipment,
    {
      id: "utilities", title: "Utilities & site preparation", priority: 40,
      phrases: ["utilities", "power", "water", "wastewater", "electricity", "site preparation", "site access", "connections"],
      answer: "Check vehicle access, space for the equipment and available power, water and wastewater connections. Share site restrictions with your specialist. Exact connections and setup depend on the selected equipment and must be confirmed in your proposal.",
      followUp: "quote",
    },
    {
      id: "combined", title: "Rent several facilities together", priority: 40,
      phrases: ["several facilities", "multiple facilities", "rent together", "package", "several types", "bundle"],
      answer: "Yes. Discuss your kitchen, refrigeration, restroom, shower and workforce requirements in one conversation so the facilities can be planned around your operation. The rental team must confirm the equipment combination and availability.",
      followUp: "quote",
    },
    {
      id: "duration", title: "Rental period", priority: 40,
      phrases: ["rental period", "how long", "rental duration", "lease", "leasing", "minimum rental"],
      answer: "Temporary123 offers rental and leasing. Provide your preferred start and end dates and expected rental duration. Minimum periods, extensions and contract terms need confirmation from the rental team for your selected equipment; this guide cannot approve them.",
      followUp: "quote",
    },
    {
      id: "email", title: "Email contact", priority: 120,
      phrases: ["email", "e mail", "email address"],
      answer: `I do not have a verified public email address in this guide. You can send your project details through the inquiry form or call ${site.phoneDisplay}.`,
      actions: [{ label: "Open inquiry form", href: "/contact-us/" }],
    },
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
        "Temporary123 provides nationwide rental and leasing across the United States. Share your project city, state and site address so the team can confirm delivery access, arrangements and equipment availability. Nationwide service is not a guarantee that every unit is immediately available in every location.",
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
        "book",
        "booking",
        "reserve",
      ],
      answer:
        `To request a quote, call ${site.phoneDisplay} or use the inquiry form. Share the equipment you need, project location, start/end dates, expected rental duration and number of users. For kitchens, include your menu and meal volume. Mention utility connections and delivery restrictions. This guide does not submit inquiries or reserve equipment.`,
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
        `Call ${site.phoneDisplay} for urgent requirements; the rental team is available 24/7. Explain your location, equipment needs and required dates. This guide cannot check live inventory or guarantee delivery times; the team must confirm availability and dispatch.`,
      actions: [
        { label: "Contact the team", href: "/contact-us/" },
        { label: "Call the team", href: `tel:${site.phoneE164}` },
      ],
    },
  ],
};
