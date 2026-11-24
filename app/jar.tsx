import { Chip } from '@/components/chip';
import { Header } from '@/components/header';
import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { DAY, type Crumb, listCrumbs, markBack, pullOne, useFocusData } from '@/lib/crumbs';
import { plural, shortDate, when } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

type Row = { key: string; kind: 'heading'; title: string; hint?: string; toggle?: boolean } | { key: string; kind: 'crumb'; crumb: Crumb; recent: boolean };

export default function JarScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const crumbs = useFocusData(listCrumbs);
  const [hidden, setHidden] = useState(false);

  if (!crumbs) return <Screen />;

  const cutoff = Date.now() - 7 * DAY;
  const recent = crumbs.filter((c) => c.created_at >= cutoff);
  const resting = crumbs.filter((c) => c.created_at < cutoff);

  const rows: Row[] = [];
  if (recent.length) {
    rows.push({ key: 'h-week', kind: 'heading', title: 'This week' });
    recent.forEach((c) => rows.push({ key: `c${c.id}`, kind: 'crumb', crumb: c, recent: true }));
  }
  if (resting.length) {
    rows.push({
      key: 'h-rest',
      kind: 'heading',
      title: 'Resting',
      toggle: true,
      hint: `${plural(resting.length, 'older crumb')}. One may come back each week.`,
    });
    if (!hidden) resting.forEach((c) => rows.push({ key: `c${c.id}`, kind: 'crumb', crumb: c, recent: false }));
  }

  const pull = async () => {
    const id = await pullOne(db);
    if (id === null) return;
    await markBack(db, id);
    router.push({ pathname: '/rediscover/[id]', params: { id } });
  };

  return (
    <Screen>
      <Header title="Your jar" right={<Text className="text-meta text-muted-foreground">{plural(crumbs.length, 'crumb')}</Text>} />
      <FlatList
        data={rows}
        keyExtractor={(r) => r.key}
        contentContainerClassName="px-gutter pb-8"
        ListHeaderComponent={
          <View className="mb-4 mt-2 flex-row items-center gap-3 rounded-card bg-card p-3 pl-4">
            <Text className="flex-1 text-body">Stuck? Pull a crumb out of the jar.</Text>
            <Pressable
              onPress={pull}
              disabled={crumbs.every((c) => c.status === 'let_go')}
              accessibilityRole="button"
              className="h-10 justify-center rounded-full bg-primary px-4 disabled:opacity-50">
              <Text className="font-sans-semibold text-meta text-primary-foreground">Pull one</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <Text className="mt-8 text-center font-serif text-crumb-sm text-muted-foreground">
            The jar is empty. Drop a thought and it will rest here.
          </Text>
        }
        renderItem={({ item }) =>
          item.kind === 'heading' ? (
            <View className="mt-5">
              <View className="flex-row items-center justify-between">
                <Text role="heading" aria-level="2" className="font-sans-semibold text-label">
                  {item.title}
                </Text>
                {item.toggle ? (
                  <Pressable onPress={() => setHidden((h) => !h)} accessibilityRole="button" hitSlop={8}>
                    <Text className="font-sans-medium text-meta text-muted-foreground">{hidden ? 'Show' : 'Hide'}</Text>
                  </Pressable>
                ) : null}
              </View>
              {item.hint ? <Text className="mt-1 text-caption text-muted-foreground">{item.hint}</Text> : null}
            </View>
          ) : (
            <Pressable
              onPress={() => router.push({ pathname: '/crumb/[id]', params: { id: item.crumb.id } })}
              accessibilityRole="button"
              className="mt-3 gap-1 border-b border-border pb-3">
              <Text
                numberOfLines={2}
                className={cn('font-serif text-crumb-sm', item.crumb.status === 'let_go' && 'text-muted-foreground')}>
                {item.crumb.body}
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-caption text-muted-foreground">
                  {item.recent ? when(item.crumb.created_at) : shortDate(item.crumb.created_at)}
                </Text>
                {item.crumb.layer_count > 0 ? (
                  <Chip tone="marigold" label={plural(item.crumb.layer_count, 'layer')} />
                ) : null}
                {item.crumb.status === 'let_go' ? <Chip label="Let go" /> : null}
              </View>
            </Pressable>
          )
        }
      />
    </Screen>
  );
}
