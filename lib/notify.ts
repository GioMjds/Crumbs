import { getSchedule, setSetting } from '@/lib/crumbs';
import * as Notifications from 'expo-notifications';
import type { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

const CHANNEL = 'weekly';
const CONTENT = { title: 'Crumbs', body: 'A crumb may be ready to come back.' };

// Shows the banner even when the app is open, so the dev test notification is visible.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Replaces any scheduled reminder with one matching saved settings; returns false and turns notify off if permission is denied.
export async function syncNotification(db: SQLiteDatabase) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const s = await getSchedule(db);
  if (!s.notify) return true;

  const { granted } = await Notifications.requestPermissionsAsync();
  if (!granted) {
    await setSetting(db, 'notify', '0');
    return false;
  }

  if (Platform.OS === 'android')
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Weekly crumb',
      importance: Notifications.AndroidImportance.DEFAULT,
    });

  // shortcut: surprise picks one random slot that then repeats weekly; re-roll on app open if it should vary.
  const surprise = s.mode === 'surprise';
  await Notifications.scheduleNotificationAsync({
    content: CONTENT,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      channelId: CHANNEL,
      weekday: (surprise ? Math.floor(Math.random() * 7) : s.day) + 1,
      hour: surprise ? 9 + Math.floor(Math.random() * 12) : s.hour,
      minute: 0,
    },
  });

  return true;
}
