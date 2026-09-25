import {
  createGuide,
  normalize,
  type Action,
  type GuideConfig,
  type Reply,
} from "./core";
export type { GuideConfig, Topic, Action, Reply } from "./core";
export type GuideEvent = {
  siteId: string;
  type: "open" | "close" | "answer" | "fallback" | "reset" | "action";
  intentId?: string;
};
export type MountOptions = {
  nonce?: string;
  onEvent?: (event: GuideEvent) => void;
  onNavigate?: (action: Action) => boolean;
};
export type GuideHandle = { open(): void; close(): void; destroy(): void };
/** Mount into any DOM container. Shadow DOM prevents host CSS from styling the guide. */
export function mountGuide(
  container: HTMLElement,
  config: GuideConfig,
  options: MountOptions = {},
): GuideHandle {
  config = JSON.parse(JSON.stringify(config));
  const engine = createGuide(config);
  if (!customElements.get("website-guide"))
    customElements.define("website-guide", class extends HTMLElement {});
  const host = document.createElement("website-guide");
  const root = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  if (options.nonce) style.nonce = options.nonce;
  style.textContent = `:host{all:initial;font:15px/1.5 system-ui,sans-serif;color:#142536}*{box-sizing:border-box}button,input,a{font:inherit}button,a{touch-action:manipulation}button{cursor:pointer}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #e5a100;outline-offset:3px}.launcher{position:fixed;${config.position ?? "right"}:20px;bottom:${config.bottom ?? 24}px;z-index:1140;border:1px solid white;border-radius:999px;padding:13px 20px;background:${config.accent ?? "#164e63"};color:white;box-shadow:0 5px 24px #0003;font-weight:700}dialog{position:fixed;inset:auto 16px 20px auto;margin:0;width:min(390px,calc(100vw - 32px));height:min(600px,calc(100dvh - 40px));padding:0;border:1px solid #d4dde3;border-radius:20px;box-shadow:0 20px 80px #0004;background:#fff;color:#142536}dialog[open]{display:flex;flex-direction:column}dialog::backdrop{background:#07172755}header{padding:18px;background:#f0f6f8;border-bottom:1px solid #dde5ea}h2{font-size:18px;margin:0 0 4px}.sub{font-size:12px;margin:0;color:#435464}.controls{display:flex;gap:8px;margin-top:10px}button{min-height:44px;border:1px solid #b6c7d0;border-radius:10px;background:#fff;padding:8px 12px;color:#142536}.log{padding:16px;overflow:auto;flex:1;min-height:0;overscroll-behavior:contain}.message{padding:12px;border-radius:12px;background:#edf3f6;margin:0 0 12px;white-space:pre-wrap;overflow-wrap:anywhere}.user{background:#164e63;color:#fff;margin-left:30px}.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}a{display:inline-block;min-height:44px;padding:9px 4px;color:#075378;text-decoration:underline;font-weight:600}.suggestions{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px}form{border-top:1px solid #dde5ea;padding:12px;display:flex;gap:8px}label{position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden}input{min-width:0;flex:1;border:1px solid #879ba8;border-radius:10px;padding:10px;color:#142536;background:#fff}.send{background:#164e63;color:white} @media(max-width:480px){dialog{inset:auto 8px 8px;width:calc(100vw - 16px);height:min(620px,calc(100dvh - 16px))}.launcher{${config.position ?? "right"}:12px;bottom:max(${config.bottom ?? 24}px,env(safe-area-inset-bottom))}}`;
  // Constructed sheets work with strict style-src without weakening the host CSP.
  // Older browsers fall back to a nonce-authorized style element.
  if (
    "adoptedStyleSheets" in root &&
    "replaceSync" in CSSStyleSheet.prototype
  ) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(style.textContent);
    root.adoptedStyleSheets = [sheet];
  } else root.append(style);
  function element<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    text?: string,
  ) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    return node;
  }
  const launcher = element("button", config.title);
  launcher.className = "launcher";
  launcher.setAttribute("aria-haspopup", "dialog");
  const dialog = element("dialog");
  dialog.setAttribute("aria-labelledby", "guide-title");
  const header = element("header"),
    title = element("h2", config.title);
  title.id = "guide-title";
  const subtitle = element("p", "Website guide · prepared answers, not AI");
  subtitle.className = "sub";
  const controls = element("div");
  controls.className = "controls";
  const restart = element("button", "Start over"),
    closeButton = element("button", "Close");
  controls.append(restart, closeButton);
  header.append(title, subtitle, controls);
  const log = element("div");
  log.className = "log";
  log.setAttribute("role", "log");
  log.setAttribute("aria-label", "Conversation");
  log.setAttribute("aria-live", "polite");
  const form = element("form"),
    label = element("label", "Ask about this website");
  label.htmlFor = "guide-input";
  const input = element("input");
  input.id = "guide-input";
  input.placeholder = "Ask a question…";
  input.maxLength = 400;
  input.autocomplete = "off";
  const send = element("button", "Send");
  send.type = "submit";
  send.className = "send";
  form.append(label, input, send);
  dialog.append(header, log, form);
  root.append(launcher, dialog);
  container.append(host);
  let destroyed = false;
  const emit = (type: GuideEvent["type"], intentId?: string) => {
    try {
      options.onEvent?.({
        siteId: config.siteId,
        type,
        ...(intentId ? { intentId } : {}),
      });
    } catch {
      /* Host telemetry must not break the guide. */
    }
  };
  function addUser(text: string) {
    const node = element("p", text);
    node.className = "message user";
    log.append(node);
  }
  function show(reply: Reply) {
    log.querySelectorAll(".suggestions").forEach((n) => n.remove());
    const message = element("div", reply.text);
    message.className = "message";
    const actions = element("div");
    actions.className = "actions";
    for (const action of reply.actions) {
      const a = element("a", action.label);
      a.href = action.href;
      a.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
          return;
        emit("action", reply.intentId);
        dialog.close();
        try {
          if (options.onNavigate?.(action)) event.preventDefault();
        } catch {
          /* Preserve the ordinary link if a host adapter fails. */
        }
      });
      actions.append(a);
    }
    message.append(actions);
    log.append(message);
    const suggestions = element("div");
    suggestions.className = "suggestions";
    for (const id of reply.suggestions) {
      const topic = config.topics.find((t) => t.id === id);
      if (!topic) continue;
      const b = element("button", topic.title);
      b.addEventListener("click", () => {
        addUser(topic.title);
        const answer = engine.select(id);
        show(answer);
        emit("answer", id);
        input.focus();
      });
      suggestions.append(b);
    }
    log.append(suggestions);
    while (log.children.length > 41) log.firstElementChild?.remove();
    log.scrollTop = log.scrollHeight;
  }
  show(engine.initial());
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    if (["reset", "restart", "start over"].includes(normalize(text))) {
      log.replaceChildren();
      show(engine.reset());
      emit("reset");
      input.focus();
      return;
    }
    addUser(text);
    const reply = engine.respond(text);
    show(reply);
    emit(reply.intentId ? "answer" : "fallback", reply.intentId);
    input.focus();
  });
  restart.addEventListener("click", () => {
    log.replaceChildren();
    show(engine.reset());
    emit("reset");
    input.focus();
  });
  const open = () => {
    if (destroyed || dialog.open) return;
    dialog.showModal();
    launcher.setAttribute("aria-expanded", "true");
    input.focus();
    emit("open");
  };
  const close = () => {
    if (dialog.open) dialog.close();
  };
  launcher.setAttribute("aria-expanded", "false");
  launcher.addEventListener("click", open);
  closeButton.addEventListener("click", close);
  dialog.addEventListener("close", () => {
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
    emit("close");
  });
  return {
    open,
    close,
    destroy() {
      destroyed = true;
      host.remove();
    },
  };
}
