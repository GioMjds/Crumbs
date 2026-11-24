# Activity Log

## 2026-11-24 - Build variant setup fixes

- Installed `expo-updates` so the `channel` values in `eas.json` take effect.
- Ran `eas init --force`, which created the EAS project `@mimic1/crumbs` and wrote `extra.eas.projectId` to `app.json`.
- Ran `eas update:configure`, which added `updates.url` and `runtimeVersion: { policy: "appVersion" }`.
- Removed the resolved values that the EAS CLI copied into `app.json` (`extra.googleClientId`, `extra.appVariant`, `extra.router`, `ios.bundleIdentifier`, `android.package`), because `app.config.js` sets them per variant.
- Removed `android.buildType: apk` from the production profile, so production builds an AAB for the Play Store.
- Added `.env.local` with `APP_VARIANT=development` so local `expo start` resolves the dev variant (`.env.local` is gitignored).
- Deferred: FCM `google-services.json` per package, and per-environment Google client IDs via the EAS `environment` field.

## 2026-11-24 - Design system documented

- Added `DESIGN.md` from the tokens in `global.css`/`tailwind.config.js` and the canvas in `CRUMBS_UI_DESIGN.pdf`.
- North Star: "The Lamplit Notebook". Colors named Inkwell (#24224A) and Dusk Mist (#EEEFF9).
- Added `.impeccable/design.json` sidecar (color ramps, Lottie motion, 8 component snippets).
- Reusables `button.tsx`/`text.tsx` are still stock and do not match DESIGN.md yet.

## 2026-11-24 - MVP screens from CRUMBS_UI_DESIGN.pdf

- Added routes: `/` (capture, redirects to `/onboarding` until first run), `/onboarding`, `/schedule` (form sheet), `/rediscover/[id]` (modal, includes Add a thought), `/jar`, `/crumb/[id]`, `/settings`.
- Added `lib/crumbs.ts` (SQLite schema, queries, `useFocusData`), `lib/format.ts`, and `components/` (`screen`, `header`, `chip`, `logo`).
- Root layout now loads Bricolage Grotesque and Literata and wraps the app in `SQLiteProvider`.
- Assumption: a crumb is due 90 days after its last return (or drop). `refreshPending` sets the banner crumb when notifications are on and none came back in 7 days. "Pull one" returns any crumb not let go.
- Deferred: scheduling real local notifications with `expo-notifications`, the 24-hour seal on crumb editing, dark-mode screen review.
