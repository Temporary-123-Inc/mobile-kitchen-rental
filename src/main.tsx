import "./target.css";
import "@fontsource-variable/manrope";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow-condensed/600.css";
import { inject } from "@vercel/analytics";

inject();

const mobileNav = document.querySelector<HTMLDetailsElement>(".mobile-nav");
const navDropdowns = [
  ...document.querySelectorAll<HTMLDetailsElement>(".nav-dropdown"),
];
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileNav?.open) {
    mobileNav.open = false;
    mobileNav.querySelector<HTMLElement>("summary")?.focus();
  }
  if (event.key === "Escape") {
    navDropdowns.forEach((dropdown) => (dropdown.open = false));
  }
});
navDropdowns.forEach((dropdown) => {
  dropdown.addEventListener("toggle", () => {
    if (dropdown.open)
      navDropdowns
        .filter((item) => item !== dropdown)
        .forEach((item) => (item.open = false));
  });
});

document
  .querySelectorAll<HTMLSelectElement>("[data-state-select]")
  .forEach((select) =>
    select.addEventListener("change", () => {
      if (select.value) window.location.assign(select.value);
    }),
  );

document
  .querySelectorAll<HTMLFormElement>("[data-kitchen-planner]")
  .forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const meals = Math.max(1, Number(data.get("meals")) || 1);
      const servicePeriods = Math.max(1, Number(data.get("services")) || 1);
      const dailyMeals = meals * servicePeriods;
      const scale =
        dailyMeals <= 300
          ? "compact production"
          : dailyMeals <= 900
            ? "mid-capacity production"
            : "higher-volume production";
      const support = [
        data.get("dishwashing") ? "dedicated warewashing" : "",
        data.get("cold") ? "temporary refrigerated or frozen storage" : "",
      ].filter(Boolean);
      const duration =
        data.get("duration") === "long"
          ? "an extended operating plan"
          : data.get("duration") === "week"
            ? "a short mobilization window"
            : "a multi-week or multi-month plan";
      const result = form.querySelector<HTMLOutputElement>(
        "[data-planner-result]",
      );
      if (result)
        result.innerHTML = `<strong>Start with ${scale}.</strong>Plan for approximately ${dailyMeals.toLocaleString()} meals per day and ${duration}${support.length ? `, plus ${support.join(" and ")}` : ""}. Confirm menu, shift overlap, equipment line, utilities, access, placement, dates, and actual availability with the rental team.`;
    });
  });

const projectDesk = document.querySelector<HTMLElement>("[data-project-desk]");
const projectDeskTrigger = document.querySelector<HTMLElement>(
  "[data-project-desk-open]",
);
const closeProjectDesk = () => {
  if (!projectDesk) return;
  projectDesk.hidden = true;
  projectDeskTrigger?.focus();
};
projectDeskTrigger?.addEventListener("click", () => {
  if (!projectDesk) return;
  projectDesk.hidden = false;
  projectDesk.querySelector<HTMLElement>("input, select, textarea")?.focus();
});
projectDesk
  ?.querySelector<HTMLElement>("[data-project-desk-close]")
  ?.addEventListener("click", closeProjectDesk);
document.addEventListener("keydown", (event) => {
  if (!projectDesk || projectDesk.hidden) return;
  if (event.key === "Escape") closeProjectDesk();
  if (event.key === "Tab") {
    const focusable = [
      ...projectDesk.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((element) => !element.hasAttribute("disabled"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
});
projectDesk
  ?.querySelector<HTMLFormElement>("[data-project-brief]")
  ?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const result = form.querySelector<HTMLOutputElement>(
      "[data-project-brief-result]",
    );
    if (result)
      result.textContent = `Project brief ready: ${data.get("equipment")} for ${data.get("location")} beginning ${data.get("date")}. Add meal volume, utilities, site access, and timing notes when you call ${brandPhone}. Nothing was transmitted.`;
  });

const brandPhone = "+1 (888) 563-6507";
document.addEventListener("click", (event) => {
  if (mobileNav?.open && !mobileNav.contains(event.target as Node))
    mobileNav.open = false;
});

document
  .querySelectorAll<HTMLElement>("[data-dialog-open]")
  .forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const dialog = document.getElementById(
        trigger.dataset.dialogOpen || "",
      ) as HTMLDialogElement | null;
      dialog?.showModal();
    });
  });
document.querySelectorAll<HTMLDialogElement>("dialog").forEach((dialog) => {
  dialog
    .querySelector<HTMLElement>("[data-dialog-close]")
    ?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  const figures = [
    ...dialog.querySelectorAll<HTMLElement>(".modal-gallery figure"),
  ];
  const dots = [...dialog.querySelectorAll<HTMLElement>(".modal-dots span")];
  let active = 0;
  const show = (index: number) => {
    active = (index + figures.length) % figures.length;
    figures.forEach((figure, i) => {
      figure.hidden = i !== active;
    });
    dots.forEach((dot, i) => dot.classList.toggle("active", i === active));
  };
  dialog
    .querySelector<HTMLElement>("[data-modal-prev]")
    ?.addEventListener("click", () => show(active - 1));
  dialog
    .querySelector<HTMLElement>("[data-modal-next]")
    ?.addEventListener("click", () => show(active + 1));
  show(0);
});
