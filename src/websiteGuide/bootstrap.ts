// Keep guide code and the content pack off the initial critical rendering path.
if (!location.pathname.startsWith("/seo-dashboard")) {
  const start = () => {
    void Promise.all([
      import("../../packages/website-guide/src/index"),
      import("./config"),
    ])
      .then(([{ mountGuide }, { temporaryGuide }]) =>
        mountGuide(document.body, temporaryGuide, {
          onNavigate(action) {
            if (action.href !== "/contact-us/") return false;
            const trigger = document.querySelector<HTMLAnchorElement>(
              'a.contact-rail[href="/contact-us/"]',
            );
            const drawer =
              document.querySelector<HTMLDialogElement>("#contact-drawer");
            if (!trigger || !drawer) return false;
            trigger.click();
            return drawer.open;
          },
        }),
      )
      .catch((error) =>
        console.warn(
          "Website guide could not load",
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}
