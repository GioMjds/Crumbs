import { DAY, getSchedule, setSetting } from '@/lib/crumbs';
import * as Notifications from 'expo-notifications';
import type { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

// Android locks a channel's sound at creation, so the custom sound needs a fresh channel id.
const CHANNEL = 'crumb_return';
const SOUND = 'crumb_return.wav';
const CONTENT = { title: 'Crumbs', body: 'A crumb may be ready to come back.', sound: SOUND };
const HOUR = 3_600_000;
const SURPRISE_DAYS = 60;
// About one reminder every two days across the window; stays under the iOS cap of 64 pending.
const SURPRISE_COUNT = 30;

// Shows the banner even when the app is open, so the dev test notification is visible.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
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

  if (Platform.OS === 'android') {
    await Notifications.deleteNotificationChannelAsync('weekly');
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Weekly crumb',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: SOUND,
    });
  }

  // Nothing to bring back yet, so stay silent until the first crumb is dropped.
  const jar = await db.getFirstAsync<{ n: number }>(
    "SELECT COUNT(*) AS n FROM crumbs WHERE status != 'let_go'"
  );
  if (!jar?.n) return true;

  if (s.mode === 'fixed') {
    await Notifications.scheduleNotificationAsync({
      content: CONTENT,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        channelId: CHANNEL,
        weekday: s.day + 1,
        hour: s.hour,
        minute: 0,
      },
    });
    return true;
  }

  // Surprise: one-shot reminders at random moments, any hour; re-rolled on every app open.
  const now = Date.now();
  await Promise.all(
    Array.from({ length: SURPRISE_COUNT }, () =>
      Notifications.scheduleNotificationAsync({
        content: CONTENT,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          channelId: CHANNEL,
          date: now + HOUR + Math.random() * SURPRISE_DAYS * DAY,
        },
      })
    )
  );

  return true;
}
