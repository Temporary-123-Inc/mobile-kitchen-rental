import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { TargetSite } from "../src/TargetSite";
import {
  allRoutes,
  kitchenFamilySentence,
  services,
  stateGuides,
} from "../src/targetData";

const words = (value: string) =>
  value.trim().split(/\s+/).filter(Boolean).length;

describe("focused mobile-kitchen site", () => {
  it("publishes a controlled route set under the authority cap", () => {
    expect(allRoutes.length).toBe(64);
    expect(new Set(allRoutes).size).toBe(allRoutes.length);
    expect(allRoutes.length).toBeLessThanOrEqual(250);
  });

  it("keeps every state page state-first with a unique 70-120-word opening", () => {
    expect(stateGuides).toHaveLength(50);
    const descriptions = new Set<string>();
    for (const state of stateGuides) {
      expect(state.h1.startsWith(state.name)).toBe(true);
      expect(state.h1.length).toBeGreaterThanOrEqual(30);
      expect(state.h1).toContain("Mobile Kitchen Rentals");
      expect(words(state.description)).toBeGreaterThanOrEqual(70);
      expect(words(state.description)).toBeLessThanOrEqual(120);
      expect(state.description).toContain("mobile kitchen rentals");
      expect(state.description).toContain("dishwashing trailers");
      expect(state.description).toContain("commercial refrigeration trailers");
      expect(state.description).toContain("walk-in coolers");
      expect(state.description).toContain("freezers");
      expect(state.description).toContain("refrigerated containers");
      expect(state.description).toMatch(/Short-term rentals/);
      expect(state.description).toMatch(/long-term rentals/);
      expect(state.description.endsWith(`${state.name} location.`)).toBe(true);
      descriptions.add(state.description);
    }
    expect(descriptions.size).toBe(50);
  });

  it("renders one H1 and an immediate opening on every state page", () => {
    for (const state of stateGuides) {
      const html = renderToStaticMarkup(<TargetSite path={state.path} />);
      expect(html.match(/<h1/g)).toHaveLength(1);
      expect(html).toContain('</h1><p data-h1-intro="true">');
      expect(html).toContain(`${state.description}</p>`);
      expect(html).toContain("<dialog");
      expect(html).toContain(`Request ${state.name} availability`);
    }
  });

  it("keeps all kitchen-family services visible on the homepage", () => {
    const html = renderToStaticMarkup(<TargetSite path="/" />);
    expect(html.match(/<h1/g)).toHaveLength(1);
    for (const service of services) expect(html).toContain(service.label);
    expect(html).toContain(kitchenFamilySentence);
  });

  it("renders the navigation, calculator, map, galleries, and project desk", () => {
    const home = renderToStaticMarkup(<TargetSite path="/" />);
    expect(home).toContain("Services");
    expect(home).toContain("Pages");
    expect(home).toContain("data-kitchen-planner");
    expect(home).toContain("United States mobile kitchen rental guides");
    expect(home).toContain("data-project-desk");
    const calculator = renderToStaticMarkup(
      <TargetSite path="/rental-calculator/" />,
    );
    expect(calculator.match(/<h1/g)).toHaveLength(1);
    expect(calculator).toContain("Non-price planning calculator");
    for (const service of services) {
      const html = renderToStaticMarkup(
        <TargetSite path={`/equipment-rental/${service.slug}/`} />,
      );
      expect(html).toContain("Reviewed equipment views");
      expect(html.match(/<figure/g)?.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("does not publish prohibited selling language", () => {
    for (const route of allRoutes) {
      const html = renderToStaticMarkup(
        <TargetSite path={route} />,
      ).toLowerCase();
      expect(html).not.toMatch(
        /\b(for sale|buy now|purchase equipment|sold)\b/,
      );
    }
  });
});
