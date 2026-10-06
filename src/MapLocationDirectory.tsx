import { stateGuides } from "./stateGuides";
import { statePath } from "./statePaths";

export function MapLocationDirectory() {
  return (
    <section
      className="map-location-directory"
      aria-label="Browse rental locations"
    >
      <h3 aria-level={2}>Browse rental locations</h3>
      <p>
        Open a state guide directly. Confirm availability for your exact site
        and dates.
      </p>
      <div className="map-location-grid">
        {Object.entries(stateGuides)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([name]) => (
            <div key={name}>
              <a className="map-location-state" href={statePath(name)}>
                Commercial Mobile Kitchen Rentals in {name}
              </a>
            </div>
          ))}
      </div>
    </section>
  );
}
