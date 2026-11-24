import { Logo } from '@/components/logo';
import { Screen } from '@/components/screen';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { dropCrumb, getCrumb, getSetting, markBack, refreshPending, setSetting, useFocusData } from '@/lib/crumbs';
import { ago } from '@/lib/format';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import * as Haptics from 'expo-haptics';
import { Redirect, useRouter } from 'expo-router';
import { type SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { LockIcon, SlidersHorizontalIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';

async function load(db: SQLiteDatabase) {
  const [onboarded, draft, asked, count, pendingId] = await Promise.all([
    getSetting(db, 'onboarded'),
    getSetting(db, 'draft'),
    getSetting(db, 'schedule_asked'),
    db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM crumbs'),
    refreshPending(db),
  ]);
  const pending = pendingId ? await getCrumb(db, pendingId) : null;
  return { onboarded: !!onboarded, draft: draft ?? '', asked: !!asked, count: count?.n ?? 0, pending };
}

export default function CaptureScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [tick, setTick] = useState(0);
  const data = useFocusData(load, [tick]);
  const [text, setText] = useState('');
  const seeded = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (data && !seeded.current) {
      seeded.current = true;
      setText(data.draft);
    }
  }, [data]);

  if (!data) return <Screen />;
  if (!data.onboarded) return <Redirect href="/onboarding" />;

  const empty = text.trim().length === 0;

  const onChange = (value: string) => {
    setText(value);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSetting(db, 'draft', value.trim() ? value : null), 300);
  };

  const drop = async () => {
    if (empty) return;
    clearTimeout(saveTimer.current);
    await dropCrumb(db, text);
    await setSetting(db, 'draft', null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setText('');
    if (data.count === 0 && !data.asked) {
      await setSetting(db, 'schedule_asked', '1');
      router.push({ pathname: '/schedule', params: { first: '1' } });
    }
    setTick((t) => t + 1);
  };

  const open = async () => {
    if (!data.pending) return;
    await markBack(db, data.pending.id);
    router.push({ pathname: '/rediscover/[id]', params: { id: data.pending.id } });
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <View className="h-14 flex-row items-center justify-between px-gutter">
          <Logo />
          <View className="flex-row items-center gap-1">
            <Pressable
              onPress={() => router.push('/jar')}
              accessibilityRole="button"
              accessibilityLabel={data.count === 0 ? 'Open your jar, empty' : `Open your jar, ${data.count} crumbs`}
              className="h-9 flex-row items-center gap-1.5 rounded-full border border-border bg-card px-3">
              <Icon as={LockIcon} size={13} className="text-muted-foreground" />
              <Text className="font-sans-medium text-caption">
                {data.count === 0 ? 'Empty jar' : `${data.count} ${data.count === 1 ? 'crumb' : 'crumbs'}`}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/settings')}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              className="size-touch items-center justify-center">
              <Icon as={SlidersHorizontalIcon} size={22} />
            </Pressable>
          </View>
        </View>

        {data.pending ? (
          <View className="mx-gutter mt-2 flex-row items-center gap-3 rounded-card border border-marigold-edge bg-marigold-tint p-3">
            <View className="size-8 items-center justify-center" accessible={false}>
              <View className="size-4 rounded-full bg-marigold" />
              <View className="absolute bottom-0 right-0 size-2.5 rounded-full bg-marigold" />
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-label">A crumb is back</Text>
              <Text className="text-caption text-amber">
                From {ago(data.pending.last_back_at ?? data.pending.created_at)}
              </Text>
            </View>
            <Pressable
              onPress={open}
              accessibilityRole="button"
              className="h-9 justify-center rounded-full bg-primary px-4">
              <Text className="font-sans-semibold text-meta text-primary-foreground">Open</Text>
            </Pressable>
          </View>
        ) : (
          <Text className="px-gutter pt-2 text-meta text-muted-foreground">No titles, no folders. Just drop it.</Text>
        )}

        <TextInput
          value={text}
          onChangeText={onChange}
          autoFocus
          multiline
          textAlignVertical="top"
          placeholder="A half-idea..."
          placeholderTextColor={THEME[colorScheme ?? 'light'].mutedForeground}
          accessibilityLabel="Capture field"
          className="flex-1 px-gutter pt-5 font-serif text-crumb text-foreground"
        />

        <View className="min-h-16 flex-row items-center justify-between bg-card px-gutter py-2.5">
          <Text className="text-caption text-muted-foreground">{empty ? 'Stays on this phone' : 'Draft saved'}</Text>
          <Pressable
            onPress={drop}
            disabled={empty}
            accessibilityRole="button"
            accessibilityState={{ disabled: empty }}
            className={cn('h-11 min-w-20 items-center justify-center rounded-field px-5', empty ? 'bg-secondary' : 'bg-primary')}>
            <Text className={cn('font-sans-semibold text-button', empty ? 'text-muted-foreground' : 'text-primary-foreground')}>
              Drop
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
