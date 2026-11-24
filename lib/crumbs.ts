import { useFocusEffect } from 'expo-router';
import { type SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import * as React from 'react';

export type Status = 'active' | 'kept' | 'let_go';
export type Crumb = {
  id: number;
  body: string;
  created_at: number;
  status: Status;
  came_back_count: number;
  last_back_at: number | null;
  layer_count: number;
};
export type Layer = { id: number; body: string; created_at: number };

export const DAY = 86_400_000;
export const REST_DAYS = 90;

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS crumbs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      came_back_count INTEGER NOT NULL DEFAULT 0,
      last_back_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS layers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crumb_id INTEGER NOT NULL REFERENCES crumbs(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  `);
}

export async function getSetting(db: SQLiteDatabase, key: string) {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    key
  );
  return row?.value ?? null;
}

export async function setSetting(db: SQLiteDatabase, key: string, value: string | null) {
  if (value === null) await db.runAsync('DELETE FROM settings WHERE key = ?', key);
  else await db.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', key, value);
}

const CRUMB_SQL = `SELECT c.*, (SELECT COUNT(*) FROM layers l WHERE l.crumb_id = c.id) AS layer_count FROM crumbs c`;

export const listCrumbs = (db: SQLiteDatabase) =>
  db.getAllAsync<Crumb>(`${CRUMB_SQL} ORDER BY c.created_at DESC`);

export const getCrumb = (db: SQLiteDatabase, id: number) =>
  db.getFirstAsync<Crumb>(`${CRUMB_SQL} WHERE c.id = ?`, id);

export const getLayers = (db: SQLiteDatabase, id: number) =>
  db.getAllAsync<Layer>(
    'SELECT id, body, created_at FROM layers WHERE crumb_id = ? ORDER BY created_at',
    id
  );

export async function dropCrumb(db: SQLiteDatabase, body: string) {
  await db.runAsync('INSERT INTO crumbs (body, created_at) VALUES (?, ?)', body.trim(), Date.now());
}

export async function addLayer(db: SQLiteDatabase, id: number, body: string) {
  await db.runAsync(
    'INSERT INTO layers (crumb_id, body, created_at) VALUES (?, ?, ?)',
    id,
    body.trim(),
    Date.now()
  );
  await db.runAsync("UPDATE crumbs SET status = 'kept' WHERE id = ? AND status = 'active'", id);
}

export const setStatus = (db: SQLiteDatabase, id: number, status: Status) =>
  db.runAsync('UPDATE crumbs SET status = ? WHERE id = ?', status, id);

export async function markBack(db: SQLiteDatabase, id: number) {
  await db.runAsync(
    'UPDATE crumbs SET came_back_count = came_back_count + 1, last_back_at = ? WHERE id = ?',
    Date.now(),
    id
  );
  await setSetting(db, 'pending', null);
}

export const deleteCrumb = (db: SQLiteDatabase, id: number) =>
  db.runAsync('DELETE FROM crumbs WHERE id = ?', id);

export async function deleteAll(db: SQLiteDatabase) {
  await db.execAsync('DELETE FROM layers; DELETE FROM crumbs; DELETE FROM settings;');
}

export async function pullOne(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM crumbs WHERE status != 'let_go' ORDER BY RANDOM() LIMIT 1"
  );
  return row?.id ?? null;
}

// Sets the pending crumb when notifications are on, a week has passed since the last return, and one has rested 90 days.
export async function refreshPending(db: SQLiteDatabase) {
  const [pending, notify] = await Promise.all([
    getSetting(db, 'pending'),
    getSetting(db, 'notify'),
  ]);
  if (pending || notify !== '1') return pending ? Number(pending) : null;
  const now = Date.now();
  const row = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM crumbs WHERE status != 'let_go' AND COALESCE(last_back_at, created_at) <= ?1
     AND NOT EXISTS (SELECT 1 FROM crumbs WHERE last_back_at > ?2) ORDER BY RANDOM() LIMIT 1`,
    now - REST_DAYS * DAY,
    now - 7 * DAY
  );
  if (row) await setSetting(db, 'pending', String(row.id));
  return row?.id ?? null;
}

export async function getStats(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{
    dropped: number;
    back: number;
    kept: number;
    let_go: number;
  }>(
    `SELECT COUNT(*) AS dropped,
      COALESCE(SUM(came_back_count), 0) AS back,
      COALESCE(SUM(status = 'kept' OR EXISTS (SELECT 1 FROM layers l WHERE l.crumb_id = crumbs.id)), 0) AS kept,
      COALESCE(SUM(status = 'let_go'), 0) AS let_go FROM crumbs`
  );
  return row ?? { dropped: 0, back: 0, kept: 0, let_go: 0 };
}

// Runs the loader on every focus so screens reload after returning from a modal.
export function useFocusData<T>(
  load: (db: SQLiteDatabase) => Promise<T>,
  deps: React.DependencyList = []
) {
  const db = useSQLiteContext();
  const [data, setData] = React.useState<T | null>(null);
  useFocusEffect(
    React.useCallback(() => {
      let live = true;
      load(db).then((d) => live && setData(d));
      return () => {
        live = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db, ...deps])
  );
  return data;
}

export async function getSchedule(db: SQLiteDatabase) {
  const [mode, day, hour, notify] = await Promise.all(
    ['mode', 'day', 'hour', 'notify'].map((k) => getSetting(db, k))
  );
  return {
    mode: (mode === 'fixed' ? 'fixed' : 'surprise') as 'surprise' | 'fixed',
    day: Number(day ?? 2),
    hour: Number(hour ?? 9),
    notify: notify === '1',
  };
}
