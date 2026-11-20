import { content } from "./content.js";

const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---------- shared exhibit markup ----------
function itemBody(item) {
  let html = "";
  if (item.summary) html += `<p class="summary">${esc(item.summary)}</p>`;
  if (item.details?.length) html += `<ul class="details">${item.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>`;
  if (item.tags?.length) html += `<ul class="tags">${item.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  if (item.link) html += `<p><a class="btn btn-ghost" href="${esc(item.link)}" target="_blank" rel="noopener">View project</a></p>`;
  return html;
}
function contactLinks() {
  const c = content.contact;
  const links = [];
  if (c.email) links.push(`<a class="btn" href="mailto:${esc(c.email)}">Email</a>`);
  if (c.linkedin) links.push(`<a class="btn btn-ghost" href="${esc(c.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
  if (c.github) links.push(`<a class="btn btn-ghost" href="${esc(c.github)}" target="_blank" rel="noopener">GitHub</a>`);
  if (content.resumeUrl) links.push(`<a class="btn btn-ghost" href="${esc(content.resumeUrl)}" target="_blank" rel="noopener">Resume</a>`);
  return `<div class="contact-links">${links.join("")}</div>`;
}

// ---------- static text ----------
document.title = `${content.name} · Portfolio`;
$("hero-name").textContent = content.name;
$("hero-title").textContent = content.title;
$("hero-tagline").textContent = content.tagline;
$("hud-home").textContent = content.name;
$("plain-bar-name").textContent = content.name;
if (content.resumeUrl) $("hud-resume").href = content.resumeUrl;
else $("hud-resume").remove();

// ---------- plain view ----------
$("plain-content").innerHTML = `
  <header class="plain-hero">
    <p class="eyebrow">Portfolio · ${esc(content.location)}</p>
    <h1>${esc(content.name)}</h1>
    <p class="hero-title">${esc(content.title)}</p>
    <p class="hero-tagline">${esc(content.tagline)}</p>
    ${contactLinks()}
  </header>
  ${content.sections
    .map(
      (s) => `
    <section class="plain-section" id="plain-${esc(s.id)}" style="--section-accent:${esc(s.accent)}">
      <h2>${esc(s.label)}</h2>
      ${s.items
        .map(
          (it) => `
        <article class="plain-item">
          <h3>${esc(it.title)}</h3>
          ${it.subtitle ? `<p class="modal-subtitle">${esc(it.subtitle)}</p>` : ""}
          ${itemBody(it)}
        </article>`
        )
        .join("")}
    </section>`
    )
    .join("")}
  <section class="plain-section">
    <h2>Get in touch</h2>
    ${contactLinks()}
  </section>`;

// ---------- modal ----------
const modal = $("modal");
let lastFocus = null;
function openModal({ eyebrow, title, subtitle, body, accent }) {
  lastFocus = document.activeElement;
  $("modal-section").textContent = eyebrow || "";
  $("modal-title").textContent = title || "";
  $("modal-subtitle").textContent = subtitle || "";
  $("modal-body").innerHTML = body || "";
  modal.querySelector(".modal-card").style.setProperty("--accent", accent || "#1d1b18");
  modal.hidden = false;
  modal.querySelector(".modal-close").focus();
}
function closeModal() {
  modal.hidden = true;
  lastFocus?.focus?.();
}
modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
const openItem = (item, section) =>
  openModal({ eyebrow: section.label, title: item.title, subtitle: item.subtitle, body: itemBody(item), accent: section.accent });
const openContact = () =>
  openModal({ eyebrow: "Get in touch", title: content.name, subtitle: content.title, body: `<p class="summary">${esc(content.tagline)}</p>${contactLinks()}` });

// ---------- modes ----------
let gallery = null;

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch { return false; }
}
const preferPlain =
  !webglAvailable() ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  new URLSearchParams(location.search).get("view") === "plain";

function setMode(mode) {
  document.body.classList.remove("mode-loading", "mode-plain", "mode-gallery");
  document.body.classList.add(`mode-${mode}`);
  if (mode === "plain") { gallery?.stop(); window.scrollTo(0, 0); }
  else gallery?.start();
}

async function enterGallery() {
  if (!gallery) {
    try {
      await Promise.race([
        Promise.all([
          document.fonts.load('600 64px "Cormorant Garamond"'),
          document.fonts.load('italic 500 40px "Cormorant Garamond"'),
          document.fonts.load('400 26px Inter'),
          document.fonts.load('600 26px Inter'),
        ]),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
    } catch { /* fall back to system fonts */ }
    const { createGallery } = await import("./gallery.js");
    gallery = await createGallery($("gallery"), content, {
      onOpen: openItem,
      onFinale: openContact,
      onRoomChange: (room) => {
        document.querySelectorAll("#hud-rooms button").forEach((b, i) => b.classList.toggle("active", i === room));
        const accent = content.sections[room]?.accent || "#b85c38";
        $("progress").firstElementChild.style.background = accent;
      },
      onProgress: (p, wp) => {
        $("progress").firstElementChild.style.width = `${(p * 100).toFixed(2)}%`;
        $("hint").classList.toggle("show", !!(wp.exhibit || wp.finale));
        $("hint").textContent = wp.finale ? "Click the wall to get in touch" : "Click the frame to look closer";
      },
    });
  }
  setMode("gallery");
}

// room navigation
$("hud-rooms").innerHTML =
  content.sections.map((s) => `<li><button type="button">${esc(s.label)}</button></li>`).join("") +
  `<li><button type="button">Contact</button></li>`;
$("hud-rooms").querySelectorAll("button").forEach((btn, i) =>
  btn.addEventListener("click", () => gallery?.goTo(gallery.roomStart(i)))
);
$("hud-home").addEventListener("click", (e) => { e.preventDefault(); gallery?.goTo(0); });
$("toggle-plain").addEventListener("click", () => setMode("plain"));
$("toggle-gallery").addEventListener("click", () => enterGallery());

// keyboard
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) return closeModal();
  if (!gallery || !document.body.classList.contains("mode-gallery") || !modal.hidden) return;
  const i = gallery.currentIndex();
  if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); gallery.goTo(i + 1); }
  else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); gallery.goTo(i - 1); }
  else if (e.key === "Enter") {
    const wp = gallery.waypoints[i];
    if (wp.exhibit) openItem(wp.exhibit.item, wp.exhibit.section);
    else if (wp.finale) openContact();
  }
});

// hero fades as you step in
window.addEventListener("scroll", () => {
  const o = 1 - Math.min(1, window.scrollY / (window.innerHeight * 0.45));
  $("hero").style.opacity = o;
  $("hero").style.visibility = o <= 0 ? "hidden" : "visible";
}, { passive: true });

if (preferPlain) setMode("plain");
else enterGallery().catch((err) => { console.error(err); setMode("plain"); });
