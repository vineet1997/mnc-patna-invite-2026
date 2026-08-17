import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

async function worker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: builtWorker } = await import(workerUrl.href);
  return builtWorker;
}

const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const context = { waitUntil() {}, passThroughOnException() {} };

test("server-renders a complete static invitation and social metadata", async () => {
  const response = await (await worker()).fetch(
    new Request("https://invite.example/", {
      headers: {
        accept: "text/html",
        host: "invite.example",
        "x-forwarded-host": "invite.example",
        "x-forwarded-proto": "https",
      },
    }),
    env,
    context,
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Home Fashionista Rising 2026 · Patna<\/title>/i);
  assert.match(html, /An exclusive preview of the new season\./);
  assert.match(html, /08 September 2026|08 Sep/);
  assert.match(html, /Crystal Hall \(9 to 9\)/);
  assert.match(html, /Send RSVP on WhatsApp/);
  assert.match(html, /Five names\./);
  assert.match(html, /A private invitation from/);
  assert.doesNotMatch(html, /Replay cloth/);
  assert.doesNotMatch(html, /Skip reveal/);
  assert.doesNotMatch(html, /Scroll to enter/);
  assert.doesNotMatch(html, /Private invitation · Patna/);
  assert.doesNotMatch(html, /01 \/ Discover|The finest seasons begin/);
  assert.match(html, /https:\/\/invite\.example\/og\.jpg/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("serves a valid downloadable calendar event", async () => {
  const response = await (await worker()).fetch(
    new Request("https://invite.example/calendar"),
    env,
    context,
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/calendar\b/i);
  assert.match(response.headers.get("content-disposition") ?? "", /home-fashionista-rising-2026-patna\.ics/);
  const calendar = await response.text();
  assert.match(calendar, /DTSTART;TZID=Asia\/Kolkata:20260908T110000/);
  assert.match(calendar, /SUMMARY:Home Fashionista Rising 2026/);
  assert.match(calendar, /LOCATION:Crystal Hall \(9 to 9\)/);
});

test("ships a WhatsApp-sized social card and a scannable print QR", async () => {
  const [{ default: sharp }, { default: jsQR }, socialImage] = await Promise.all([
    import("sharp"),
    import("jsqr"),
    stat(new URL("../public/og.jpg", import.meta.url)),
  ]);
  assert.ok(socialImage.size < 300 * 1024, `social image is ${Math.round(socialImage.size / 1024)} KB`);

  const cardPath = fileURLToPath(new URL("../output/print/home-fashionista-rising-2026-patna-card.png", import.meta.url));
  const { data, info } = await sharp(cardPath).extract({ left: 1450, top: 850, width: 230, height: 230 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const decoded = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  assert.equal(decoded?.data, "https://home-fashionista-rising-2026.vercel.app/");
});

test("keeps motion optional, physical and event facts centralized", async () => {
  const [css, eventData, clothSimulation, packageJson, vercelConfig, socialImage] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../lib/event.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/clothSimulation.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
    stat(new URL("../public/og.jpg", import.meta.url)),
  ]);

  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /animation-duration:\s*\.01ms/);
  assert.match(eventData, /rsvpPhone:\s*"919431022128"/);
  assert.match(eventData, /mapsUrl:/);
  assert.match(eventData, /boutique-living-ivory\.png/);
  assert.match(clothSimulation, /fixedStep:\s*1 \/ 60/);
  assert.match(clothSimulation, /constraintPasses:/);
  assert.match(clothSimulation, /settleSpeed:/);
  assert.doesNotMatch(css, /mix-blend-mode/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(vercelConfig, /"framework":\s*"nextjs"/);
  assert.ok(socialImage.size < 300 * 1024, `social image is ${Math.round(socialImage.size / 1024)} KB`);
});
