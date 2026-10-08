import { kitchenLocationHeadline, kitchenLocationIntro } from "./kitchenRentalStandards";
import { KitchenRentalPlanning } from "./KitchenRentalPlanning";
import site from "../site.json" with { type: "json" };
import { stateGuides } from "./stateGuides";
import { statePath } from "./statePaths";
import { regionPages } from "./regionGuides";
import { serviceCategories } from "./serviceMenu";
import { capitalizeLinkLabel } from "./linkLabels";
import { citiesForRegion } from "./cityDirectory";
import { LocationImageCarousel } from "./LocationImageCarousel";

export const statePageByPath = Object.fromEntries(
  Object.keys(stateGuides).map((name) => [statePath(name), name]),
);

export const stateKitchenHeadline = kitchenLocationHeadline;
export const stateKitchenIntro = kitchenLocationIntro;

export function StateDetail({ name }: { name: string }) {
  const guide = stateGuides[name];
  const headline = stateKitchenHeadline(name);
  const regions = regionPages.filter((region) => region.state === name);
  const priority = [
    "Mobile Kitchens",
    "Shower and Restroom Combination Trailers",
    "Shower",
    "Sleeper",
  ];
  const services = serviceCategories.filter((item) => item.name === "Mobile Kitchens").sort(
    (a, b) =>
      (priority.includes(a.name) ? priority.indexOf(a.name) : 9) -
      (priority.includes(b.name) ? priority.indexOf(b.name) : 9),
  );
  const labels: Record<string, string> = {
    "Mobile Kitchens": "Mobile commercial kitchen rentals",
    Shower: "Shower trailer rentals, 22 ft with 10 stalls",
    Sleeper: "Sleeper and bunkbed trailer rentals",
  };
  return (
    <article className={`state-page region-page region-layout-${guide.layout}`}>
      <section className="region-hero">
        <div className="wrap section region-hero-grid">
          <div className="region-hero-copy">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/service-areas/">Service Areas</a>
              <span>/</span>
              <span aria-current="page">{name}</span>
            </nav>
            <p className="eyebrow">STATE RENTAL GUIDE</p>
            <h1>{headline}</h1>
            <p className="region-intro" data-h1-intro>
              {stateKitchenIntro(name)}
            </p>
            <p className="region-emergency">Emergency 24/7</p>
            <a className="button" href={`tel:${site.phoneE164}`}>
              Call the rental team {site.phoneDisplay}
            </a>
          </div>
          <div className="region-hero-visual region-hero-carousel">
            <LocationImageCarousel headline={headline} locationKey={name} />
          </div>
        </div>
      </section>
      <section className="wrap section state-guide-regions">
        <div>
          <span className="eyebrow">DISTINCT TRAVEL REGIONS</span>
          <h2>Find your rental location</h2>
          <p>
            {guide.fact} Explore each regional guide for local cities, equipment
            and rental planning conditions.
          </p>
        </div>
        <nav
          aria-label={`${name} distinct travel regions`}
          className="state-guide-region-grid"
        >
          {regions.map((region) => (
            <a href={region.path} key={region.path}>
              <strong>{region.region}</strong>
              <span>{region.cities.slice(0, 3).join(", ")}</span>
              <span>
                {citiesForRegion(region.path).length} listed locations
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </section>
      <section className="wrap section state-guide-planning">
        <div>
          <span className="eyebrow">LOCAL AND SEASONAL INFORMATION</span>
          <h2>Rental Planning Conditions</h2>
          {guide.seasonal.summary.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <p>{guide.question}</p>
          <KitchenRentalPlanning localContext={`Review statewide routes such as ${guide.seasonal.corridors[0]}; confirm the actual final delivery approach and site restrictions.`} cities={regions.flatMap((region) => region.cities).slice(0, 10)} />
        </div>
        <aside className="region-demand-card">
          <span>Estimated seasonal facility demand</span>
          <strong>
            Code {guide.seasonal.code} · {guide.seasonal.label}
          </strong>
          <p>{guide.seasonal.basis}</p>
          <nav
            className="region-seasonal-sources"
            aria-label="Planning information sources"
          >
            {guide.seasonal.sources.map((source) => (
              <a
                href={source.href}
                key={source.href}
                rel="external noreferrer"
                target="_blank"
              >
                {source.label}
              </a>
            ))}
          </nav>
        </aside>
      </section>
      <section className="wrap section state-guide-equipment">
        <div>
          <span className="eyebrow">RENTAL EQUIPMENT</span>
          <h2>Kitchen trailers for your project</h2>
          <p>
            Confirm kitchen layout, utilities and delivery access before booking.
          </p>
          <ul className="state-guide-services">
            {services.map((service) => (
              <li key={service.href}>
                <a href={service.href}>
                  {capitalizeLinkLabel(labels[service.name] || service.name)}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <aside className="location-equipment-note">
          <span className="eyebrow">VERIFIED IMAGE POLICY</span>
          <h3>Kitchen layout references</h3>
          <p>
            Photos illustrate kitchen configurations. Confirm the actual
            available unit for your {name} site.
          </p>
        </aside>
      </section>
      <div className="wrap state-guide-call">
        <p>
          Emergency 24/7. Call to confirm available equipment and a rental or
          lease quote for your {name} project.
        </p>
        <a className="button" href={`tel:${site.phoneE164}`}>
          Call {site.phoneDisplay}
        </a>
      </div>
    </article>
  );
}
