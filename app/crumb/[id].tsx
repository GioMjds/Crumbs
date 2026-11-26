import { Alert } from '@/components/alert';
import { Header } from '@/components/header';
import { Screen } from '@/components/screen';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DAY, REST_DAYS, deleteCrumb, getCrumb, getLayers, useFocusData } from '@/lib/crumbs';
import { ago, full, shortDate, when } from '@/lib/format';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { ShareIcon, Trash2Icon } from 'lucide-react-native';
import { Pressable, ScrollView, Share, View } from 'react-native';

export default function CrumbScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useFocusData(
    async (d) => ({ crumb: await getCrumb(d, Number(id)), layers: await getLayers(d, Number(id)) }),
    [id]
  );

  if (!data) return <Screen />;
  const { crumb, layers } = data;
  if (!crumb)
    return (
      <Screen>
        <Header back="Jar" />
        <View className="px-gutter pt-6">
          <Text role="heading" aria-level="1" className="font-sans-semibold text-title">
            This crumb is no longer in the jar
          </Text>
          <Text className="mt-2 text-body text-muted-foreground">
            It may have been deleted. Go back to the jar to see your other crumbs.
          </Text>
        </View>
      </Screen>
    );

  const restUntil = (crumb.last_back_at ?? crumb.created_at) + REST_DAYS * DAY;
  const returned =
    crumb.came_back_count === 0
      ? crumb.status === 'let_go'
        ? 'Never came back.'
        : 'Has not come back yet.'
      : `Came back ${crumb.came_back_count === 1 ? 'once' : `${crumb.came_back_count} times, most recently`} ${ago(
          crumb.last_back_at ?? crumb.created_at
        )}.`;

  const remove = () =>
    Alert.alert(
      'Delete this crumb?',
      `The crumb${layers.length ? ' and its added thoughts are' : ' is'} removed from this phone. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCrumb(db, crumb.id);
            router.back();
          },
        },
      ]
    );

  return (
    <Screen>
      <Header
        back="Jar"
        right={
          <View className="flex-row items-center">
            <Pressable
              onPress={() => Share.share({ message: crumb.body })}
              accessibilityRole="button"
              accessibilityLabel="Share crumb"
              className="size-touch items-center justify-center">
              <Icon as={ShareIcon} size={20} />
            </Pressable>
            <Pressable
              onPress={remove}
              accessibilityRole="button"
              accessibilityLabel="Delete crumb"
              className="size-touch items-center justify-center">
              <Icon as={Trash2Icon} size={20} className="text-destructive" />
            </Pressable>
          </View>
        }
      />
      <ScrollView contentContainerClassName="px-gutter pb-6 pt-2">
        {crumb.status !== 'let_go' ? (
          <View className="self-start rounded-full border border-border bg-card px-3 py-1">
            <Text className="font-sans-medium text-caption text-muted-foreground">
              {restUntil > Date.now()
                ? `Resting until ${shortDate(restUntil)}`
                : 'Ready to come back'}
            </Text>
          </View>
        ) : (
          <View className="self-start rounded-full border border-border bg-card px-3 py-1">
            <Text className="font-sans-medium text-caption text-muted-foreground">Let go</Text>
          </View>
        )}

        <Text role="heading" aria-level="1" className="mt-4 font-serif-medium text-crumb-lg">
          {crumb.body}
        </Text>
        <Text className="mt-2 text-caption text-muted-foreground">
          Dropped {full(crumb.created_at)}
        </Text>

        {layers.length ? (
          <View className="mt-8">
            <Text role="heading" aria-level="2" className="font-sans-semibold text-label">
              Added thoughts
            </Text>
            {layers.map((l) => (
              <View key={l.id} className="mt-4">
                <View className="flex-row items-center gap-2">
                  <View className="size-2 rounded-full bg-marigold" />
                  <Text className="text-caption text-muted-foreground">{when(l.created_at)}</Text>
                </View>
                <Text className="mt-1 pl-4 font-serif text-crumb-md">{l.body}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Text className="mt-6 text-meta text-muted-foreground">{returned}</Text>
      </ScrollView>

      {crumb.status !== 'let_go' ? (
        <View className="mx-gutter mb-3 rounded-card bg-card p-4">
          <Text className="text-caption text-muted-foreground">
            You can add a thought to this crumb when it comes back.
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}
