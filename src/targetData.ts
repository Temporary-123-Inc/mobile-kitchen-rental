import usStates from "./usStates.json" with { type: "json" };

export const brand = {
  name: "Mobile Kitchen Rental",
  legalName: "Temporary 123",
  origin: "https://mobile-kitchen-rental.com",
  phoneDisplay: "+1 (888) 563-6507",
  phoneE164: "+18885636507",
};

export const primaryPhrase = "Mobile Commercial Kitchen Trailer Rentals";

export const kitchenFamilySentence =
  "Mobile kitchen rentals, dishwashing trailers, commercial refrigeration trailers, walk-in coolers, freezers, and refrigerated containers.";

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export type Service = {
  slug: string;
  label: string;
  shortLabel: string;
  h1: string;
  description: string;
  planning: string[];
  image: string;
  imageSmall: string;
  alt: string;
};

export const services: Service[] = [
  {
    slug: "mobile-kitchen-rentals",
    label: "Mobile Commercial Kitchen Trailer Rentals",
    shortLabel: "Mobile kitchens",
    h1: "Mobile Commercial Kitchen Trailer Rentals for Operational Continuity",
    description:
      "Mobile commercial kitchen trailer rentals create temporary cooking, preparation, and service space when a permanent kitchen is unavailable or extra capacity is required. Plan the cooking line, menu, meal volume, staff flow, utilities, site access, and rental schedule together. Short-term and long-term configurations are confirmed for the specific project, and availability, delivery, placement, and setup details require coordination before mobilization.",
    planning: [
      "Menu and meal volume",
      "Cooking and preparation flow",
      "Power, fuel, water, and wastewater",
      "Delivery access and operating dates",
    ],
    image: "/images/service-heroes/40ft-mobile-kitchen/03-960.webp",
    imageSmall: "/images/service-heroes/40ft-mobile-kitchen/03-480.webp",
    alt: "Stainless steel commercial cooking line inside a mobile kitchen trailer",
  },
  {
    slug: "dishwashing-trailer-rentals",
    label: "Portable Commercial Dishwashing Trailer Rentals",
    shortLabel: "Dishwashing trailers",
    h1: "Portable Commercial Dishwashing Trailer Rentals for Temporary Warewashing",
    description:
      "Portable commercial dishwashing trailer rentals add dedicated warewashing capacity to temporary and expanded food-service operations. Use the project brief to confirm item volume, dirty-to-clean flow, machine configuration, hot-water needs, electrical service, chemicals, drainage, staffing, and rental dates. The selected trailer, utilities, delivery approach, commissioning scope, and current availability are reviewed for each site rather than assumed from a generic equipment label.",
    planning: [
      "Peak item and rack volume",
      "Dirty-to-clean workflow",
      "Hot water, power, and drainage",
      "Chemical and staffing responsibilities",
    ],
    image: "/images/service-heroes/40ft-combination-kitchen/04-960.webp",
    imageSmall: "/images/service-heroes/40ft-combination-kitchen/04-480.webp",
    alt: "Commercial stainless steel warewashing equipment in a temporary trailer facility",
  },
  {
    slug: "commercial-refrigeration-trailer-rentals",
    label: "Commercial Refrigeration Trailer Rentals",
    shortLabel: "Refrigeration trailers",
    h1: "Commercial Refrigeration Trailer Rentals for Temporary Cold Storage",
    description:
      "Commercial refrigeration trailer rentals support temporary ingredient, prepared-food, and supply storage during planned work, emergencies, and seasonal capacity changes. Confirm the product, required operating range, loading pattern, door activity, power source, monitoring responsibility, placement, and rental duration before selecting a unit. Final equipment, temperature capability, availability, delivery timing, and site requirements depend on the reviewed project and chosen configuration.",
    planning: [
      "Product and operating range",
      "Loading and door-opening pattern",
      "Power and monitoring responsibility",
      "Placement and rental duration",
    ],
    image: "/images/service-heroes/20ft-refrigerated-trailer/01-960.webp",
    imageSmall: "/images/service-heroes/20ft-refrigerated-trailer/01-480.webp",
    alt: "Commercial refrigeration trailer prepared for temporary cold storage",
  },
  {
    slug: "walk-in-cooler-rentals",
    label: "Portable Walk-In Cooler Facility Rentals",
    shortLabel: "Walk-in coolers",
    h1: "Portable Walk-In Cooler Facility Rentals for Planned and Emergency Use",
    description:
      "Portable walk-in cooler facility rentals provide temporary refrigerated holding space for commercial and institutional food-service projects. Planning starts with the stored product, target range, loading access, usable space, electrical supply, ambient conditions, cleaning responsibility, and rental dates. The team then confirms an appropriate configuration, delivery route, placement area, current availability, and operating requirements for short-term or long-term use at the project site.",
    planning: [
      "Stored product and target range",
      "Usable space and loading access",
      "Power and ambient conditions",
      "Cleaning and monitoring responsibility",
    ],
    image: "/images/service-heroes/20ft-refrigerated-trailer/02-960.webp",
    imageSmall: "/images/service-heroes/20ft-refrigerated-trailer/02-480.webp",
    alt: "Interior reference view of commercial refrigerated storage equipment",
  },
  {
    slug: "walk-in-freezer-rentals",
    label: "Portable Walk-In Freezer Facility Rentals",
    shortLabel: "Walk-in freezers",
    h1: "Portable Walk-In Freezer Facility Rentals for Temporary Operations",
    description:
      "Portable walk-in freezer facility rentals help commercial kitchens maintain frozen storage while permanent equipment is repaired, renovated, or supplemented. Share the product, required range, loading plan, electrical service, access constraints, placement conditions, monitoring needs, and rental period. Equipment capability varies by configuration, so availability, operating requirements, delivery coordination, and setup scope are confirmed for the actual unit and project before use.",
    planning: [
      "Frozen product and range",
      "Loading plan and usable capacity",
      "Electrical service and placement",
      "Monitoring and operating responsibility",
    ],
    image: "/images/service-heroes/20ft-refrigerated-trailer/03-960.webp",
    imageSmall: "/images/service-heroes/20ft-refrigerated-trailer/03-480.webp",
    alt: "Commercial freezer trailer exterior for temporary frozen storage planning",
  },
  {
    slug: "refrigerated-container-rentals",
    label: "Commercial Refrigerated Container Rentals",
    shortLabel: "Refrigerated containers",
    h1: "Commercial Refrigerated Container Rentals for Project Cold Storage",
    description:
      "Commercial refrigerated container rentals provide ground-level temporary cold-storage capacity for projects that can support the selected container and its utilities. Confirm the stored material, operating range, door access, loading method, electrical connection, placement surface, site clearance, monitoring, and rental dates. Short-term and long-term arrangements remain subject to the chosen unit, project location, delivery route, setup conditions, and current availability.",
    planning: [
      "Stored material and operating range",
      "Ground-level loading method",
      "Electrical connection and monitoring",
      "Placement surface and delivery clearance",
    ],
    image: "/images/service-heroes/20ft-refrigerated-trailer/04-960.webp",
    imageSmall: "/images/service-heroes/20ft-refrigerated-trailer/04-480.webp",
    alt: "Refrigerated commercial container used for temporary project cold storage",
  },
];

