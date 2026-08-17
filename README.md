# A Keepsake, For You

A private, romantic gift PWA — a museum-style photo archive, a favorites hub, a birthday countdown, mini games, and rotating love notes, all wrapped in one installable app.

It works immediately with built-in demo content, and is designed to become fully yours the moment you connect Supabase.

---

## 1. What's inside

```
my-gift-app/
  src/
    app/                 App shell, routing, Theme + Supabase providers
    components/
      layout/             Navbar, Footer, AppShell (ambient background)
      ui/                 Button, Card, Modal, Skeleton, EmptyState, ErrorState, Tag, Toast
    hooks/                useAsync, useCountdown, useLocalStorage
    lib/                  constants (your editable content), date helpers, cn()
    services/             supabaseClient.js, storageService.js
    modules/
      home/               Landing experience
      museum/              Photo archive: grid, lightbox, filters, special exhibit
      favorites/           Music, quotes, to-dos, links, surprises
      countdown/           Countdown, candles, celebration + confetti
      playground/          Trivia, memory match, clicker game, trophy shelf
      loveNotes/           Daily note + hidden note reveal (used across modules)
      settings/            Theme mode + secret passphrase gate
  public/
    manifest.json, offline.html, icons/, demo-photos/
  schema.sql              Full Supabase migration (tables, RLS, seed data)
  .env.example
```

## 2. Local setup

```bash
npm install
cp .env.example .env      # fill in your Supabase values (or leave blank for demo mode)
npm run dev                # http://localhost:5173
```

The app runs **without Supabase configured** — it falls back to built-in demo photos, notes, favorites, and trivia so you can see everything working on first run. Once you add your Supabase credentials, it switches to your real data automatically.

## 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor > New query**, paste the entire contents of `schema.sql`, and run it. This creates all tables, indexes, RLS policies, the `photos` storage bucket, and seed data (a birthday event, love notes, sample favorites, trivia questions, and sample photo rows).
3. Go to **Project Settings > API** and copy your **Project URL** and **publishable key** (formerly "anon public key") into `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…
   ```
   The app also accepts the older `VITE_SUPABASE_ANON_KEY` name if you prefer it.
4. Restart `npm run dev`.

### Uploading real photos

`schema.sql` seeds four rows pointing at `sample/photo-01.jpg` … `sample/photo-04.jpg` in the `photos` storage bucket. To use your own pictures:

1. Go to **Storage > photos** in the Supabase Dashboard and upload your images (any path/folder naming you like, e.g. `2024/beach.jpg`).
2. In **Table Editor > photos**, edit `storage_path` on each row to match, or add new rows. Set `caption`, `taken_on`, `tags` (array), `curator_note`, and `is_special` as you like.

### Customizing content

Everything else (love notes, favorites, trivia questions, the birthday date) is editable the same way — through **Table Editor**, no code changes needed:

- `events` → set the real `event_at` timestamp for `event_key = 'birthday'`, plus an optional `meta.celebration_message` and `meta.music_url`.
- `love_notes` → add/edit rows; `note_index` controls day rotation order, `special_date` overrides for a specific date, `unlock_key` ties a note to a game reward (`trivia`, `memory`, `clicker`) or the museum easter egg (`museum-egg`).
- `favorites` → `type` is one of `music | todo | quote | link | video`; set `is_surprise = true` for a tap-to-reveal card.
- `game_questions` → trivia bank for the Playground module.

## 4. Storage & privacy model

By default, `schema.sql` creates the `photos` bucket as **public read** — anyone with a direct image URL can view it, but the URLs aren't discoverable unless someone has the app link. This is a reasonable tradeoff for a gift shared privately with one person, but it is **not real privacy**.

For stronger privacy:
1. In Storage, make the `photos` bucket private and add a `storage.objects` SELECT policy restricted to authenticated users (see the comment block in `schema.sql` for the exact SQL).
2. Enable Supabase Auth and require sign-in before the app renders.
3. Swap `getPhotoUrl()` for `getSignedPhotoUrl()` in `src/services/storageService.js` (already implemented, just unused by default).
4. Tighten the RLS `select` policies in `schema.sql` from `using (true)` to `using (auth.uid() is not null)`.

