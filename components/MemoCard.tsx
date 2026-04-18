import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { type Memo } from '../database/types';
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS, STATUS, STATUS_LABELS, PRIORITY_STARS, type Category, type Status, type Priority } from '../constants/theme';

interface MemoCardProps {
  memo: Memo;
  onPress: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function MemoCard({ memo, onPress, onToggleStatus, onDelete }: MemoCardProps) {
  const categoryColor = CATEGORY_COLORS[memo.category as Category] || '#999';
  const categoryLabel = CATEGORY_LABELS[memo.category as Category] || memo.category;
  const statusLabel = STATUS_LABELS[memo.status as Status] || memo.status;
  const isCompleted = memo.status === STATUS.COMPLETED;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(memo.id)} activeOpacity={0.7}>
      <View style={[styles.categoryBar, { backgroundColor: categoryColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>{categoryLabel}</Text>
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ 已完成</Text>
            </View>
          )}
        </View>

        <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={1}>
          {memo.title || '无标题'}
        </Text>

        {memo.content ? (
          <Text style={[styles.body, isCompleted && styles.bodyCompleted]} numberOfLines={2}>
            {memo.content}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.priority}>{PRIORITY_STARS[memo.priority as Priority] || ''}</Text>
            {memo.tags ? (
              <Text style={styles.tags} numberOfLines={1}>🏷 {memo.tags}</Text>
            ) : null}
          </View>
          <Text style={styles.date}>
            {new Date(memo.updated_at).toLocaleDateString('zh-CN')}
          </Text>
        </View>

        <View style={styles.actions}>
          <IconButton
            icon={isCompleted ? 'undo' : 'check-circle-outline'}
            size={20}
            iconColor={isCompleted ? '#FF9800' : '#4CAF50'}
            onPress={() => onToggleStatus(memo.id)}
          />
          <IconButton
            icon="delete-outline"
            size={20}
            iconColor="#E53935"
            onPress={() => onDelete(memo.id)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  categoryBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  completedBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
  },
  completedText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  body: {
    fontSize: 13,
    color: '#616161',
    lineHeight: 18,
    marginBottom: 8,
  },
  bodyCompleted: {
    color: '#BDBDBD',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priority: {
    fontSize: 11,
    marginRight: 8,
  },
  tags: {
    fontSize: 11,
    color: '#9E9E9E',
    flex: 1,
  },
  date: {
    fontSize: 11,
    color: '#BDBDBD',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    marginHorizontal: -8,
    marginVertical: -8,
  },
});
