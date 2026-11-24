import { THEME } from '@/lib/theme';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, Ellipse, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

// Jar outline from logo-mark.svg with an elliptical base, drawn 1:1 so SVG units are pixels.
const BODY =
  'M66 54H134V64Q134 72 142 78Q166 96 166 126V188Q166 206 100 206Q34 206 34 188V126Q34 96 58 78Q66 72 66 64Z';
const W = 200;
const H = 220;

// Crumb slots as [x, y, radius]: the first SEED start in the jar, taps fill the rest.
const SLOTS = [
  [68, 188, 9],
  [94, 192, 6],
  [120, 186, 10],
  [146, 188, 6],
  [84, 172, 6],
  [107, 168, 7],
  [134, 170, 5],
  [72, 156, 5],
  [96, 154, 6],
  [122, 156, 5],
  [146, 158, 4],
  [108, 142, 5],
] as const;
const SEED = 7;

type Slot = (typeof SLOTS)[number];

function Crumb({
  slot: [x, y, r],
  i,
  fall,
  breath,
  color,
}: {
  slot: Slot;
  i: number;
  fall: boolean;
  breath: SharedValue<number>;
  color: string;
}) {
  const ty = useSharedValue(fall ? 16 - y : 0);
  useEffect(() => {
    if (fall) ty.value = withTiming(0, { duration: 560, easing: Easing.bounce });
  }, [fall, ty]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value - breath.value * (1 + (i % 3) * 0.7) }],
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: r,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

// Onboarding jar: step 0 drops a crumb, 1 fogs the glass, 2 lifts one crumb back out.
export function JarScene({ step, onPress }: { step: number; onPress?: () => void }) {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';
  const t = THEME[dark ? 'dark' : 'light'];
  const reduce = useReducedMotion();
  const [count, setCount] = useState(SEED);

  const breath = useSharedValue(0);
  const lid = useSharedValue(0);
  const tilt = useSharedValue(0);
  const fog = useSharedValue(0);
  const rise = useSharedValue(0);
  const ring = useSharedValue(0);

  // Glass reads as a cylinder: darker at the edges, lighter in the middle, in both themes.
  const [edge, center] = dark ? [t.card, t.secondary] : [t.muted, t.card];
  const [lidSide, lidTop] = dark ? [t.primary, t.foreground] : [t.foreground, t.mutedForeground];
  const shine = dark ? t.mutedForeground : t.card;

  const to = (v: number, duration: number) => (reduce ? v : withTiming(v, { duration }));

  const drop = () => {
    if (count >= SLOTS.length) return;
    setCount((c) => Math.min(c + 1, SLOTS.length));
    if (!reduce)
      lid.value = withSequence(withTiming(-12, { duration: 140 }), withDelay(260, withSpring(0)));
  };

  useEffect(() => {
    breath.value = reduce
      ? 0
      : withRepeat(withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [reduce, breath]);

  useEffect(() => {
    fog.value = to(step === 1 ? 0.75 : 0, 600);
    rise.value = to(step === 2 ? 1 : 0, 700);
    if (step === 2 && !reduce)
      ring.value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(500, withTiming(1, { duration: 900 }))
      );
    if (step === 0) drop();
  }, [step]);

  const press = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!reduce)
      tilt.value = withSequence(
        withTiming(-2, { duration: 80 }),
        withTiming(2, { duration: 120 }),
        withSpring(0)
      );
    // From another step, onPress moves to step 0 and the step effect drops, so it never drops twice.
    if (step === 0) drop();
    onPress?.();
  };

  const tiltStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${tilt.value}deg` }] }));
  const lidStyle = useAnimatedStyle(() => ({ transform: [{ translateY: lid.value }] }));
  const fogStyle = useAnimatedStyle(() => ({ opacity: fog.value }));
  const riseStyle = useAnimatedStyle(() => ({
    opacity: Math.min(rise.value * 2, 1),
    transform: [
      { translateY: rise.value * -52 - breath.value * 2 },
      { scale: 1 + rise.value * 0.35 },
    ],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ring.value > 0 ? (1 - ring.value) * 0.9 : 0,
    transform: [{ scale: 0.45 + ring.value * 0.75 }],
  }));

  return (
    <Pressable
      onPress={press}
      accessibilityRole="button"
      accessibilityLabel="Jar of crumbs"
      accessibilityHint="Drops a crumb into the jar">
      <Animated.View style={[{ width: W, height: H, transformOrigin: '50% 100%' }, tiltStyle]}>
        <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="jar-glass" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={edge} />
              <Stop offset="0.4" stopColor={center} />
              <Stop offset="0.6" stopColor={center} />
              <Stop offset="1" stopColor={edge} />
            </LinearGradient>
          </Defs>
          <Path d={BODY} fill="url(#jar-glass)" />
          <Path
            d="M36 188Q36 170 100 170Q164 170 164 188"
            stroke={t.border}
            strokeWidth={1.5}
            fill="none"
          />
        </Svg>

        {SLOTS.slice(0, count).map((slot, i) => (
          <Crumb
            key={i}
            slot={slot}
            i={i}
            fall={i >= SEED && !reduce}
            breath={breath}
            color={t.marigold}
          />
        ))}

        <Animated.View style={[StyleSheet.absoluteFill, fogStyle]}>
          <Svg width={W} height={H}>
            <Path d={BODY} fill={center} />
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 78,
              top: 150,
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            },
            riseStyle,
          ]}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 44,
                height: 44,
                borderRadius: 22,
                borderWidth: 1.5,
                borderColor: t.marigold,
              },
              ringStyle,
            ]}
          />
          <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: t.marigold }} />
        </Animated.View>

        <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
          <Path
            d={BODY}
            fill="none"
            stroke={t.foreground}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <Path
            d="M62 88Q50 98 47 112M47 124V170"
            stroke={shine}
            strokeWidth={5}
            strokeLinecap="round"
            fill="none"
            opacity={dark ? 0.45 : 0.9}
          />
          <Path
            d="M154 130V158"
            stroke={shine}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={dark ? 0.3 : 0.6}
          />
          <Ellipse
            cx={100}
            cy={54}
            rx={34}
            ry={4}
            fill={edge}
            stroke={t.foreground}
            strokeWidth={2.5}
          />
        </Svg>

        <Animated.View style={[StyleSheet.absoluteFill, lidStyle]}>
          <Svg width={W} height={H}>
            <Rect x={60} y={36} width={80} height={16} rx={5} fill={lidSide} />
            <Ellipse cx={100} cy={37} rx={39} ry={4} fill={lidTop} />
          </Svg>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
