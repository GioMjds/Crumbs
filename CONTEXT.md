# Crumbs: Project Context

Read this with [PRODUCT.md](./PRODUCT.md) (strategy), [DESIGN.md](./DESIGN.md) (visuals), and [AGENTS.md](./AGENTS.md) (working rules).

## What it is

Crumbs is a calm, private mobile app. Users drop short thoughts into a jar in seconds. Later, the app returns one thought so the user meets it again and can build on it. The value is the return, not the archive.

Core commitments: rediscovery over search, zero-friction capture, on-device only (no account, no cloud), slow pace (no streaks, feeds, or guilt).

## Glossary

| Term          | Meaning                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| Crumb         | One captured thought.                                                   |
| Jar           | The collection of all crumbs.                                           |
| Capture field | The text input on the home screen where a crumb is written.             |
| Rediscovery   | The moment a crumb is returned to the user.                             |
| Layer         | A thought added to a returned crumb ("Add a thought").                  |
| Pending       | The crumb currently waiting to be opened, shown as a banner on capture. |
| Pull one      | Manual rediscovery from the jar: returns any crumb not let go.          |

## Stack

- Expo SDK 56, React Native 0.85, React 19, TypeScript, New Architecture.
- Expo Router (file-based routes in `app/`).
- Nativewind 4 + Tailwind 3 + React Native Reusables (`components/ui`).
- `expo-sqlite` for storage; `SQLiteProvider` in the root layout runs `migrate` on init.
- `expo-haptics`, `lottie-react-native` (jar animation), `lucide-react-native` icons.
- Fonts: Bricolage Grotesque (UI) and Literata (crumb text), loaded in `app/_layout.tsx`.
- `expo-notifications` and `expo-updates` are installed; EAS Build/Update configured in `eas.json`.

## Screens

| Route              | Purpose                                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                | Capture. Draft autosaves (300 ms debounce). Shows "A crumb is back" banner when one is pending. Redirects to `/onboarding` on first run. |
| `/onboarding`      | Three-step intro and first-run flag.                                                                                                     |
| `/jar`             | List of crumbs: "This week" and collapsible "Resting". "Pull one" button.                                                                |
| `/crumb/[id]`      | One crumb with its layers; delete with confirm.                                                                                          |
| `/rediscover/[id]` | Modal for a returned crumb: Add a thought, Keep, or Let go.                                                                              |
| `/schedule`        | Form sheet to pick "Surprise me" or a fixed weekly day and hour. Shown once after the first crumb.                                       |
| `/settings`        | Schedule, notifications toggle, local stats, privacy, "Delete everything".                                                               |

## Data model

Defined in `lib/crumbs.ts`.

- `crumbs`: `id`, `body`, `created_at`, `status` (`active` | `kept` | `let_go`), `came_back_count`, `last_back_at`.
- `layers`: `id`, `crumb_id` (cascade delete), `body`, `created_at`.
- `settings`: key/value text. Keys in use: `onboarded`, `draft`, `schedule_asked`, `notify`, `mode`, `day`, `hour`, `pending`.

Key rules:

- Adding a layer sets an `active` crumb to `kept`.
- A crumb is due again 90 days (`REST_DAYS`) after its last return, or after creation if never returned.
- `refreshPending` sets the pending crumb only when notifications are on, none is already pending, no crumb came back in the last 7 days, and one has rested 90 days.
- Opening a pending crumb calls `markBack`, which bumps `came_back_count`, stamps `last_back_at`, and clears `pending`.
- `let_go` crumbs stay stored but are never returned.

## Build and config

- `app.config.js` derives name, bundle ID, package, and scheme from `APP_VARIANT` (`development`, `preview`, or production when unset).
- `eas.json` profiles: `development`, `preview`, `production` (AAB), `apk`. Update channels match profile names.
- EAS project: `@mimic1/crumbs`. `.env.local` (gitignored) sets `APP_VARIANT=development`.
- Path alias `@/` maps to the project root.

## Conventions

- Brand tokens (Inkwell `#24224A`, Marigold, Dusk Mist) live in `global.css` and `tailwind.config.js`; see DESIGN.md.
- Prefer semantic roles and accessibility labels on touchables.
- Shared date helpers are in `lib/format.ts`; reuse them instead of formatting inline.
- Log notable changes in `docs/activity-log.md`. Do not auto-commit docs or logs.

## Current status

Built: all screens above, SQLite data layer, onboarding, draft autosave, schedule sheet, settings stats, delete-all.

Not built yet:

- Real local notifications. The schedule and `notify` flag are saved, but nothing is scheduled with `expo-notifications`; the banner is driven by `refreshPending` when the app opens.
- The 24-hour seal on crumb editing.
- Dark-mode screen review.
- `button.tsx` and `text.tsx` in `components/ui` are still stock Reusables and do not match DESIGN.md.
- FCM `google-services.json` per package and per-environment Google client IDs.
- No tests exist yet, although `jest` and `jest-expo` are installed.

## Open decisions

- How often random Rediscovery fires, and whether users get quiet hours or a frequency control.
- Whether a returned crumb stays in rotation or retires.
- The 90-day rest and 7-day gap are working assumptions, not confirmed product rules.
