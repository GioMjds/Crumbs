import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

type Button = { text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void };
type State = { title: string; message?: string | undefined; buttons: Button[] };

let show: ((s: State) => void) | null = null;

// Same call shape as React Native's Alert.alert, so call sites only swap the import.
export const Alert = {
  alert(title: string, message?: string, buttons: Button[] = [{ text: 'OK' }]) {
    show?.({ title, message, buttons });
  },
};

const BUTTON = {
  default: ['bg-primary', 'text-primary-foreground'],
  destructive: ['bg-destructive', 'text-destructive-foreground'],
  cancel: ['bg-secondary', 'text-foreground'],
} as const;

// Mount once near the app root; renders the branded dialog for every Alert.alert call.
export function AlertHost() {
  const [state, setState] = useState<State | null>(null);
  const { colorScheme } = useColorScheme();
  const reduceMotion = useReducedMotion();
  const t = THEME[colorScheme ?? 'light'];

  useEffect(() => {
    show = (s) => {
      if (s.buttons.some((b) => b.style === 'destructive'))
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setState(s);
    };
    return () => {
      show = null;
    };
  }, []);

  const press = (b?: Button) => {
    setState(null);
    b?.onPress?.();
  };

  // Back button and backdrop act as Cancel; a lone OK dialog can also be dismissed.
  const cancel = state?.buttons.find((b) => b.style === 'cancel');
  const dismiss = () => {
    if (cancel || state?.buttons.length === 1) press(cancel);
  };

  // The jar's Inkwell lid and outline vanish on dark cards, so lift them to the dark tokens.
  const colorFilters =
    colorScheme === 'dark'
      ? [
          { keypath: 'Lid', color: t.foreground },
          { keypath: 'Jar body.body.Stroke', color: t.foreground },
          { keypath: 'Jar body.body.Fill', color: t.secondary },
        ]
      : undefined;

  return (
    <Modal
      visible={!!state}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={dismiss}>
      <Pressable
        onPress={dismiss}
        accessible={false}
        className="flex-1 items-center justify-center bg-foreground/45 px-gutter dark:bg-background/80">
        {state ? (
          <Pressable
            role="alert"
            aria-modal
            className="w-full max-w-sm items-center rounded-dialog bg-card px-6 pb-6 pt-4">
            <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
              <LottieView
                source={require('@/assets/lottiefiles/jar.json')}
                autoPlay={!reduceMotion}
                progress={reduceMotion ? 1 : undefined}
                loop={false}
                colorFilters={colorFilters}
                style={{ width: 88, height: 97 }}
              />
            </View>
            <Text role="heading" className="mt-2 text-center font-sans-bold text-title">
              {state.title}
            </Text>
            {state.message ? (
              <Text className="mt-2 text-center text-body text-muted-foreground">
                {state.message}
              </Text>
            ) : null}

            {/* Actions stack full width; Cancel always sits last so the safe choice is at the thumb. */}
            <View className="mt-6 w-full gap-2">
              {[...state.buttons]
                .sort((a, b) => Number(a.style === 'cancel') - Number(b.style === 'cancel'))
                .map((b) => {
                  const [bg, fg] = BUTTON[b.style ?? 'default'];
                  return (
                    <Pressable
                      key={b.text}
                      onPress={() => press(b)}
                      accessibilityRole="button"
                      className={cn(
                        'h-12 items-center justify-center rounded-field active:opacity-80',
                        bg
                      )}>
                      <Text className={cn('font-sans-semibold text-button', fg)}>{b.text}</Text>
                    </Pressable>
                  );
                })}
            </View>
          </Pressable>
        ) : null}
      </Pressable>
    </Modal>
  );
}
