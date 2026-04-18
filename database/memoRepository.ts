import { getDatabase } from './init';
import { type Memo, type MemoFilter } from './types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function nowISO(): string {
  return new Date().toISOString();
}

export async function getAllMemos(filter?: MemoFilter): Promise<Memo[]> {
  const db = await getDatabase();
  let sql = 'SELECT * FROM memos WHERE 1=1';
  const params: (string | number)[] = [];

  if (filter?.category) {
    sql += ' AND category = ?';
    params.push(filter.category);
  }
  if (filter?.status) {
    sql += ' AND status = ?';
    params.push(filter.status);
  }
  if (filter?.keyword) {
    sql += ' AND (title LIKE ? OR content LIKE ?)';
    params.push(`%${filter.keyword}%`, `%${filter.keyword}%`);
  }
  if (filter?.tag) {
    sql += ' AND tags LIKE ?';
    params.push(`%${filter.tag}%`);
  }

  sql += ' ORDER BY updated_at DESC';

  const rows = await db.getAllAsync<{ [key: string]: any }>(sql, params);
  return rows as Memo[];
}

export async function getMemoById(id: string): Promise<Memo | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ [key: string]: any }>(
    'SELECT * FROM memos WHERE id = ?',
    [id]
  );
  return row ? (row as Memo) : null;
}

export async function createMemo(data: Omit<Memo, 'id' | 'created_at' | 'updated_at'>): Promise<Memo> {
  const db = await getDatabase();
  const id = generateId();
  const now = nowISO();
  const memo: Memo = { ...data, id, created_at: now, updated_at: now };

  await db.runAsync(
    'INSERT INTO memos (id, title, content, category, priority, status, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [memo.id, memo.title, memo.content, memo.category, memo.priority, memo.status, memo.tags, memo.created_at, memo.updated_at]
  );

  return memo;
}

export async function updateMemo(id: string, data: Partial<Omit<Memo, 'id' | 'created_at'>>): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const params: (string | number)[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
  if (data.content !== undefined) { fields.push('content = ?'); params.push(data.content); }
  if (data.category !== undefined) { fields.push('category = ?'); params.push(data.category); }
  if (data.priority !== undefined) { fields.push('priority = ?'); params.push(data.priority); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }
  if (data.tags !== undefined) { fields.push('tags = ?'); params.push(data.tags); }

  fields.push('updated_at = ?');
  params.push(nowISO());
  params.push(id);

  await db.runAsync(`UPDATE memos SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function deleteMemo(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM memos WHERE id = ?', [id]);
}

export async function getMemoCount(): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM memos');
  return row?.count ?? 0;
}

export async function getAllTags(): Promise<string[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ tags: string }>('SELECT tags FROM memos WHERE tags != ""');
  const tagSet = new Set<string>();
  rows.forEach(row => {
    row.tags.split(',').forEach(tag => {
      const trimmed = tag.trim();
      if (trimmed) tagSet.add(trimmed);
    });
  });
  return Array.from(tagSet).sort();
}
