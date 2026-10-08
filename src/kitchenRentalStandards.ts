// Project-specific application of the shared standards. No DA score, local
// depot, delivery deadline or installation duration is inferred here.
export const kitchenModelPaths = [
  "/services/mobile-kitchen-trailers/24ft/",
  "/services/mobile-kitchen-trailers/26ft-bulk/",
  "/services/mobile-kitchen-trailers/28ft/",
  "/services/mobile-kitchen-trailers/38ft/",
  "/services/mobile-kitchen-trailers/40ft/",
] as const;

export const kitchenSeed = (name: string) =>
  [...name].reduce((total, letter) => total + letter.charCodeAt(0), 0) % 5;

export function kitchenLocationHeadline(state: string, region?: string) {
  const location = region && region !== state ? `${state} ${region}` : state;
  const subjects = [
    "Emergency Commercial Kitchen Trailer Rentals",
    "Mobile Kitchen Trailer Rentals for Temporary Food Service",
    "Commercial Mobile Kitchen Trailers for Rent",
    "Temporary Kitchen Trailer Rentals for Planned and Emergency Projects",
    "Short-Term and Long-Term Mobile Kitchen Trailer Rentals",
  ];
  return `${location} ${subjects[kitchenSeed(location)]}`;
}

export function kitchenLocationIntro(location: string) {
  const uses = [
    "renovations, equipment failures and scheduled facility work",
    "temporary closures, construction projects and urgent outages",
    "kitchen repairs, capacity changes and planned renovations",
    "facility transitions, equipment replacement and emergency operations",
    "remodeling, service interruptions and urgent recovery work",
  ];
  return `Mobile kitchen trailer rentals help maintain commercial food service in ${location} during ${uses[kitchenSeed(location)]}. Plan temporary cooking for emergency and planned needs. Short-term and long-term rental enquiries can support hospitals, nursing homes, schools, correctional institutions, military sites, industrial facilities and hotels. Share your menu, meal volume and staffing needs to review the kitchen layout. Coordinate delivery access, placement, power, water and drainage before confirming the rental schedule. Contact Mobile Kitchen Rental to request availability or a project-specific quote for ${location}.`;
}

export function kitchenLocationDescription(location: string) {
  return `${location} commercial mobile kitchen trailer rentals. Plan temporary cooking, utilities, delivery access and rental dates; confirm availability with our team.`;
}
