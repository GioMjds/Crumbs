import { Screen } from '@/components/screen';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { addLayer, getCrumb, setStatus, useFocusData } from '@/lib/crumbs';
import { ago, full } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { ShareIcon, XIcon } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Share, TextInput, View } from 'react-native';

// The returned crumb: choose Add a thought, Keep, or Let go.
export default function RediscoverSheet() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const crumb = useFocusData((d) => getCrumb(d, Number(id)), [id]);
  const [adding, setAdding] = useState(false);
  const [thought, setThought] = useState('');

  if (!crumb) return <Screen sheet={Platform.OS === 'ios'} className="bg-card" />;

  const settle = async (status: 'kept' | 'let_go') => {
    await setStatus(db, crumb.id, status);
    router.back();
  };

  const submit = async () => {
    if (!thought.trim()) return;
    await addLayer(db, crumb.id, thought);
    router.back();
  };

  return (
    <Screen sheet={Platform.OS === 'ios'} className="bg-card">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 px-gutter pb-5 pt-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="size-3 rounded-full bg-marigold" />
            <Text className="font-sans-medium text-label text-amber">From {ago(crumb.created_at)}</Text>
          </View>
          <View className="flex-row items-center">
            {adding ? null : (
              <Pressable
                onPress={() => Share.share({ message: crumb.body })}
                accessibilityRole="button"
                accessibilityLabel="Share crumb"
                className="size-touch items-center justify-center">
                <Icon as={ShareIcon} size={20} />
              </Pressable>
            )}
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Close"
              className="size-touch items-center justify-center">
              <Icon as={XIcon} size={22} />
            </Pressable>
          </View>
        </View>

        {adding ? (
          <>
            <Text className="mt-2 font-serif-medium text-crumb-md">{crumb.body}</Text>
            <Text className="mt-1 text-caption text-muted-foreground">{full(crumb.created_at)}</Text>
            <View className="mt-8 flex-row items-center justify-between">
              <Text className="font-sans-semibold text-label">Your thought today</Text>
              <Text className="text-caption text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
            <TextInput
              value={thought}
              onChangeText={setThought}
              autoFocus
              multiline
              textAlignVertical="top"
              accessibilityLabel="Add a thought"
              className="mt-2 min-h-36 rounded-card bg-secondary p-4 font-serif text-crumb-sm text-foreground"
            />
            <View className="mt-5 flex-row items-center gap-3">
              <Pressable onPress={() => setAdding(false)} accessibilityRole="button" className="h-cta items-center justify-center px-5">
                <Text className="font-sans-medium text-label">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={submit}
                disabled={!thought.trim()}
                accessibilityRole="button"
                className={cn('h-cta flex-1 items-center justify-center rounded-field bg-primary', !thought.trim() && 'opacity-50')}>
                <Text className="font-sans-semibold text-button text-primary-foreground">Add to this crumb</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text className="mt-1 text-caption text-muted-foreground">You dropped this on {full(crumb.created_at)}.</Text>
            <View className="flex-1 justify-center">
              <Text role="heading" aria-level="1" className="font-serif-medium text-crumb-lg">
                {crumb.body}
              </Text>
            </View>
            <Text className="mb-2 text-caption text-muted-foreground">What should happen to it?</Text>
            <Pressable
              onPress={() => setAdding(true)}
              accessibilityRole="button"
              className="h-cta items-center justify-center rounded-field bg-primary active:opacity-90">
              <Text className="font-sans-semibold text-button text-primary-foreground">Add a thought</Text>
            </Pressable>
            <View className="mt-3 flex-row gap-3">
              <Pressable
                onPress={() => settle('kept')}
                accessibilityRole="button"
                className="h-cta flex-1 items-center justify-center rounded-field border border-foreground">
                <Text className="font-sans-semibold text-button">Keep</Text>
              </Pressable>
              <Pressable
                onPress={() => settle('let_go')}
                accessibilityRole="button"
                className="h-cta flex-1 items-center justify-center rounded-field bg-secondary">
                <Text className="font-sans-semibold text-button">Let go</Text>
              </Pressable>
            </View>
            <Text className="mt-3 text-center text-caption text-muted-foreground">
              Kept crumbs can come back after 90 days. Let go ones never do.
            </Text>
          </>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}