const scenarios = [
  "renovations and scheduled shutdowns",
  "equipment failures and emergency continuity",
  "planned maintenance and temporary closures",
  "facility upgrades and added production demand",
  "disaster recovery and operational transitions",
];
const audiences = [
  "hospitals, nursing homes, schools, and correctional facilities",
  "restaurants, hotels, campuses, and government operations",
  "healthcare teams, education systems, hospitality groups, and public agencies",
  "institutional kitchens, commercial operators, and emergency-response programs",
  "food-service directors, facility managers, contractors, and government teams",
];
const coordination = [
  "equipment selection, site access, utilities, delivery, placement, and setup",
  "the equipment mix, connection needs, delivery route, placement, and setup sequence",
  "facility selection, power and water planning, delivery access, positioning, and startup",
  "the rental configuration, site constraints, transport, placement, and commissioning details",
  "equipment matching, utility readiness, delivery timing, placement, and setup responsibilities",
];
const openings = [
  "Keep food service moving",
  "Maintain safe food-service operations",
  "Protect meal production and cold-storage continuity",
  "Restore temporary cooking, warewashing, and refrigeration capacity",
  "Plan dependable temporary food-service space",
];

const kitchenImages = [
  [
    "/images/service-heroes/24ft-mobile-kitchen/01-960.webp",
    "Commercial preparation equipment inside a mobile kitchen trailer",
  ],
  [
    "/images/service-heroes/24ft-mobile-kitchen/03-960.webp",
    "Stainless steel cooking line in a temporary mobile kitchen",
  ],
  [
    "/images/service-heroes/28ft-mobile-kitchen/02-960.webp",
    "Commercial mobile kitchen interior arranged for food preparation",
  ],
  [
    "/images/service-heroes/28ft-mobile-kitchen/05-960.webp",
    "Temporary kitchen trailer work area with commercial equipment",
  ],
  [
    "/images/service-heroes/38ft-mobile-kitchen/01-960.webp",
    "Large mobile kitchen trailer interior for commercial food service",
  ],
  [
    "/images/service-heroes/40ft-mobile-kitchen/06-960.webp",
    "Commercial cooking equipment inside a forty-foot mobile kitchen",
  ],
  [
    "/images/service-heroes/40ft-combination-kitchen/02-960.webp",
    "Combination mobile kitchen workspace for temporary operations",
  ],
  [
    "/images/service-heroes/40ft-combination-kitchen/06-960.webp",
    "Commercial kitchen equipment arranged inside a temporary facility",
  ],
  [
    "/images/service-heroes/20ft-refrigerated-trailer/01-960.webp",
    "Commercial refrigeration trailer for temporary cold storage",
  ],
  [
    "/images/service-heroes/20ft-refrigerated-trailer/02-960.webp",
    "Refrigerated equipment interior used for temporary storage planning",
  ],
  [
    "/images/service-heroes/20ft-refrigerated-trailer/03-960.webp",
    "Temporary commercial freezer trailer exterior",
  ],
  [
    "/images/service-heroes/20ft-refrigerated-trailer/04-960.webp",
    "Commercial refrigerated storage equipment for project use",
  ],
] as const;

