import { brand, services, stateGuides, type Service } from "./targetData";

const serviceGallery: Record<string, { src: string; alt: string }[]> = {
  "mobile-kitchen-rentals": [
    {
      src: "/images/service-heroes/24ft-mobile-kitchen/01-960.webp",
      alt: "Commercial preparation line inside a mobile kitchen trailer",
    },
    {
      src: "/images/service-heroes/28ft-mobile-kitchen/05-960.webp",
      alt: "Stainless steel cooking workspace in a temporary kitchen trailer",
    },
    {
      src: "/images/service-heroes/40ft-mobile-kitchen/06-960.webp",
      alt: "Large mobile kitchen interior with commercial cooking equipment",
    },
  ],
  "dishwashing-trailer-rentals": [
    {
      src: "/images/service-heroes/22-26ft-low-temp-dish/01-960.webp",
      alt: "Commercial dishwashing trailer work area",
    },
    {
      src: "/images/service-heroes/38ft-low-temp-dish/02-960.webp",
      alt: "Temporary warewashing line with stainless steel equipment",
    },
    {
      src: "/images/service-heroes/38ft-high-temp-dish/03-960.webp",
      alt: "High-volume commercial dishwashing trailer interior",
    },
  ],
  "commercial-refrigeration-trailer-rentals": [
    {
      src: "/images/service-heroes/20ft-refrigerated-trailer/01-960.webp",
      alt: "Commercial refrigeration trailer for temporary cold storage",
    },
    {
      src: "/images/service-heroes/20ft-refrigerated-trailer/02-960.webp",
      alt: "Interior of temporary refrigerated storage equipment",
    },
    {
      src: "/images/service-heroes/20ft-refrigerated-trailer/04-960.webp",
      alt: "Refrigerated trailer equipment and access area",
    },
  ],
};

const refrigerationFallback =
  serviceGallery["commercial-refrigeration-trailer-rentals"];

