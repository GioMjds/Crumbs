import { useColorScheme } from 'nativewind';
import { Image } from 'react-native';

const LOGO = {
  light: require('@/assets/images/logo-wordmark.png'),
  dark: require('@/assets/images/logo-wordmark-dark.png'),
};

// Wordmark is 857x240; height drives the width.
export function Logo({ height = 28 }: { height?: number }) {
  const { colorScheme } = useColorScheme();
  return (
    <Image
      source={LOGO[colorScheme ?? 'light']}
      accessibilityLabel="Crumbs"
      resizeMode="contain"
      style={{ height, width: (height * 857) / 240 }}
    />
  );
}
