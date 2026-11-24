import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

// Small pill: marigold for returns and layers, muted for state like "Let go".
export function Chip({
  label,
  tone = 'muted',
  className,
}: {
  label: string;
  tone?: 'muted' | 'marigold';
  className?: string;
}) {
  return (
    <View
      className={cn(
        'self-start rounded-full px-2.5 py-0.5',
        tone === 'marigold' ? 'bg-marigold-tint' : 'border border-border bg-card',
        className
      )}>
      <Text
        className={cn(
          'font-sans-medium text-caption',
          tone === 'marigold' ? 'text-amber' : 'text-muted-foreground'
        )}>
        {label}
      </Text>
    </View>
  );
}
