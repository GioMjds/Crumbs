import { JarScene } from '@/components/jar-scene';
import { Logo } from '@/components/logo';
import { Screen } from '@/components/screen';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { setSetting } from '@/lib/crumbs';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { LockIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

const STEPS = [
  ['Drop it.', 'No titles, no folders.'],
  ['Forget it.', 'The jar keeps it safe.'],
  ['Meet it again.', 'Keep it, add to it, or let it go.'],
] as const;

export default function OnboardingScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState<number>(STEPS.length);

  // Plays the story once (1, 2, 3, back to 1) and stops, so motion never loops unattended.
  useEffect(() => {
    if (!auto) return;
    const id = setTimeout(() => {
      setStep((s) => (s + 1) % STEPS.length);
      setAuto((n) => n - 1);
    }, 3500);
    return () => clearTimeout(id);
  }, [auto]);

  const pick = (i: number) => {
    setAuto(0);
    setStep(i);
  };

  const start = async () => {
    await setSetting(db, 'onboarded', '1');
    router.replace('/');
  };

  return (
    <Screen>
      <View className="h-14 justify-center px-gutter">
        <Logo />
      </View>

      <View className="flex-1 items-center justify-center gap-3">
        <View className="items-center justify-center">
          <View className="absolute size-60 rounded-full bg-muted/60" />
          <JarScene step={step} onPress={() => pick(0)} />
        </View>
        <Text className="text-caption text-muted-foreground">Tap the jar to drop a crumb.</Text>
      </View>

      <View className="gap-5 px-gutter pb-6">
        <Text role="heading" aria-level="1" className="font-sans-bold text-hero">
          Drop any thought. Once a week, one comes back.
        </Text>

        <View className="-mx-3 gap-1">
          {STEPS.map(([lead, rest], i) => {
            const on = i === step;
            return (
              <Pressable
                key={lead}
                onPress={() => pick(i)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                className={cn(
                  'min-h-touch flex-row items-center gap-3 rounded-field px-3 py-2.5 active:opacity-90',
                  on && 'bg-card'
                )}>
                <View
                  className={cn(
                    'size-6 items-center justify-center rounded-full',
                    on ? 'bg-marigold' : 'bg-muted'
                  )}>
                  <Text
                    className={cn(
                      'font-sans-bold text-caption',
                      on ? 'text-marigold-foreground' : 'text-muted-foreground'
                    )}>
                    {i + 1}
                  </Text>
                </View>
                <Text className={cn('flex-1 font-sans text-body', !on && 'text-muted-foreground')}>
                  <Text
                    className={cn('font-sans-semibold text-body', !on && 'text-muted-foreground')}>
                    {lead}
                  </Text>{' '}
                  {rest}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="flex-row items-center gap-2">
          <Icon as={LockIcon} size={14} className="text-muted-foreground" />
          <Text className="text-caption text-muted-foreground">
            Your crumbs stay on this phone.
          </Text>
        </View>

        <Pressable
          onPress={start}
          accessibilityRole="button"
          className="h-cta items-center justify-center rounded-field bg-primary active:opacity-90">
          <Text className="font-sans-semibold text-button text-primary-foreground">
            Drop your first crumb
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
