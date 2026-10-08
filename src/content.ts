import site from "../site.json" with { type: "json" };
export const services = [
  { slug: "mobile-kitchens", name: "Mobile kitchens" },
  { slug: "dishwashing", name: "Dishwashing" },
  { slug: "refrigeration", name: "Refrigeration" },
  { slug: "restroom-shower-trailers", name: "Restroom & shower trailers" },
  { slug: "sleeper", name: "Sleeper" },
  { slug: "laundry", name: "Laundry" },
  { slug: "sink", name: "Sink" },
  { slug: "workforce-housing", name: "Workforce housing" },
  { slug: "temporary-facilities", name: "Temporary facilities" },
];
export const routes = [
  "/",
  "/services/",
  "/equipment-rental/",
  "/industries/",
  "/service-areas/",
  "/rental-calculator/",
  "/planning/",
  "/about-us/",
  "/blog/",
  "/contact-us/",
  "/privacy/",
];
const titles: Record<string, string> = {
  "/": "Emergency Commercial Mobile Kitchen Rentals: Short-Term or Long-Term Use",
  "/services/": "Commercial Kitchen Trailer Rental Solutions",
  "/equipment-rental/": "Commercial Kitchen Trailer Rental Equipment",
  "/industries/": "Commercial Kitchen Trailer Rentals for Institutions and Industry",
  "/service-areas/": "USA Commercial Kitchen Trailer Rental Service Areas",
  "/seo-dashboard/": "SEO Migration Dashboard",
  "/rental-calculator/":
    "Commercial Kitchen Trailer Rental and Delivery Calculator",
  "/planning/": "Plan Your Commercial Kitchen Trailer Rental",
  "/about-us/": "About Mobile Kitchen Rental",
  "/blog/": "Commercial Kitchen Trailer Rental Planning Guides",
  "/contact-us/": "Contact Our Team",
  "/privacy/": "Privacy",
};
const descriptions: Record<string, string> = {
  "/": "Commercial mobile kitchen trailer rentals for planned renovations and emergency food service nationwide. Discuss short-term or long-term needs with our 24/7 team.",
  "/equipment-rental/":
    "Compare commercial mobile kitchen trailer layouts for temporary cooking and preparation. Confirm the available model, site access, utilities and rental dates.",
  "/services/":
    "Plan equipment, site access, utilities and delivery for your commercial kitchen trailers. Talk through your project requirements with the Mobile Kitchen Rental team.",
  "/industries/":
    "Explore commercial kitchen trailer support for construction, government, food service and emergency response projects. Find equipment for your operation.",
  "/service-areas/":
    "Find commercial kitchen trailer rental guides across the USA. Review regional access and utility planning; call our 24/7 team to confirm availability and delivery.",
  "/seo-dashboard/":
    "Owner-facing Mobile Kitchen Rental migration dashboard for crawl health, city landing pages, priority authority URLs, and controlled SEO release readiness.",
  "/rental-calculator/":
    "Calculate published starting prices for nationwide commercial kitchen trailer rental and trailer delivery, then contact Mobile Kitchen Rental for a project-specific quote.",
  "/planning/":
    "Prepare your commercial kitchen trailer brief with site access, utilities, occupancy and rental dates. Use the Mobile Kitchen Rental project planning guide before you call.",
  "/about-us/":
    "Learn how Mobile Kitchen Rental helps commercial and institutional teams plan kitchen trailer rentals, meal production, utility connections and delivery access.",
  "/blog/":
    "Read practical mobile kitchen trailer rental guides covering commercial meal production, power, water, drainage, delivery access and site planning.",
  "/contact-us/":
    `Call Mobile Kitchen Rental at ${site.phoneDisplay}, available 24/7. Discuss equipment availability, your project location, rental dates and delivery requirements.`,
  "/privacy/":
    "Read how this Mobile Kitchen Rental website handles visitor information and contact the team with questions about your information.",
};
export function pageInfo(path: string) {
  return {
    title: `${titles[path] || "Page not found"} | ${site.brand}`,
    description:
      descriptions[path] ||
      `Find the right facility for your project. Explore Mobile Kitchen Rental equipment or call ${site.phoneDisplay} for help.`,
  };
}
