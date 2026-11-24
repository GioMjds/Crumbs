# Activity Log

## 2026-11-24 - Local weekly notifications

- Added `lib/notify.ts` with `syncNotification(db)`: cancels scheduled notifications, then schedules one weekly local notification from the saved schedule when `notify` is on.
- Called it from the Settings toggle, the schedule sheet save, and delete-all. A denied permission turns `notify` off and shows an alert.
- Registered a foreground handler in `app/_layout.tsx` so the banner shows while the app is open.
- Dev builds (`__DEV__`) also fire one notification 5 seconds after enabling, for testing.
- Assumption: "Surprise me" picks one random day and hour (9 AM to 8 PM) at save time, which then repeats weekly.
- Assumption: the notification text is generic because the 90-day rest rule is checked only when the app opens.

## 2026-11-24 - README and CONTEXT written

- Rewrote `README.md` from the Reusables template into a Crumbs overview: pitch, scripts, structure, build variants, doc links.
- Filled `CONTEXT.md`: glossary, stack, screens, data model and rules, build config, status, open decisions.
- Assumption: notifications are not actually scheduled yet; `expo-notifications` is installed but unused. Documented as not built.

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

## 2026-11-24 Dark palette contrast pass

- Text pairs already passed AA; surfaces, borders and primary buttons were the problem.
- Dark card #201E40 to #262450, secondary/muted/accent #2C2A52 to #37346A, border/input #34325C to #6E6C9A (about 3:1 on cards).
- Dark primary #EEEFF9 to soft lavender #C4C2E8 with #24224A text (8.7:1), chosen by user to cut glare.
- Dark marigold edge #6B4C1F to #A87A30 so the "crumb is back" banner outline shows.
- Button destructive variant uses text-destructive-foreground and no dark 60% fill.
- Real cause of the dark-mode black text: `cn` (tailwind-merge) read custom font sizes like `text-title` as colors and dropped `text-foreground`. `lib/utils.ts` now registers them as font sizes.

## 2026-11-24 Branded Alert

- `components/alert.tsx` replaces native `Alert.alert` with a themed dialog (jar Lottie, stacked buttons, Cancel last). Same call signature; `AlertHost` is mounted in `app/_layout.tsx`.
- Dark mode recolors the jar's Inkwell lid and outline via Lottie `colorFilters`; reduced motion shows the final frame.
