import { Logo } from '@/components/logo';
import { Screen } from '@/components/screen';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { setSetting } from '@/lib/crumbs';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import LottieView from 'lottie-react-native';
import { LockIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

const STEPS = [
  ['Drop it.', 'No titles, no folders.'],
  ['Forget it.', 'The jar keeps it safe.'],
  ['Meet it again.', 'Keep it, add to it, or let it go.'],
] as const;

export default function OnboardingScreen() {
  const db = useSQLiteContext();
  const router = useRouter();

  const start = async () => {
    await setSetting(db, 'onboarded', '1');
    router.replace('/');
  };

  return (
    <Screen>
      <View className="h-14 justify-center px-gutter">
        <Logo />
      </View>

      <View className="flex-1 items-center justify-center" accessible accessibilityLabel="A jar holding crumbs">
        <LottieView
          source={require('@/assets/lottiefiles/jar.json')}
          autoPlay
          loop={false}
          style={{ width: 200, height: 220 }}
        />
      </View>

      <View className="gap-5 px-gutter pb-6">
        <Text role="heading" aria-level="1" className="font-sans-bold text-hero">
          Drop any thought. Once a week, one comes back.
        </Text>

        <View className="gap-3">
          {STEPS.map(([lead, rest], i) => (
            <View key={lead} className="flex-row items-start gap-3">
              <View className="mt-0.5 size-6 items-center justify-center rounded-full bg-marigold">
                <Text className="font-sans-bold text-caption text-marigold-foreground">{i + 1}</Text>
              </View>
              <Text className="flex-1 font-sans text-body">
                <Text className="font-sans-semibold text-body">{lead}</Text> {rest}
              </Text>
            </View>
          ))}
        </View>

        <View className="flex-row items-center gap-2">
          <Icon as={LockIcon} size={14} className="text-muted-foreground" />
          <Text className="text-caption text-muted-foreground">Your crumbs stay on this phone.</Text>
        </View>

        <Pressable
          onPress={start}
          accessibilityRole="button"
          className="h-cta items-center justify-center rounded-field bg-primary active:opacity-90">
          <Text className="font-sans-semibold text-button text-primary-foreground">Drop your first crumb</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