export function ServiceImageGallery({ service }: { service: Service }) {
  const images = serviceGallery[service.slug] ?? refrigerationFallback;
  return (
    <section className="section shell equipment-gallery">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Reviewed equipment views</span>
          <h2>See the workspace before planning the placement.</h2>
        </div>
        <p>
          These views establish the equipment family, not the exact available
          rental unit. Confirm dimensions, layout, utilities, access, and
          configuration for your project.
        </p>
      </div>
      <div className="equipment-gallery-grid">
        {images.map((image, index) => (
          <figure
            key={image.src}
            className={index === 0 ? "gallery-primary" : ""}
          >
            <img
              src={image.src}
              width="960"
              height="720"
              loading="lazy"
              alt={image.alt}
            />
            <figcaption>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {image.alt} · confirm the actual rental configuration
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function KitchenPlanner({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`planner-section ${compact ? "planner-compact" : ""}`}>
      <div className="shell planner-grid">
        <div>
          <span className="eyebrow">Kitchen capacity planner</span>
          <h2>
            {compact
              ? "Build a useful first equipment brief."
              : "Plan the operating footprint before requesting a quote."}
          </h2>
          <p>
            This tool provides a planning direction, not a price or inventory
            promise. Final equipment, delivery, setup, and pricing require team
            confirmation.
          </p>
        </div>
        <form className="planner-form" data-kitchen-planner>
          <label>
            Meals per service
            <input
              name="meals"
              type="number"
              min="1"
              max="10000"
              defaultValue="250"
              required
            />
          </label>
          <label>
            Daily service periods
            <select name="services" defaultValue="2">
              <option value="1">1 service</option>
              <option value="2">2 services</option>
              <option value="3">3 services</option>
              <option value="4">4+ services</option>
            </select>
          </label>
          <label>
            Project length
            <select name="duration" defaultValue="month">
              <option value="week">Up to 2 weeks</option>
              <option value="month">2 weeks to 3 months</option>
              <option value="long">More than 3 months</option>
            </select>
          </label>
          <fieldset>
            <legend>Supporting workflow</legend>
            <label>
              <input type="checkbox" name="dishwashing" /> Dedicated dishwashing
            </label>
            <label>
              <input type="checkbox" name="cold" /> Refrigerated or frozen
              storage
            </label>
          </fieldset>
          <button className="button" type="submit">
            Create planning direction ↗
          </button>
          <output
            className="planner-result"
            data-planner-result
            aria-live="polite"
          >
            Enter the operating details to create a planning direction.
          </output>
        </form>
      </div>
    </section>
  );
}

export function CalculatorPage() {
  return (
    <>
      <section className="page-intro shell section calculator-intro">
        <span className="eyebrow">Non-price planning calculator</span>
        <h1>Mobile Commercial Kitchen Trailer Rental Capacity Calculator</h1>
        <p data-h1-intro>
          Build a preliminary operating brief for mobile kitchen rentals,
          dishwashing trailers, commercial refrigeration trailers, walk-in
          coolers, freezers, and refrigerated containers. Enter meal volume,
          daily service frequency, rental duration, and supporting workflow
          needs to identify a sensible starting conversation. The result does
          not calculate price, reserve equipment, or guarantee delivery. Use it
          to organize your requirements, then request confirmed availability,
          configuration, delivery coordination, and a project quote.
        </p>
      </section>
      <KitchenPlanner />
    </>
  );
}

export function StateMap({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`map-section ${compact ? "map-compact" : ""}`}>
      <div className="shell map-layout">
        <div className="map-copy">
          <span className="eyebrow">Nationwide project routing</span>
          <h2>Select a state to open its kitchen-rental guide.</h2>
          <p>
            Map selection opens a dedicated state page. Equipment availability,
            delivery routing, placement, and timing remain project-specific.
          </p>
          <label>
            Choose a state
            <select data-state-select defaultValue="">
              <option value="" disabled>
                Select a state
              </option>
              {stateGuides.map((state) => (
                <option key={state.path} value={state.path}>
                  {state.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="map-frame">
          <svg
            viewBox="0 0 960 620"
            role="img"
            aria-labelledby="us-map-title us-map-desc"
          >
            <title id="us-map-title">
              United States mobile kitchen rental guides
            </title>
            <desc id="us-map-desc">
              Select a state shape to open its dedicated rental planning guide.
            </desc>
            {stateGuides.map((state) => (
              <a
                href={state.path}
                key={state.path}
                aria-label={`${state.name} mobile kitchen rental guide`}
              >
                <path d={state.d}>
                  <title>{state.name}</title>
                </path>
              </a>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

export function StickyProjectDesk() {
  return (
    <>
      <div className="sticky-actions" aria-label="Rental contact actions">
        <button type="button" data-project-desk-open>
          Project desk
        </button>
        <a href={`tel:${brand.phoneE164}`}>Call rental team</a>
      </div>
      <aside
        className="project-desk"
        data-project-desk
        hidden
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-desk-title"
      >
        <div className="project-desk-header">
          <div>
            <span>Planning brief</span>
            <h2 id="project-desk-title">Request-ready project details</h2>
          </div>
          <button
            type="button"
            data-project-desk-close
            aria-label="Close project desk"
          >
            ×
          </button>
        </div>
        <p>
          Organize the essentials here, then call the rental team. This form
          does not transmit or store your details.
        </p>
        <form data-project-brief>
          <label>
            Project city and state
            <input name="location" required />
          </label>
          <label>
            Rental start date
            <input name="date" type="date" required />
          </label>
          <label>
            Primary equipment
            <select name="equipment">
              {services.map((service) => (
                <option key={service.slug}>{service.shortLabel}</option>
              ))}
            </select>
          </label>
          <label>
            Project notes
            <textarea
              name="notes"
              rows={4}
              placeholder="Meal volume, utilities, access, and schedule"
            ></textarea>
          </label>
          <button className="button" type="submit">
            Review project brief
          </button>
          <output data-project-brief-result aria-live="polite"></output>
        </form>
        <a className="button button-light" href={`tel:${brand.phoneE164}`}>
          Call {brand.phoneDisplay}
        </a>
      </aside>
    </>
  );
}
