import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { DAY, getSchedule, setSetting, useFocusData } from '@/lib/crumbs';
import { DAYS, dayLabel, hourLabel } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { type SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

type Mode = 'surprise' | 'fixed';

type Options = {
  mode: Mode;
  title: string;
  hint: string;
};

const OPTIONS = [
  { mode: 'surprise', title: 'Surprise me', hint: 'Any day, between 9 AM and 8 PM' },
  { mode: 'fixed', title: 'Same time every week', hint: 'Choose a day and time' },
] satisfies Options[];

async function load(db: SQLiteDatabase) {
  const first = await db.getFirstAsync<{ t: number | null }>(
    'SELECT MIN(created_at) AS t FROM crumbs'
  );
  return { schedule: await getSchedule(db), firstAt: first?.t ?? null };
}

export default function ScheduleSheet() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { first } = useLocalSearchParams<{ first?: string }>();
  const data = useFocusData(load);
  const [mode, setMode] = useState<Mode | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [hour, setHour] = useState<number | null>(null);

  if (!data) return <Screen sheet />;
  const m = mode ?? data.schedule.mode;
  const d = day ?? data.schedule.day;
  const h = hour ?? data.schedule.hour;

  const save = async () => {
    await Promise.all([
      setSetting(db, 'mode', m),
      setSetting(db, 'day', String(d)),
      setSetting(db, 'hour', String(h)),
      setSetting(db, 'notify', '1'),
    ]);
    router.back();
  };

  return (
    <Screen sheet className="px-gutter pb-5 pt-6">
      {first ? (
        <View className="mb-2 flex-row items-center gap-1.5">
          <View className="bg-marigold size-2 rounded-full" />
          <Text className="font-sans-medium text-caption text-amber">First crumb dropped</Text>
        </View>
      ) : null}
      <Text role="heading" aria-level="1" className="font-sans-bold text-sheet">
        When should crumbs come back?
      </Text>
      <Text className="text-body mt-2 text-muted-foreground">
        One a week, never more.
        {data.firstAt ? ` Your first can come back after ${dayLabel(data.firstAt + 7 * DAY)}.` : ''}
      </Text>

      <View className="mt-5 gap-3" role="radiogroup">
        {OPTIONS.map((o) => {
          const on = m === o.mode;
          return (
            <Pressable
              key={o.mode}
              onPress={() => setMode(o.mode)}
              role="radio"
              aria-checked={on}
              className={cn(
                'rounded-card flex-row items-center gap-3 border p-4',
                on ? 'border-2 border-foreground bg-card' : 'border-border'
              )}>
              <View
                className={cn(
                  'size-6 items-center justify-center rounded-full border-2',
                  on ? 'border-foreground' : 'border-border'
                )}>
                {on ? <View className="size-3 rounded-full bg-foreground" /> : null}
              </View>
              <View className="flex-1">
                <Text className="font-sans-semibold text-label">{o.title}</Text>
                <Text className="text-meta text-muted-foreground">{o.hint}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {m === 'fixed' ? (
        <View className="mt-4 gap-3">
          <View className="flex-row justify-between">
            {DAYS.map((label, i) => (
              <Pressable
                key={label}
                onPress={() => setDay(i)}
                role="radio"
                aria-checked={d === i}
                aria-label={label}
                className={cn(
                  'size-10 items-center justify-center rounded-full',
                  d === i ? 'bg-primary' : 'bg-secondary'
                )}>
                <Text
                  className={cn(
                    'font-sans-medium text-caption',
                    d === i ? 'text-primary-foreground' : 'text-foreground'
                  )}>
                  {label.slice(0, 2)}
                </Text>
              </Pressable>
            ))}
          </View>
          <View className="rounded-field flex-row items-center justify-between bg-secondary px-4">
            <Pressable
              onPress={() => setHour((h + 23) % 24)}
              aria-label="Earlier"
              className="size-touch items-center justify-center">
              <Text className="font-sans-semibold text-title">-</Text>
            </Pressable>
            <Text className="font-sans-semibold text-label" aria-live="polite">
              {hourLabel(h)}
            </Text>
            <Pressable
              onPress={() => setHour((h + 1) % 24)}
              aria-label="Later"
              className="size-touch items-center justify-center">
              <Text className="font-sans-semibold text-title">+</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <Pressable
        onPress={save}
        accessibilityRole="button"
        className="h-cta rounded-field mt-6 items-center justify-center bg-primary active:opacity-90">
        <Text className="font-sans-semibold text-button text-primary-foreground">
          Turn on weekly crumb
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        className="min-h-touch items-center justify-center">
        <Text className="font-sans-medium text-label">Not now</Text>
      </Pressable>
      <Text className="text-caption text-center text-muted-foreground">
        You can change this anytime in Settings.
      </Text>
    </Screen>
  );
}
