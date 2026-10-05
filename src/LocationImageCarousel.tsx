import { resolveLocationGallery } from "./locationCarouselImages";
import { useId } from "react";
import { ServiceHeroCarousel } from "./ServiceHeroCarousel";
import { serviceHeroImages, type ServiceHeroImage } from "./serviceHeroImages";
import { panhandleGalleryCopy } from "./panhandleGalleryCopy";
import { serviceAreaGalleryCaption } from "./serviceAreaGalleryCopy";
import { olympicPeninsulaGalleryCaption } from "./olympicPeninsulaGalleryCopy";
import {
  photoCoverage,
  referenceCaptionForModel,
} from "./equipmentPhotoPolicy";

export function LocationImageCarousel({
  headline,
  inert = false,
  locationKey,
}: {
  headline: string;
  inert?: boolean;
  locationKey?: string;
}) {
  const locationImages = locationKey
    ? locationKitchenFamilyImages(locationKey)
    : [];
  if (locationKey && locationImages.length) {
    return (
      <div
        className="location-image-gallery location-kitchen-family-gallery"
        data-location-gallery
        data-gallery-title={headline}
        data-gallery-location={locationKey}
        data-equipment-family="kitchen-family"
        data-photography-status="verified"
        data-gallery-presentation="location-kitchen-family-80-20"
        data-kitchen-image-count="4"
        data-kitchen-family-image-count="1"
      >
        <ServiceHeroCarousel
          images={locationImages}
          deferLoading={inert}
          label={`${locationKey} mobile kitchen and kitchen-family rental equipment`}
          lightboxLabel={`${locationKey} rental equipment gallery`}
          caption={`Reviewed equipment references for ${locationKey}: four mobile-kitchen images and one related kitchen-family image. These photos show representative rental configurations and do not claim that a pictured unit is currently located in ${locationKey}.`}
        />
      </div>
    );
  }
  const gallery = resolveLocationGallery(headline);
  const coverage = photoCoverage(gallery.images);
  const productId = "product-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <div
      className="location-image-gallery"
      data-location-gallery
      data-gallery-title={headline}
      data-equipment-family={gallery.family}
      data-equipment-model={gallery.modelId || ""}
      data-photography-status={gallery.images.length ? "verified" : "missing"}
      data-photo-coverage={coverage.kind}
      data-gallery-presentation={
        gallery.context ? "separate-options" : "single-model"
      }
    >
      {gallery.images.length ? (
        <>
          {gallery.groups.length > 1 && (
            <div
              className="location-product-tabs"
              data-product-tabs
              role="tablist"
              aria-label="Choose equipment type"
              hidden
            >
              {gallery.groups.map((group, index) => (
                <button
                  type="button"
                  key={group.modelId}
                  id={productId + "-tab-" + index}
                  role="tab"
                  data-product-tab={index}
                  aria-selected={index === 0}
                  aria-controls={productId + "-panel-" + index}
                  tabIndex={index === 0 ? 0 : -1}
                >
                  <span>{group.headline}</span>
                  <small>
                    {group.images.length}{" "}
                    {group.images.length === 1 ? "photo" : "photos"}
                  </small>
                </button>
              ))}
            </div>
          )}
          <div
            className={
              gallery.context
                ? "location-gallery-options"
                : "location-gallery-single"
            }
          >
            {gallery.groups.map((group, index) => (
              <section
                key={group.modelId}
                id={productId + "-panel-" + index}
                data-gallery-group
                data-group-title={group.headline}
                data-group-family={group.family}
                data-group-model={group.modelId}
                className="location-gallery-option"
              >
                {gallery.context && (
                  <h3 className="location-gallery-option-title">
                    {group.headline}
                  </h3>
                )}
                <ServiceHeroCarousel
                  images={group.images.map((image) => {
                    const copy = panhandleGalleryCopy(headline, group.modelId);
                    return copy
                      ? { ...image, alt: copy.altPrefix + image.alt }
                      : image;
                  })}
                  deferLoading={inert || index > 0}
                  label={group.headline + " photography"}
                  lightboxLabel={group.headline}
                  caption={
                    panhandleGalleryCopy(headline, group.modelId)?.caption ??
                    olympicPeninsulaGalleryCaption(headline, group.modelId) ??
                    serviceAreaGalleryCaption(
                      headline,
                      group.headline,
                      group.modelId,
                    ) ??
                    referenceCaptionForModel(group.modelId)
                  }
                />
              </section>
            ))}
          </div>
          {gallery.groups.length > 1 && (
            <script src="/location-product-tabs.js" defer />
          )}
        </>
      ) : (
        <div
          className="verified-photo-pending"
          data-verified-photo-pending
          role="note"
        >
          <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
            <rect
              x="5"
              y="9"
              width="38"
              height="30"
              rx="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="16"
              cy="19"
              r="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="m7 34 11-9 8 6 8-8 8 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <strong>Verified photography coming soon</strong>
          <p>
            Matching equipment images are being verified. We will not substitute
            a different unit or configuration.
          </p>
        </div>
      )}
    </div>
  );
}

const kitchenGalleryPaths = [
  "/services/mobile-kitchen-trailers/24ft/",
  "/services/mobile-kitchen-trailers/26ft-bulk/",
  "/services/mobile-kitchen-trailers/28ft/",
  "/services/mobile-kitchen-trailers/38ft/",
  "/services/mobile-kitchen-trailers/40ft/",
] as const;

const supportingKitchenFamilyPaths = [
  "/media-library/22-26ft-low-temp-dish/",
  "/equipment-rental-refrigeration-12ft-refrigerated-trailer/",
  "/media-library/20ft-refrigerated-container/",
] as const;

const imagePool = (paths: readonly string[]) =>
  paths.flatMap((path) => serviceHeroImages[path] ?? []);

const stableLocationIndex = (value: string) =>
  [...value].reduce(
    (total, character, index) =>
      (total + character.charCodeAt(0) * (index + 17)) % 2147483647,
    0,
  );

function selectRotatedUnique(
  pool: readonly ServiceHeroImage[],
  start: number,
  count: number,
) {
  const selected: ServiceHeroImage[] = [];
  const hashes = new Set<string>();
  for (
    let offset = 0;
    offset < pool.length && selected.length < count;
    offset += 1
  ) {
    const image = pool[(start + offset) % pool.length];
    const identity = image.sha256 || image.src;
    if (hashes.has(identity)) continue;
    hashes.add(identity);
    selected.push(image);
  }
  return selected;
}

export function locationKitchenFamilyImages(locationKey: string) {
  const seed = stableLocationIndex(locationKey);
  const kitchens = imagePool(kitchenGalleryPaths);
  const supporting = imagePool(supportingKitchenFamilyPaths);
  return [
    ...selectRotatedUnique(kitchens, seed % kitchens.length, 4),
    ...selectRotatedUnique(supporting, seed % supporting.length, 1),
  ];
}
