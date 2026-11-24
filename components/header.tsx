import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ChevronLeftIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type Props = { title?: string; back?: string; right?: ReactNode };

// Back chevron (with optional label), optional centered-left title, right slot for count or actions.
export function Header({ title, back, right }: Props) {
  const router = useRouter();
  return (
    <View className="px-gutter h-14 flex-row items-center justify-between">
      <View className="flex-row items-center gap-1">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={back ? `Back to ${back}` : 'Back'}
          hitSlop={8}
          className="min-h-touch -ml-2 flex-row items-center gap-1 pr-2">
          <Icon as={ChevronLeftIcon} size={22} />
          {back ? <Text className="font-sans-medium text-label">{back}</Text> : null}
        </Pressable>
        {title ? (
          <Text role="heading" aria-level="1" className="font-sans-semibold text-title">
            {title}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}