The **Settings > Secret mode** passphrase gate is a light, tasteful surprise mechanic — not a security boundary. Anyone with browser devtools can bypass it. Don't rely on it for anything truly sensitive.

## 5. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | For real data | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | For real data | Supabase publishable key (formerly anon key — `sb_publishable_…`). `VITE_SUPABASE_ANON_KEY` also works. Never use the service role key |
| `VITE_RECIPIENT_NAME` | No | Name shown on the home page ("For {name}, with everything I have.") |
| `VITE_BIRTHDAY_EVENT_KEY` | No | Defaults to `birthday`, matches `events.event_key` |
| `VITE_SECRET_PASSPHRASE` | No | Passphrase for Settings > Secret mode (defaults to `ourfirstdate`) |

**Never put a Supabase service role key in this app.** Only the anon key belongs in frontend code — it's designed to be public and is constrained entirely by your RLS policies.

## 6. Testing & validation

```bash
npm install       # installs cleanly
npm run dev        # starts local dev server
npm run build       # production build — verified working
npm run preview     # serves the production build locally
npm run lint         # oxlint
```

### What was verified in this build
- `npm install` and `npm run build` complete without errors (Vite + PWA plugin, ~333 KB main bundle gzipped to ~106 KB).
- The app runs fully on demo content with no Supabase configuration — all six routes render, all games are playable, the countdown ticks, the museum lightbox opens/closes via mouse, keyboard, and Escape.
- `schema.sql` seed data types match what the frontend expects field-for-field (checked `favorites.type` enum, `photos.tags` array, `love_notes.unlock_key` linkage into games and the museum easter egg).
- Service worker + manifest are generated on build (`dist/sw.js`, `dist/manifest.webmanifest`) with runtime caching rules for Supabase Storage and REST endpoints.
- Reduced-motion is respected across the ambient background, candle flicker, confetti, and card-flip micro-interactions.

### Manual QA checklist (do this after deploying)
- [ ] Every route loads: `/`, `/museum`, `/favorites`, `/countdown`, `/playground`, `/settings`
- [ ] Supabase reads succeed once `.env` is set (Settings page shows "connected")
- [ ] Museum lightbox: opens/closes by click, Tab-trapped, Escape closes, arrow keys navigate
- [ ] Favorites to-do: add, toggle, persists after reload
- [ ] Countdown reaches zero correctly and triggers candles → confetti → reveal
- [ ] Trivia, memory match, and clicker each unlock a trophy and a hidden note
- [ ] Install prompt appears (desktop Chrome / Android); offline fallback shows when network is off
- [ ] Keyboard-only pass: every interactive element is reachable and has a visible focus ring

## 7. Deployment

### Vercel
1. Push this project to a GitHub repo.
2. In Vercel, **New Project** → import the repo.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (and any optional vars) under **Environment Variables**.
5. Deploy.

### Netlify
1. **New site from Git** → select the repo.
2. Build command: `npm run build`. Publish directory: `dist`.
3. Add the same environment variables under **Site settings > Environment variables**.
4. Deploy.

### PWA install
- **Android (Chrome):** visit the deployed URL → menu (⋮) → "Install app" (or an automatic install banner appears).
- **iOS (Safari):** visit the URL → Share icon → "Add to Home Screen".

## 8. Reveal ideas

- Print a QR code linking to the deployed URL inside a physical birthday card.
- Install it on her phone yourself right before handing it over, so it's already a home-screen icon.
- Turn it into a small treasure hunt: text her the `/playground` link first, and let the reward unlock the rest.

## 9. Known limitations

- The "secret mode" gate and museum easter egg are client-side conveniences, not security — see section 4.
- Public write policies on `favorites` and `games` mean anyone with the link can edit the to-do list or game scores. That's fine for a two-person gift app; add Supabase Auth if you need to lock this down further.
- Demo/offline mode uses generated placeholder photos in `public/demo-photos/` — replace with real photos via Supabase Storage as described above.

---

**Customize before sending:** `VITE_RECIPIENT_NAME` in `.env`, the birthday date in the `events` table, your real photos in Storage + the `photos` table, your playlist link in `events.meta.music_url`, and the love notes in the `love_notes` table.
