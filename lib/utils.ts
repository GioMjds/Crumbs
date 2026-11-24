import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge the custom font sizes from tailwind.config.js so they don't evict text colors.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'caption',
            'meta',
            'body',
            'label',
            'button',
            'title',
            'sheet',
            'hero',
            'crumb',
            'crumb-sm',
            'crumb-md',
            'crumb-lg',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
