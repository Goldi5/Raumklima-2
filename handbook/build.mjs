// Baut das Handbuch als PDF: handbook/de.md → dist/Raumklima-Handbuch.pdf, en.md → dist/Raumklima-Manual.pdf
//   npm ci && npx playwright install chromium && npm run build
// Eigener Chromium-Pfad: CHROMIUM_PATH=/pfad/zu/chrome npm run build
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { marked } from "marked";
import { chromium } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(resolve(here, "../custom_components/raumklima/manifest.json"), "utf8"));
const VERSION = manifest.version;
const BOOKS = [
  { src: "de.md", out: "Raumklima-Handbuch.pdf", date: "de-DE" },
  { src: "en.md", out: "Raumklima-Manual.pdf", date: "en-GB" },
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9äöüß]+/g, "-").replace(/^-|-$/g, "");

function frontMatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
  const meta = {};
  if (!m) return { meta, body: text };
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: text.slice(m[0].length) };
}

// <!-- include: pfad --> einsetzen (erste Überschrift der eingebundenen Datei entfällt)
const includes = (body) =>
  body.replace(/<!--\s*include:\s*(\S+)\s*-->/g, (_, p) => readFileSync(resolve(here, p), "utf8").replace(/^# .*\n/, ""));

// :::tip … ::: und :::check … ::: als Kästen
const boxes = (body) =>
  body.replace(/^:::(\w+)\n([\s\S]*?)\n:::$/gm, (_, kind, inner) => `<div class="box ${kind}">\n\n${inner}\n\n</div>`);

function render(md) {
  const { meta, body } = frontMatter(md);
  let html = marked.parse(boxes(includes(body)), { gfm: true });
  // Kapitel (h1) und Abschnitte (h2) mit Ankern fürs Inhaltsverzeichnis
  const toc = [];
  html = html.replace(/<h([12])>(.*?)<\/h\1>/g, (_, lvl, text) => {
    const id = slug(text) + "-" + toc.length;
    toc.push({ lvl: Number(lvl), text, id });
    return `<h${lvl} id="${id}">${text}</h${lvl}>`;
  });
  // Kapitelnummern
  let n = 0;
  const tocHtml = toc
    .map((e) => (e.lvl === 1 ? `<li class="c"><a href="#${e.id}"><b>${++n}</b>${e.text}</a></li>` : `<li class="s"><a href="#${e.id}">${e.text}</a></li>`))
    .join("");
  return { meta, html, tocHtml };
}

const CSS = readFileSync(resolve(here, "style.css"), "utf8");

function page({ meta, html, tocHtml }, book) {
  const today = new Date().toLocaleDateString(book.date, { day: "numeric", month: "long", year: "numeric" });
  return `<!doctype html><html lang="${esc(meta.lang || "de")}"><head><meta charset="utf-8">
<title>${esc(meta.title)} – ${esc(meta.subtitle || "")}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400..700&family=DM+Sans:wght@400..700&display=swap">
<style>${CSS}</style></head><body>
<section class="cover">
  <div class="kicker">Home Assistant · Integration</div>
  <h1 class="title">${esc(meta.title)}</h1>
  <div class="subtitle">${esc(meta.subtitle || "")}</div>
  ${meta.cover_image ? `<img class="shot" src="${esc(meta.cover_image)}" alt="">` : ""}
  <div class="meta">Version ${esc(VERSION)} · ${esc(today)}<br>github.com/Goldi5/Raumklima-2</div>
</section>
<section class="toc"><h2>${esc(meta.toc || "Inhalt")}</h2><ol>${tocHtml}</ol></section>
<main>${html}</main>
</body></html>`;
}

const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const browser = await chromium.launch(launch);
mkdirSync(join(here, "dist"), { recursive: true });
for (const book of BOOKS) {
  const doc = render(readFileSync(join(here, book.src), "utf8"));
  const tmp = join(here, `.${book.src}.html`); // im Ordner handbook, damit ../docs/images passt
  writeFileSync(tmp, page(doc, book));
  const p = await browser.newPage();
  await p.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" }).catch(() => p.goto(pathToFileURL(tmp).href));
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({
    path: join(here, "dist", book.out),
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: `<div style="width:100%;font-family:Arial,sans-serif;font-size:8px;color:#8E97A3;padding:0 18mm;display:flex;justify-content:space-between"><span>${esc(doc.meta.footer || "")}</span><span class="pageNumber"></span></div>`,
    margin: { top: "16mm", bottom: "18mm", left: "18mm", right: "18mm" },
  });
  await p.close();
  if (!process.env.KEEP_HTML) rmSync(tmp);
  console.log(`✓ dist/${book.out}`);
}
await browser.close();
