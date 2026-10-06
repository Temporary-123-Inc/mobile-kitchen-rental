import type { ServiceCategory } from "./serviceMenu";
import {
  imagesForServicePath,
  type ServiceHeroImage,
} from "./serviceHeroImages";

/**
 * Representative paths are matched to the equipment families in the
 * owner-supplied spreadsheet. Exact model photography still wins for cards.
 */
const representativePathByCategory: Readonly<Record<string, string>> = {
  "Mobile Kitchens": "/services/mobile-kitchen-trailers/24ft/",
  Dishwashing: "/services/dishwashing-trailers/22ft/",
  Refrigeration: "/equipment-rental-refrigeration-12ft-refrigerated-trailer/",
  Shower: "/media-library/20ft-shower-trailer-sink/",
  Restroom: "/services/restroom-trailers/12ft/",
  "Shower and Restroom Combination Trailers":
    "/services/shower-restroom-combination-trailers/8-stall-1-ada/",
  Sleeper: "/services/mobile-sleeper-trailers/20ft-shared/",
  Laundry: "/services/laundry-trailers/24ft/",
  "Handwashing Trailers": "/equipment-rental/handwashing-stations/",
};

function preferredImage(
  images: readonly ServiceHeroImage[] | undefined,
): ServiceHeroImage | undefined {
  if (!images?.length) return undefined;
  return (
    images.find((image) => image.view === "exterior") ??
    images.find((image) => image.view === "interior") ??
    images[0]
  );
}

export function serviceCategoryHeroImage(
  category: ServiceCategory,
): ServiceHeroImage | undefined {
  const representativePath = representativePathByCategory[category.name];
  return preferredImage(
    representativePath
      ? imagesForServicePath(representativePath)
      : imagesForServicePath(category.links[0]?.href ?? ""),
  );
}

export function serviceCardImage(
  path: string,
  category: ServiceCategory,
): ServiceHeroImage | undefined {
  return (
    preferredImage(imagesForServicePath(path)) ??
    serviceCategoryHeroImage(category)
  );
}