export const states = [...usStates]
  .map(({ name, id, d, x, y }) => ({ name, id, d, x, y }))
  .sort((a, b) => a.name.localeCompare(b.name));

export type StateGuide = (typeof states)[number] & {
  slug: string;
  path: string;
  h1: string;
  description: string;
  images: { src: string; alt: string }[];
  layout: number;
};

export const stateGuides: StateGuide[] = states.map((state, index) => {
  const scenario = scenarios[index % scenarios.length];
  const audience = audiences[(index * 2 + 1) % audiences.length];
  const logistics = coordination[(index * 3 + 2) % coordination.length];
  const opening = openings[(index * 4 + 3) % openings.length];
  const h1Variants = [
    `${state.name} Emergency Mobile Kitchen Rentals with Dishwashing Trailers, Walk-In Coolers & Freezers`,
    `${state.name} Planned Mobile Kitchen Rentals, Dishwashing Trailers & Commercial Refrigeration`,
    `${state.name} Mobile Kitchen Rentals for Emergency and Long-Term Food-Service Projects`,
    `${state.name} Commercial Mobile Kitchen Rentals with Cooler, Freezer & Warewashing Support`,
  ];
  const description = `${opening} during ${scenario} with mobile kitchen rentals across ${state.name}. The kitchen family includes dishwashing trailers, commercial refrigeration trailers, walk-in coolers, freezers, and refrigerated containers for ${audience}. Short-term rentals can bridge an urgent interruption, while long-term rentals can support renovations, replacement projects, or extended capacity needs. Our team coordinates ${logistics} around the selected site and schedule. Request availability or a project quote for your ${state.name} location.`;
  const start = index % kitchenImages.length;
  const offsets = [0, 4 + (index % 3), 8 + (index % 4)];
  const images = offsets.map((offset) => {
    const [src, alt] = kitchenImages[(start + offset) % kitchenImages.length];
    return { src, alt: `${state.name}: ${alt}` };
  });
  return {
    ...state,
    slug: slugify(state.name),
    path: `/service-areas/${slugify(state.name)}/`,
    h1: h1Variants[index % h1Variants.length],
    description,
    images,
    layout: index % 4,
  };
});

export const coreRoutes = [
  "/",
  "/equipment-rental/",
  ...services.map((service) => `/equipment-rental/${service.slug}/`),
  "/service-areas/",
  "/planning/",
  "/about-us/",
  "/contact-us/",
  "/privacy/",
];

export const allRoutes = [
  ...coreRoutes,
  ...stateGuides.map((state) => state.path),
];

export const routeTitle = (path: string) => {
  if (path === "/")
    return "Mobile Commercial Kitchen Trailer Rentals Nationwide";
  if (path === "/equipment-rental/")
    return "Mobile Kitchen, Dishwashing & Refrigeration Rental Inventory";
  if (path === "/service-areas/")
    return "Mobile Kitchen Rental Service Areas by State";
  if (path === "/planning/") return "Plan a Mobile Kitchen Rental Project";
  if (path === "/about-us/") return "About Mobile Kitchen Rental";
  if (path === "/contact-us/")
    return "Request Mobile Kitchen Rental Availability";
  if (path === "/privacy/") return "Privacy Notice";
  const service = services.find(
    (item) => path === `/equipment-rental/${item.slug}/`,
  );
  if (service) return service.h1;
  const state = stateGuides.find((item) => item.path === path);
  if (state) return state.h1;
  return "Page not found";
};

export const routeDescription = (path: string) => {
  if (path === "/")
    return "Plan mobile commercial kitchen trailer rentals with dishwashing and temporary refrigeration support for commercial and institutional projects.";
  const service = services.find(
    (item) => path === `/equipment-rental/${item.slug}/`,
  );
  if (service) return service.description;
  const state = stateGuides.find((item) => item.path === path);
  if (state) return state.description;
  if (path === "/service-areas/")
    return "Browse all 50 state guides for focused mobile kitchen, dishwashing, and refrigeration rental planning.";
  return "Plan mobile kitchen, dishwashing, and temporary refrigeration rentals with Temporary 123.";
};
