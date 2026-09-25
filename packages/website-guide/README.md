# Website Guide

A lightweight, deterministic website assistant. No AI provider, API key, backend or runtime dependency for the universal widget. Answers come exclusively from your site's curated content. This is keyword/phrase matching, not general language understanding: unknown questions fall back, equally ranked topics offer a choice, and explicit priorities resolve overlaps.

## Build and reuse

From this repository: `npm run build --prefix packages/website-guide`.
For an independent copy: copy this entire folder, run `npm install` then `npm run build` (Node 22.12+). Build tools are development-only dependencies.

Copy **all files in dist together** into a public folder on your website. JavaScript modules require HTTP(S), not double-clicking a file. Open `demo/index.html` through a local static server for a fictional second-site example.

```html
<script type="module">
  import { mountGuide } from '/website-guide/index.js';
  const guide = mountGuide(document.body, {
    siteId: 'your-site', title: 'Website guide', accent: '#164e63',
    greeting: 'What would you like to find?',
    fallback: 'I do not have that answer. Please choose a topic.',
    suggestions: ['services'],
    topics: [{ id: 'services', title: 'Our services',
      phrases: ['services', 'what do you do'],
      answer: 'Your approved description goes here.',
      actions: [{ label: 'Explore services', href: '/services/' }] }]
  });
  // guide.open(); guide.close(); guide.destroy();
</script>
```

WordPress: enqueue a module script from your child theme/custom plugin; do not edit WordPress core or paste JavaScript into an editor that strips scripts. HTML/CMS sites: use the same embed where custom scripts are permitted. Next.js/React: use the optional adapter in a client component:

```tsx
'use client';
import { WebsiteGuide } from '@charles/website-guide/react';
// Keep config outside the component, or memoize it.
export default function Guide() { return <WebsiteGuide config={config} />; }
```

The package is not published to npm. Install a local package/tarball or use the plain-HTML files. Do not assume a public package with this name is ours. To package: `npm pack` from this folder after building.

## Configuration

- Each topic has a unique `id`, `title`, matching `phrases`, prepared `answer`, optional `actions` and optional `followUp` topic ID. “Yes”/“tell me more” follows the previous topic's follow-up. Suggested buttons select exact topics.
- `priority` defaults to zero; a higher matching priority wins. Give pricing/availability clear precedence. Phrase matching uses word boundaries and English normalization. Add variants explicitly; synonyms, spelling mistakes and other languages are not automatically understood.
- `suggestions`: initial/fallback topic IDs. `contact`: optional fallback link.
- `accent`: six-digit hex color; choose a color with sufficient white-text contrast. `position`: left/right. `bottom`: 0–500px launcher offset, useful around existing sticky controls.
- `mountGuide(container, config, { nonce, onEvent })`: optional CSP style nonce and opt-in telemetry. Events contain only siteId, type and matched intentId, never the question or answer. Your callback is responsible for consent and retention. No telemetry is enabled on Temporary123.
- Optional `onNavigate(action)` returns true when your host handles an action, for example opening its existing contact drawer. Return false to use normal link navigation. Modified clicks retain normal browser behavior.
- External links use the same tab. Links support HTTP(S), relative paths, anchors, tel and mailto; unsafe schemes are rejected. Content renders as text, never HTML.

## Boundaries and accessibility

The universal entry imports no React. The optional React adapter does. Shadow DOM isolates internal styles; native modal dialog provides focus containment and Escape dismissal. Restart clears visible conversation; only the last 40 messages are retained. State is memory-only and disappears on reload. No messages are stored or sent, and no lead form is auto-submitted.

Requires modern browsers with ES modules, Custom Elements, Shadow DOM and native dialog. Modern browsers use a constructed stylesheet, compatible with Temporary123's `style-src 'self'`. The older-browser style-element fallback needs a valid style nonce under restrictive CSP. Allow the module origin and externalize or nonce the embed script as required. Platforms that prohibit custom JavaScript need a platform-specific integration. This is not a promise of compatibility with every CMS or legacy browser.

## Temporary123 integration

`src/websiteGuide/config.ts` is the site-specific content adapter. `src/websiteGuide/bootstrap.ts` loads it after the page load; the only shared runtime change is an import in `src/main.tsx`. Existing service descriptions/URLs and site phone configuration are reused. Contact actions open the existing inquiry drawer through its normal contact trigger, with ordinary page navigation as a fallback; the guide never claims live inventory, final prices, delivery guarantees or reservations. It does not collect project details in this first version.

Run `npm run test --prefix packages/website-guide` for engine tests. In the Temporary123 repository, run `npx vite build --outDir .temp/website-guide-build --emptyOutDir`, then `npx playwright test --config packages/website-guide/tests/playwright.config.ts`. The browser harness renders current Site components using compiled assets and the configured CSP without rewriting existing dist/audit files. It does not submit inquiries. Live deployment, real CMS installations and the full site's prerender pipeline require separate verification.
