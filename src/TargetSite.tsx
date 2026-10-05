import {
  brand,
  kitchenFamilySentence,
  primaryPhrase,
  services,
  stateGuides,
  super9Sentence,
  type StateGuide,
} from "./targetData";
import {
  CalculatorPage,
  KitchenPlanner,
  ServiceImageGallery,
  StateMap,
  StickyProjectDesk,
} from "./TargetEnhancements";

const Arrow = () => <span aria-hidden="true">↗</span>;

function Header({ path }: { path: string }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>Commercial & institutional rental planning</span>
          <a href={`tel:${brand.phoneE164}`}>Call {brand.phoneDisplay}</a>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="wordmark" href="/" aria-label={`${brand.name} home`}>
            <img
              src="/brand/mobile-kitchen-rental-logo.png"
              width="1774"
              height="887"
              alt="Mobile Kitchen Rental"
            />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <details className="nav-dropdown nav-services">
              <summary>
                Services <span aria-hidden="true">⌄</span>
              </summary>
              <div className="nav-panel nav-service-panel">
                <div className="nav-panel-intro">
                  <span>Super 9 rental inventory</span>
                  <strong>
                    Coordinate kitchens, hygiene, housing, and site support.
                  </strong>
                  <a href="/equipment-rental/">View all equipment ↗</a>
                </div>
                <div className="nav-service-links">
                  {services.map((service) => (
                    <a
                      href={`/equipment-rental/${service.slug}/`}
                      key={service.slug}
                    >
                      <span>{service.shortLabel}</span>
                      <small>{service.planning[0]}</small>
                    </a>
                  ))}
                </div>
              </div>
            </details>
            <details className="nav-dropdown">
              <summary>
                Pages <span aria-hidden="true">⌄</span>
              </summary>
              <div className="nav-panel nav-pages-panel">
                <a href="/service-areas/">
                  State service map <span>50 state guides</span>
                </a>
                <a href="/rental-calculator/">
                  Capacity calculator <span>Build a project brief</span>
                </a>
                <a href="/planning/">
                  Planning guide <span>Utilities, access, workflow</span>
                </a>
                <a href="/about-us/">
                  About <span>Focused rental coordination</span>
                </a>
              </div>
            </details>
            <a
              href="/service-areas/"
              aria-current={path === "/service-areas/" ? "page" : undefined}
            >
              Service areas
            </a>
          </nav>
          <a className="button button-small" href="/contact-us/">
            Request availability <Arrow />
          </a>
          <details className="mobile-nav">
            <summary aria-label="Open navigation">
              Menu <span aria-hidden="true">☰</span>
            </summary>
            <nav aria-label="Mobile navigation">
              <details>
                <summary>Services</summary>
                {services.map((service) => (
                  <a
                    key={service.slug}
                    href={`/equipment-rental/${service.slug}/`}
                  >
                    {service.shortLabel}
                  </a>
                ))}
              </details>
              <details>
                <summary>Pages</summary>
                <a href="/service-areas/">State service map</a>
                <a href="/rental-calculator/">Capacity calculator</a>
                <a href="/planning/">Planning guide</a>
                <a href="/about-us/">About</a>
              </details>
              <a href="/contact-us/">Request availability</a>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <img
            className="footer-brand-icon"
            src="/brand/mobile-kitchen-rental-icon.png"
            width="1254"
            height="1254"
            alt=""
          />
          <h2>Keep the operation moving.</h2>
          <p>
            Share your location, dates, menu, meal volume, utilities, and access
            constraints so the rental plan starts with useful information.
          </p>
          <a className="button button-light" href="/contact-us/">
            Request availability <Arrow />
          </a>
        </div>
        <div>
          <strong>Super 9 inventory</strong>
          {services.map((service) => (
            <a key={service.slug} href={`/equipment-rental/${service.slug}/`}>
              {service.shortLabel}
            </a>
          ))}
        </div>
        <div>
          <strong>Plan</strong>
          <a href="/service-areas/">State service guides</a>
          <a href="/rental-calculator/">Capacity calculator</a>
          <a href="/planning/">Project planning</a>
          <a href="/about-us/">About</a>
          <a href="/privacy/">Privacy</a>
        </div>
      </div>
      <div className="shell footer-base">
        <small>
          © {new Date().getFullYear()} {brand.legalName}. Rental availability,
          delivery, and configuration require confirmation.
        </small>
      </div>
    </footer>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">
            Temporary food-service continuity · Nationwide coordination
          </span>
          <h1>
            {primaryPhrase} for Planned and Emergency Food-Service Continuity
          </h1>
          <p className="hero-intro" data-h1-intro>
            Mobile commercial kitchen trailer rentals support hospitals,
            schools, restaurants, hotels, correctional facilities, and
            government operations during planned work or emergencies. The full
            inventory also covers dishwashing, refrigeration, hygiene, laundry,
            sleeper units, and remote workforce housing for coordinated site
            support. Share your location, dates, occupancy, utilities, and
            access requirements to request availability, delivery coordination,
            and a project quote.
          </p>
          <div className="hero-actions">
            <a className="button" href="/contact-us/">
              Request availability <Arrow />
            </a>
            <a className="text-link" href="#inventory">
              Explore all nine service families{" "}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <dl className="hero-facts">
            <div>
              <dt>Rental terms</dt>
              <dd>Short-term and long-term</dd>
            </div>
            <div>
              <dt>Project modes</dt>
              <dd>Planned and emergency use</dd>
            </div>
          </dl>
        </div>
        <figure className="hero-plate">
          <img
            src="/images/service-heroes/40ft-mobile-kitchen/03-960.webp"
            srcSet="/images/service-heroes/40ft-mobile-kitchen/03-480.webp 480w, /images/service-heroes/40ft-mobile-kitchen/03-960.webp 960w"
            sizes="(max-width: 820px) 100vw, 48vw"
            width="960"
            height="720"
            fetchPriority="high"
            alt="Stainless steel cooking line inside a commercial mobile kitchen trailer"
          />
          <figcaption>
            <span>Equipment plate 01</span>
            <strong>Commercial mobile kitchen interior</strong>
          </figcaption>
          <div className="plate-note">
            <span>Confirm</span>
            <strong>Menu · volume · utilities · access</strong>
          </div>
        </figure>
      </div>
      <div
        className="shell operations-line"
        aria-label="Kitchen operation planning sequence"
      >
        {[
          "Cooking",
          "Warewashing",
          "Cold storage",
          "Delivery coordination",
        ].map((label, index) => (
          <div key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServiceCards() {
  return (
    <section
      className="section shell"
      id="inventory"
      aria-labelledby="inventory-title"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">Complete rental inventory</span>
          <h2 id="inventory-title">
            The complete Super 9, organized into detailed rental guides.
          </h2>
        </div>
        <p>
          {kitchenFamilySentence} Across the full inventory: {super9Sentence}
          Every family has its own focused planning page.
        </p>
      </div>
      <div className="service-ledger">
        {services.map((service, index) => (
          <a
            className="service-row"
            href={`/equipment-rental/${service.slug}/`}
            key={service.slug}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{service.label}</strong>
            <p>{service.description.split(". ")[0]}.</p>
            <Arrow />
          </a>
        ))}
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <ServiceCards />
      <section className="section section-dark">
        <div className="shell split">
          <div>
            <span className="eyebrow">Built around the operating brief</span>
            <h2>Start with the work—not a guessed trailer size.</h2>
          </div>
          <div className="planning-list">
            {[
              "Define menu, meal volume, and service window",
              "Map cooking, warewashing, and cold-storage needs",
              "Confirm power, fuel, water, wastewater, and ventilation",
              "Review delivery access, placement, rental dates, and setup scope",
            ].map((item, index) => (
              <div key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <StateMap compact />
      <StateDirectory compact />
      <KitchenPlanner compact />
      <Faq />
    </>
  );
}

function Faq() {
  const items = [
    [
      "What should I prepare for a mobile kitchen quote?",
      "Provide the project address, dates, menu, meals per service, staff workflow, equipment priorities, available utilities, and delivery constraints. The team uses those details to review a suitable configuration and current availability.",
    ],
    [
      "Can dishwashing and refrigeration be coordinated with the kitchen?",
      "Yes. The focused kitchen cluster includes dedicated warewashing and temporary cold-storage options. Each capability still requires its own site, utility, operating, and availability review.",
    ],
    [
      "Are short-term and long-term rentals available?",
      "The site supports planning for both. The actual rental period, equipment configuration, delivery, setup, extensions, and removal are confirmed in the project proposal.",
    ],
    [
      "Does emergency use guarantee immediate delivery?",
      "No. Emergency describes the project need. Equipment availability, dispatch, delivery route, setup scope, and arrival timing must be confirmed for the location and dates.",
    ],
  ];
  return (
    <section className="section shell faq">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Planning answers</span>
          <h2>Questions that improve the first conversation.</h2>
        </div>
      </div>
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </section>
  );
}

function StateDirectory({ compact = false }: { compact?: boolean }) {
  const shown = compact ? stateGuides.slice(0, 12) : stateGuides;
  return (
    <section
      className={`section state-directory ${compact ? "state-directory-compact" : ""}`}
    >
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">State rental guides</span>
            {compact ? (
              <h2>Plan around the state, site, and schedule.</h2>
            ) : (
              <h1>Mobile Kitchen Rental Planning in All 50 States</h1>
            )}
          </div>
          <p>
            Every state guide uses a focused kitchen-cluster scope and unique
            planning copy. Availability and delivery are confirmed for the exact
            project address and dates.
          </p>
        </div>
        <div className="state-grid">
          {shown.map((state) => (
            <a href={state.path} key={state.path}>
              <span>{state.id}</span>
              <strong>{state.name}</strong>
              <Arrow />
            </a>
          ))}
        </div>
        {compact && (
          <a className="button button-outline" href="/service-areas/">
            Browse all 50 states <Arrow />
          </a>
        )}
      </div>
      {!compact && <StateMap />}
    </section>
  );
}

function ServicePage({ slug }: { slug: string }) {
  const service = services.find((item) => item.slug === slug)!;
  const isKitchenFamily = services.indexOf(service) < 6;
  return (
    <>
      <section className="page-hero">
        <div className="shell page-hero-grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/equipment-rental/">Inventory</a>
              <span>/</span>
              <span>{service.shortLabel}</span>
            </nav>
            <span className="eyebrow">
              {isKitchenFamily
                ? "Kitchen family rental service"
                : "Super 9 supporting rental service"}
            </span>
            <h1>{service.h1}</h1>
            <p data-h1-intro>{service.description}</p>
            <a className="button" href="/contact-us/">
              Request service availability <Arrow />
            </a>
          </div>
          <figure>
            <img
              src={service.image}
              srcSet={`${service.imageSmall} 480w, ${service.image} 960w`}
              sizes="(max-width: 820px) 100vw, 46vw"
              width="960"
              height="720"
              fetchPriority="high"
              alt={service.alt}
            />
            <figcaption>
              {service.label} · representative equipment view
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="section shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Configuration brief</span>
            <h2>Confirm the details that change the rental plan.</h2>
          </div>
          <p>
            {isKitchenFamily ? kitchenFamilySentence : super9Sentence} Related
            equipment is coordinated only when it supports the actual project
            scope, site, utilities, and operating plan.
          </p>
        </div>
        <div className="planning-cards">
          {service.planning.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item}</h3>
              <p>
                Share the project-specific requirement so the selected equipment
                and responsibilities can be reviewed before delivery.
              </p>
            </article>
          ))}
        </div>
      </section>
      <ServiceImageGallery service={service} />
      <Faq />
    </>
  );
}

function StateModal({ state }: { state: StateGuide }) {
  return (
    <dialog
      className="state-modal"
      id="state-gallery"
      role="dialog"
      aria-modal="true"
      aria-labelledby="state-gallery-title"
    >
      <div className="modal-header">
        <div>
          <span>Equipment planning gallery</span>
          <h2 id="state-gallery-title">
            {state.name} mobile kitchen rental views
          </h2>
        </div>
        <button type="button" data-dialog-close aria-label="Close gallery">
          ×
        </button>
      </div>
      <div className="modal-gallery">
        {state.images.map((image, index) => (
          <figure key={image.src}>
            <img
              src={image.src}
              width="960"
              height="720"
              loading="lazy"
              alt={image.alt}
            />
            <figcaption>
              <span>{index + 1} of 3</span>
              {image.alt}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="modal-actions">
        <button type="button" className="button button-outline" data-modal-prev>
          Previous
        </button>
        <div className="modal-dots" aria-label="Image position">
          <span />
          <span />
          <span />
        </div>
        <button type="button" className="button button-outline" data-modal-next>
          Next
        </button>
        <a className="button" href="/contact-us/">
          Request {state.name} availability
        </a>
      </div>
    </dialog>
  );
}

function StatePage({ state }: { state: StateGuide }) {
  return (
    <>
      <section className={`state-hero state-layout-${state.layout}`}>
        <div className="shell state-hero-grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/service-areas/">States</a>
              <span>/</span>
              <span>{state.name}</span>
            </nav>
            <span className="eyebrow">
              {state.name} temporary food-service planning
            </span>
            <h1>{state.h1}</h1>
            <p data-h1-intro>{state.description}</p>
            <div className="hero-actions">
              <a className="button" href="/contact-us/">
                Request availability or a quote <Arrow />
              </a>
              <button
                className="text-button"
                type="button"
                data-dialog-open="state-gallery"
              >
                View equipment gallery
              </button>
            </div>
          </div>
          <figure>
            <img
              src={state.images[0].src}
              width="960"
              height="720"
              fetchPriority="high"
              alt={state.images[0].alt}
            />
            <figcaption>
              {state.name} planning reference · confirm the actual rental unit
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="section shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Kitchen cluster</span>
            <h2>Coordinate cooking, warewashing, and cold storage.</h2>
          </div>
          <p>
            {kitchenFamilySentence} The exact combination depends on the
            operation, site, utilities, dates, and verified equipment
            availability.
          </p>
        </div>
        <div className="planning-cards">
          {[
            "Food-service workflow",
            "Utilities and placement",
            "Rental schedule",
            "Delivery coordination",
          ].map((title, index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>
                {
                  [
                    "Document menu, meal volume, staff movement, sanitation, and storage needs.",
                    "Confirm access, footprint, power, fuel, potable water, drainage, and ventilation.",
                    "Set short-term or long-term dates plus operating, service, and removal windows.",
                    "Review route, site restrictions, placement sequence, setup scope, and responsibilities.",
                  ][index]
                }
              </p>
            </article>
          ))}
        </div>
      </section>
      <StateModal state={state} />
    </>
  );
}

function InventoryPage() {
  return (
    <>
      <section className="page-intro shell section">
        <span className="eyebrow">Complete equipment directory</span>
        <h1>Mobile Kitchen and Super 9 Temporary Facility Rental Inventory</h1>
        <p data-h1-intro>
          Compare all nine temporary facility families, led by mobile kitchen,
          dishwashing, and refrigerated storage rentals. Supporting inventory
          includes shower and restroom combinations, shower trailers, restroom
          trailers, laundry facilities, sleeper and bunkbed units, and remote
          workforce housing. Each guide explains the operational questions that
          affect utilities, access, placement, servicing, and timing. Prepare a
          short-term or long-term project brief, then request confirmed
          availability and a coordinated quote for the actual site.
        </p>
      </section>
      <ServiceCards />
    </>
  );
}

function SimplePage({ path }: { path: string }) {
  if (path === "/planning/")
    return (
      <section className="page-intro shell section">
        <span className="eyebrow">Project planning guide</span>
        <h1>Mobile Commercial Kitchen Trailer Rental Planning Guide</h1>
        <p data-h1-intro>
          Prepare a useful rental brief before equipment is selected. Define the
          food-service operation, menu, meals per service, staff workflow,
          warewashing, cold storage, project address, access constraints,
          utilities, dates, and rental duration. Include emergency or
          planned-use context without assuming inventory or delivery timing. The
          rental team can then review the kitchen, dishwashing, refrigeration,
          delivery, placement, setup, and support questions that apply to the
          site.
        </p>
        <div className="planning-cards">
          {[
            "Operation",
            "Equipment flow",
            "Utilities",
            "Site access",
            "Schedule",
            "Responsibilities",
          ].map((x, i) => (
            <article key={x}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{x}</h3>
              <p>
                Record the project-specific facts and questions that must be
                confirmed before the rental proposal is finalized.
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  if (path === "/about-us/")
    return (
      <section className="page-intro shell section">
        <span className="eyebrow">Temporary 123 kitchen rentals</span>
        <h1>
          Mobile Commercial Kitchen Trailer Rental Planning & Coordination
        </h1>
        <p data-h1-intro>
          Mobile Kitchen Rental is a focused Temporary 123 resource for
          temporary commercial cooking, warewashing, and cold-storage planning.
          The website organizes mobile kitchen rentals, dishwashing trailers,
          commercial refrigeration trailers, walk-in coolers, freezers, and
          refrigerated containers around the questions facility teams need to
          resolve. Equipment specifications, availability, delivery, placement,
          setup, and operating responsibilities are confirmed for the actual
          project rather than promised from a generic page.
        </p>
      </section>
    );
  if (path === "/contact-us/")
    return (
      <section className="page-intro shell section">
        <span className="eyebrow">Request availability</span>
        <h1>Request Mobile Commercial Kitchen Trailer Rental Availability</h1>
        <p data-h1-intro>
          Start with the project location, required dates, expected rental
          duration, menu, meal volume, customer type, and facilities needed.
          Include known power, fuel, water, wastewater, ventilation, access,
          placement, and delivery constraints. A rental specialist can review
          mobile kitchen, dishwashing, and refrigeration options for planned or
          emergency use. Current equipment availability, configuration, delivery
          timing, setup scope, and final pricing require confirmation.
        </p>
        <div className="contact-panel">
          <div>
            <span>Call the rental team</span>
            <a href={`tel:${brand.phoneE164}`}>{brand.phoneDisplay}</a>
            <p>
              Share the project brief and ask the team to confirm the
              appropriate next step.
            </p>
          </div>
          <a className="button" href={`tel:${brand.phoneE164}`}>
            Call for availability <Arrow />
          </a>
        </div>
      </section>
    );
  return (
    <section className="page-intro shell section">
      <span className="eyebrow">Privacy notice</span>
      <h1>Privacy Notice for Mobile Kitchen Rental Inquiries</h1>
      <p data-h1-intro>
        This website provides public rental-planning information and telephone
        contact details. If you call, the information you choose to provide is
        used to respond to your equipment, availability, delivery, and quote
        request. Do not send passwords, payment-card details, private keys, or
        other sensitive credentials through an inquiry. Contact Temporary 123
        using the published telephone number with questions about your
        information.
      </p>
    </section>
  );
}

export function TargetSite({ path }: { path: string }) {
  const service = services.find(
    (item) => path === `/equipment-rental/${item.slug}/`,
  );
  const state = stateGuides.find((item) => item.path === path);
  return (
    <div id="top">
      <Header path={path} />
      <main id="main" tabIndex={-1}>
        {path === "/" ? (
          <Home />
        ) : path === "/equipment-rental/" ? (
          <InventoryPage />
        ) : path === "/service-areas/" ? (
          <StateDirectory />
        ) : path === "/rental-calculator/" ? (
          <CalculatorPage />
        ) : service ? (
          <ServicePage slug={service.slug} />
        ) : state ? (
          <StatePage state={state} />
        ) : ["/planning/", "/about-us/", "/contact-us/", "/privacy/"].includes(
            path,
          ) ? (
          <SimplePage path={path} />
        ) : (
          <section className="page-intro shell section">
            <span className="eyebrow">404</span>
            <h1>Page not found</h1>
            <p>
              The requested page is not part of the published mobile-kitchen
              rental guide.
            </p>
            <a className="button" href="/">
              Return home
            </a>
          </section>
        )}
      </main>
      <StickyProjectDesk />
      <Footer />
    </div>
  );
}
