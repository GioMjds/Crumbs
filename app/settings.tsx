import { Header } from '@/components/header';
import { Screen } from '@/components/screen';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { deleteAll, getSchedule, getStats, setSetting, useFocusData } from '@/lib/crumbs';
import { scheduleLabel } from '@/lib/format';
import { THEME } from '@/lib/theme';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { ChevronRightIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, View } from 'react-native';

export default function SettingsScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const t = THEME[colorScheme ?? 'light'];
  const [tick, setTick] = useState(0);
  const data = useFocusData(
    async (d) => ({ schedule: await getSchedule(d), stats: await getStats(d) }),
    [tick]
  );

  if (!data) return <Screen />;
  const { schedule, stats } = data;

  const toggle = async (on: boolean) => {
    await setSetting(db, 'notify', on ? '1' : '0');
    setTick((n) => n + 1);
  };

  const wipe = () =>
    Alert.alert(
      'Delete everything?',
      `This removes all ${stats.dropped} crumbs from this phone. It cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete everything',
          style: 'destructive',
          onPress: async () => {
            await deleteAll(db);
            router.replace('/onboarding');
          },
        },
      ]
    );

  const rows = [
    ['Dropped', stats.dropped],
    ['Came back', stats.back],
    ['Kept or added to', stats.kept],
    ['Let go', stats.let_go],
  ] satisfies [string, number][];

  return (
    <Screen>
      <Header title="Settings" />
      <ScrollView contentContainerClassName="px-gutter pb-8">
        <Text role="heading" aria-level="2" className="font-sans-semibold text-label mb-2 mt-2">
          Weekly crumb
        </Text>
        <View className="rounded-card overflow-hidden bg-card">
          <Pressable
            onPress={() => router.push('/schedule')}
            accessibilityRole="button"
            className="min-h-touch flex-row items-center justify-between border-b border-border p-4">
            <View className="flex-1">
              <Text className="font-sans-medium text-label">When it comes back</Text>
              <Text className="text-meta text-muted-foreground">{scheduleLabel(schedule)}</Text>
            </View>
            <Icon as={ChevronRightIcon} size={20} className="text-muted-foreground" />
          </Pressable>
          <View className="min-h-touch flex-row items-center justify-between p-4">
            <View className="flex-1">
              <Text className="font-sans-medium text-label">Notifications</Text>
              <Text className="text-meta text-muted-foreground">
                {schedule.notify ? 'On, one a week at most' : 'Off'}
              </Text>
            </View>
            <Switch
              value={schedule.notify}
              onValueChange={toggle}
              accessibilityLabel="Notifications"
              trackColor={{ true: t.primary, false: t.border }}
              thumbColor={t.card}
            />
          </View>
        </View>

        <Text role="heading" aria-level="2" className="font-sans-semibold text-label mb-2 mt-6">
          Your jar so far
        </Text>
        <View className="rounded-card overflow-hidden bg-card">
          {rows.map(([label, n], i) => (
            <View
              key={label}
              className={`flex-row items-center justify-between p-4 ${i < rows.length - 1 ? 'border-b border-border' : ''}`}>
              <Text className="text-label">{label}</Text>
              <Text className="font-sans-semibold text-label">{n}</Text>
            </View>
          ))}
        </View>
        <Text className="text-caption mt-2 text-muted-foreground">
          Counted on this phone, so you can judge Crumbs while you test it yourself.
        </Text>

        <Text role="heading" aria-level="2" className="font-sans-semibold text-label mb-2 mt-6">
          Privacy
        </Text>
        <Text className="text-body">
          Your crumbs stay on this phone. There's no account, and nothing is uploaded.
        </Text>
        <Pressable
          onPress={wipe}
          accessibilityRole="button"
          className="h-cta rounded-field mt-4 items-center justify-center border border-destructive active:opacity-80">
          <Text className="font-sans-semibold text-button text-destructive">Delete everything</Text>
        </Pressable>
        <Text className="text-caption mt-2 text-muted-foreground">
          Removes all {stats.dropped} crumbs from this phone. This can't be undone.
        </Text>
      </ScrollView>
    </Screen>
  );
}
