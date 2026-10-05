import "./target.css";
import "@fontsource-variable/manrope";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow-condensed/600.css";
import { inject } from "@vercel/analytics";

inject();

const mobileNav = document.querySelector<HTMLDetailsElement>(".mobile-nav");
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileNav?.open) {
    mobileNav.open = false;
    mobileNav.querySelector<HTMLElement>("summary")?.focus();
  }
});
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
