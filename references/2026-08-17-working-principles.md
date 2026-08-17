# Working Principles — Invitation Projects

**Recorded:** 17 August 2026  
**Purpose:** Prevent avoidable delivery friction. These are default operating rules for future invitation projects unless the user explicitly asks for a different workflow.

## 1. Git: use plain Git first

The normal workflow is the user's terminal and the repository's existing remote:

```powershell
git status
git add -A
git commit -m "<clear summary>"
git push origin main
```

Rules:

- Do not require GitHub CLI, a device-login flow, a pull request, or a new branch for a straightforward commit-and-push request.
- Do not change the remote from HTTPS to SSH unless the user asks for that change.
- Inspect `git status` and the diff before staging. If every changed file belongs to the current request, `git add -A` is appropriate.
- If Git reports dubious ownership, trust only the exact repository path with `git config --global --add safe.directory "<exact path>"`; do not use a broad wildcard or disable the check globally.
- Do not create commits, branches, PRs, or change Git configuration unless the user asked for the corresponding action.

## 2. Preview images: optimise before sharing

The social card is usually first consumed inside WhatsApp. It must be quick to fetch and reliably preview.

- Build the share image at **1200 × 630**.
- Export as a compressed JPEG unless transparency is genuinely needed.
- Target **under 300 KB**; 90–150 KB is preferred when visual quality holds.
- Check the actual byte size as part of asset generation and automated tests.
- Keep the physical-card source high resolution for print, but make a separate lightweight review preview. Do not reuse a print PNG or a multi-megabyte raster as an OG image.
- Preserve the strongest approved fabric/brand artwork. Improve composition, typography and compression before replacing it with a generated substitute.

## 3. Visual testing: validate, do not become the art director

The user is the fastest and most authoritative judge of visual taste. Browser checks should catch regressions, not turn into prolonged autonomous design iteration.

- After a visual implementation, do one concise mobile check and one desktop check.
- Verify the essentials: page loads, hero is legible, primary action is reachable, fabric/reveal completes, and no unexpected text or overlay remains.
- Use static or settled states for most checks. Watch the complete animation only when changing choreography or physics.
- Share a clear local result quickly, then let the user steer aesthetic refinements.
- Avoid repeated screenshot cycles when the user can inspect the live page more quickly.

## 4. Deployment: Vercel is the production path

This project's normal deployment target is **Vercel**, not ChatGPT Sites or any substitute hosting platform.

- Before a commit intended for deployment, run `npm run build:vercel` in addition to the normal lint/test checks.
- Keep `vercel.json`, Next.js settings and production assets compatible with the Vercel build.
- Push only when asked. The repository's Vercel integration can deploy from that push.
- If asked to deploy manually, use the existing Vercel project and verify the deployed URL returns the invitation rather than a 404 before declaring it live.
- Do not create, migrate to, or deploy through ChatGPT Sites unless the user explicitly asks.

## Pre-push checklist

1. Confirm the changed files all belong to the requested work.
2. Run `npm run lint`, `npm test`, and `npm run build:vercel` for a production-bound update.
3. Check the OG image is below 300 KB and the physical QR still resolves to the live invitation URL.
4. Let the user perform the final aesthetic review; only then commit and push if requested.
