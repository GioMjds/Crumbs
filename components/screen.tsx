import { cn } from '@/lib/utils';
import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Full-height page with safe-area padding; sheets pass `sheet` to skip the top inset.
export function Screen({ className, sheet, style, ...props }: ViewProps & { sheet?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={cn('flex-1', sheet ? 'bg-card' : 'bg-background', className)}
      style={[{ paddingTop: sheet ? 0 : insets.top, paddingBottom: insets.bottom }, style]}
      {...props}
    />
  );
}
