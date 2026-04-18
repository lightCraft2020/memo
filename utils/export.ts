import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { type Memo } from '../database/types';
import { CATEGORY_LABELS, PRIORITY_STARS, STATUS_LABELS, type Category, type Priority, type Status } from '../constants/theme';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function exportToTxt(memos: Memo[]): string {
  const now = formatDate(new Date().toISOString());
  const lines: string[] = [
    '='.repeat(40),
    'Memo 导出记录',
    `导出时间: ${now}`,
    `共 ${memos.length} 条记录`,
    '='.repeat(40),
    '',
  ];

  memos.forEach((memo, index) => {
    const catLabel = CATEGORY_LABELS[memo.category as Category] || memo.category;
    const statusLabel = STATUS_LABELS[memo.status as Status] || memo.status;
    const priorityStars = PRIORITY_STARS[memo.priority as Priority] || '';

    lines.push(`【${catLabel}】${memo.title}`);
    lines.push(`优先级: ${priorityStars}`);
    lines.push(`状态: ${statusLabel}`);
    if (memo.tags) lines.push(`标签: ${memo.tags}`);
    lines.push(`创建时间: ${formatDate(memo.created_at)}`);
    lines.push('---');
    lines.push(memo.content);
    lines.push('');
    if (index < memos.length - 1) {
      lines.push('-'.repeat(40));
      lines.push('');
    }
  });

  return lines.join('\n');
}

export function exportToMarkdown(memos: Memo[]): string {
  const now = formatDate(new Date().toISOString());
  const lines: string[] = [
    '# Memo 导出记录',
    `> 导出时间: ${now} | 共 ${memos.length} 条记录`,
    '',
    '---',
    '',
  ];

  const categoryEmoji: Record<string, string> = {
    idea: '💡',
    plan: '📋',
    todo: '✅',
    note: '📝',
  };

  memos.forEach((memo) => {
    const catLabel = CATEGORY_LABELS[memo.category as Category] || memo.category;
    const emoji = categoryEmoji[memo.category] || '📄';
    const statusLabel = STATUS_LABELS[memo.status as Status] || memo.status;
    const priorityStars = PRIORITY_STARS[memo.priority as Priority] || '';

    lines.push(`## ${emoji} ${memo.title}`);
    lines.push(`- **分类**: ${catLabel}`);
    lines.push(`- **优先级**: ${priorityStars}`);
    lines.push(`- **状态**: ${statusLabel}`);
    if (memo.tags) lines.push(`- **标签**: ${memo.tags}`);
    lines.push(`- **创建时间**: ${formatDate(memo.created_at)}`);
    lines.push('');
    lines.push(memo.content);
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  return lines.join('\n');
}

export async function shareExport(content: string, filename: string): Promise<void> {
  const filePath = `${FileSystem.cacheDirectory}${filename}`;
  await FileSystem.writeAsStringAsync(filePath, content, { encoding: FileSystem.EncodingType.UTF8 });
  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(filePath, {
      mimeType: filename.endsWith('.md') ? 'text/markdown' : 'text/plain',
      dialogTitle: '导出 Memo 记录',
    });
  }
}
