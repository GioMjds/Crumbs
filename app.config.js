const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

/**
 * Resolve per-profile values.
 * Production falls through to the plain defaults (no suffix).
 */
function getAppName() {
  if (IS_DEV) return 'Crumbs (Dev)';
  if (IS_PREVIEW) return 'Crumbs (Preview)';
  return 'Crumbs';
}

function getPackageName() {
  if (IS_DEV) return 'com.giomjds.crumbs.dev';
  if (IS_PREVIEW) return 'com.giomjds.crumbs.preview';
  return 'com.giomjds.crumbs';
}

function getBundleId() {
  if (IS_DEV) return 'com.giomjds.crumbs.dev';
  if (IS_PREVIEW) return 'com.giomjds.crumbs.preview';
  return 'com.giomjds.crumbs';
}

function getScheme() {
  if (IS_DEV) return 'crumbs-dev';
  if (IS_PREVIEW) return 'crumbs-preview';
  return 'crumbs';
}

/**
 * app.config.js — Dynamic Expo config for Crumbs.
 *
 * APP_VARIANT is injected by EAS via eas.json `env` blocks:
 *   development  →  "development"
 *   preview      →  "preview"
 *   production   →  (unset, defaults to production values)
 *
 * Each variant gets a distinct package name so all three builds
 * can be installed side-by-side on the same Android device.
 */
module.exports = ({ config }) => {
  return {
    ...config,

    name: getAppName(),
    scheme: getScheme(),

    ios: {
      ...config.ios,
      bundleIdentifier: getBundleId(),
    },

    android: {
      ...config.android,
      package: getPackageName(),
    },

    extra: {
      ...config.extra,
      googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
      appVariant: process.env.APP_VARIANT ?? 'production',
    },
  };
};