import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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
  assert.match(html, /A new season rises\./);
  assert.match(html, /08 September 2026|08 Sep/);
  assert.match(html, /Crystal Hall \(9 to 9\)/);
  assert.match(html, /Review &amp; send on WhatsApp/);
  assert.match(html, /https:\/\/invite\.example\/og\.png/);
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

test("keeps motion optional and event facts centralized", async () => {
  const [css, eventData, packageJson] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../lib/event.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /animation-duration:\s*\.01ms/);
  assert.match(eventData, /rsvpPhone:\s*"919431022128"/);
  assert.match(eventData, /mapsUrl:/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
