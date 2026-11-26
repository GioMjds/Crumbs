# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Busy people who have fleeting ideas on the go. They want a passing thought caught in seconds, then handed back to them later, instead of losing it in a notes app they never reopen.

## Product Purpose

Crumbs lets people drop short thoughts ("crumbs") into a jar and later get them back. At an unpredictable moment, the app returns one crumb so the user meets the thought again and can grow it by adding a new layer. Success means thoughts that would have been lost get captured, and returned thoughts get revisited and built on.

## Positioning

Crumbs is not a notes app. Thoughts are not filed, tagged, or searched; the jar returns them one at a time. Four commitments define it together:

- **Rediscovery over search:** the product's value is the return, not the archive.
- **Zero-friction capture:** dropping a thought into the jar takes seconds.
- **Private, on-device:** thoughts live on the phone, with no account and no cloud.
- **Slow, calm pace:** no streaks, feeds, or pressure; the app rewards patience.

## Operating Context

- Capture happens in short moments on the go: open the app, write the thought, drop it in the jar.
- Rediscovery arrives as a local notification at a random time, like finding a note in an old coat. Opening it shows the returned crumb, with an "Add a thought" field to add a layer.
- The jar holds all crumbs; it can be browsed as a list of previews.
- **Pull one** lets the user pull a crumb from the jar by hand, alongside the timed return. It is a confirmed part of the product.

## Capabilities and Constraints

- Ships on iOS and Android together. One shared Crumbs identity, with controls and navigation following each OS's native conventions.
- Built with Expo (SDK 56) and Expo Router; storage is on-device SQLite (`expo-sqlite`); Rediscovery uses local notifications (`expo-notifications`).
- No accounts, sign-in, or cloud sync.
- Terminology: **crumb** (one captured thought), **jar** (the collection), **capture field** (where a crumb is written), **Rediscovery** (the moment a crumb is returned), **layer** (a thought added to a returned crumb), **Add a thought** (the field for adding a layer), **Pull one** (manual Rediscovery from the jar).
- Working assumption, not confirmed: reminders start only once the jar holds a crumb that has not been let go. "Surprise me" sends about one reminder every two days at random moments, any day and any hour. The alternative is a fixed weekly day and hour.
- Open decisions:
  - Whether users get quiet hours or a frequency control beyond the weekly schedule.
  - What happens to a returned crumb. The code currently offers Keep, Let go (stored but never returned), and Add a thought (which keeps it), with a 90-day rest and a 7-day minimum gap between returns. None of these rules are confirmed.
  - Whether crumbs lock against editing after they are dropped. App copy mentions a 24-hour seal, but it is not a product commitment and is not built.

## Brand Commitments

- Name: Crumbs.
- Logo mark: a jar holding crumbs (`assets/images/logo-mark.svg`), plus wordmarks for light and dark (`assets/images/logo-wordmark.png`, `assets/images/logo-wordmark-dark.png`).
- App icons for iOS (light, dark, tinted) and Android (adaptive foreground, monochrome), splash icons, and notification icon in `assets/images/`.
- Lottie animations: `assets/lottiefiles/jar.json`, `crumb-drop.json`, `crumb-mark.json`.

## Evidence on Hand

- Brand assets and animations listed above.
- Built screens in `app/`: capture (`index.tsx`), onboarding, jar with Pull one, crumb detail, Rediscovery modal, schedule sheet, and settings.
- No user research, testimonials, store listing copy, or usage data exist. Do not fabricate any.

## Product Principles

1. **Capture beats organization.** Never ask for a title, tag, or folder before a thought is saved.
2. **The jar returns; the user does not search.** Resurfacing is the feature, so it gets the most care.
3. **Calm over engagement.** No streaks, counters, badges, or guilt; a returned crumb is a gift, not a nag.
4. **Thoughts stay with the person.** Everything stays on the device; nothing asks for an account.
