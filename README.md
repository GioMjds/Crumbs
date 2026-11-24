# Crumbs

Drop any thought. Once a week, one comes back.

Crumbs is a private, on-device mobile app for capturing fleeting thoughts ("crumbs") in seconds and getting them back later. It is not a notes app: nothing is filed, tagged, or searched. The jar returns one crumb at a time, and you can grow it by adding a layer.

Built with [Expo](https://expo.dev/) (SDK 56), [Expo Router](https://expo.dev/router), [Nativewind](https://www.nativewind.dev/), and [React Native Reusables](https://reactnativereusables.com). Runs on iOS and Android.

## How it works

1. **Drop it.** Write a thought in the capture field and tap Drop. No title, tag, or folder.
2. **Forget it.** The jar keeps it on the phone. Browse it any time, or pull one out when stuck.
3. **Meet it again.** A returned crumb can be kept, added to ("Add a thought"), or let go.

All data lives in on-device SQLite. There is no account, no cloud, and no sync.

## Getting started

```bash
npm install
npm run dev
```

This starts the Expo dev server. Press `i` for the iOS simulator (Mac only), `a` for an Android emulator, or scan the QR code with a development build on a device.

| Script            | Purpose                      |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the dev server (clean) |
| `npm run android` | Start and open on Android    |
| `npm run ios`     | Start and open on iOS        |
| `npm run web`     | Start and open on web        |

## Build variants

`app.config.js` sets the app name, bundle ID, and URL scheme from the `APP_VARIANT` environment variable, so all three variants install side by side.

| Variant     | `APP_VARIANT` | Package / bundle ID          |
| ----------- | ------------- | ---------------------------- |
| Development | `development` | `com.giomjds.crumbs.dev`     |
| Preview     | `preview`     | `com.giomjds.crumbs.preview` |
| Production  | unset         | `com.giomjds.crumbs`         |

EAS profiles are in `eas.json`. For local runs, `.env.local` sets `APP_VARIANT=development` (gitignored).

## Documentation

- [CONTEXT.md](./CONTEXT.md): project context, domain terms, data model, and current status.
- [PRODUCT.md](./PRODUCT.md): users, purpose, positioning, and principles.
- [DESIGN.md](./DESIGN.md): visual tokens and components.
- [AGENTS.md](./AGENTS.md): working rules for contributors and AI agents.
- [docs/activity-log.md](./docs/activity-log.md): dated change log.

## Learn more

- [Expo Docs](https://docs.expo.dev/)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Nativewind Docs](https://www.nativewind.dev/)
- [React Native Reusables](https://reactnativereusables.com)
