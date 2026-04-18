import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Card, RadioButton, Text, useTheme, Chip } from 'react-native-paper';
import { getAllMemos, getMemoCount } from '../database/memoRepository';
import { type Memo, type MemoFilter } from '../database/types';
import { exportToTxt, exportToMarkdown, shareExport } from '../utils/export';
import { CATEGORY, STATUS, type Category, type Status } from '../constants/theme';

type ExportFormat = 'txt' | 'md';

export default function ExportScreen() {
  const theme = useTheme();
  const [format, setFormat] = useState<ExportFormat>('md');
  const [filterCategory, setFilterCategory] = useState<Category | ''>('');
  const [filterStatus, setFilterStatus] = useState<Status | ''>('');
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    getMemoCount().then(setTotalCount);
    updateFilteredCount();
  }, [filterCategory, filterStatus]);

  const updateFilteredCount = async () => {
    const filter: MemoFilter = {};
    if (filterCategory) filter.category = filterCategory;
    if (filterStatus) filter.status = filterStatus;
    const memos = await getAllMemos(filter);
    setFilteredCount(memos.length);
  };

  const handleExport = async () => {
    if (filteredCount === 0) {
      Alert.alert('提示', '没有可导出的记录');
      return;
    }
    setExporting(true);
    try {
      const filter: MemoFilter = {};
      if (filterCategory) filter.category = filterCategory;
      if (filterStatus) filter.status = filterStatus;
      const memos = await getAllMemos(filter);

      const content = format === 'md' ? exportToMarkdown(memos) : exportToTxt(memos);
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `memo_export_${timestamp}.${format}`;

      await shareExport(content, filename);
    } catch (e) {
      Alert.alert('导出失败', '请检查权限设置后重试');
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title title="导出格式" />
        <Card.Content>
          <RadioButton.Group value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
            <View style={styles.radioRow}>
              <RadioButton value="md" />
              <Text style={styles.radioLabel}>Markdown (.md)</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="txt" />
              <Text style={styles.radioLabel}>纯文本 (.txt)</Text>
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="筛选范围" />
        <Card.Content>
          <Text style={styles.filterLabel}>分类</Text>
          <View style={styles.chipRow}>
            <Chip
              selected={filterCategory === ''}
              onPress={() => setFilterCategory('')}
              style={styles.chip}
            >
              全部
            </Chip>
            <Chip
              selected={filterCategory === CATEGORY.IDEA}
              onPress={() => setFilterCategory(CATEGORY.IDEA)}
              style={styles.chip}
            >
              💡 想法
            </Chip>
            <Chip
              selected={filterCategory === CATEGORY.PLAN}
              onPress={() => setFilterCategory(CATEGORY.PLAN)}
              style={styles.chip}
            >
              📋 计划
            </Chip>
            <Chip
              selected={filterCategory === CATEGORY.TODO}
              onPress={() => setFilterCategory(CATEGORY.TODO)}
              style={styles.chip}
            >
              ✅ 待办
            </Chip>
            <Chip
              selected={filterCategory === CATEGORY.NOTE}
              onPress={() => setFilterCategory(CATEGORY.NOTE)}
              style={styles.chip}
            >
              📝 笔记
            </Chip>
          </View>

          <Text style={[styles.filterLabel, { marginTop: 12 }]}>状态</Text>
          <View style={styles.chipRow}>
            <Chip
              selected={filterStatus === ''}
              onPress={() => setFilterStatus('')}
              style={styles.chip}
            >
              全部
            </Chip>
            <Chip
              selected={filterStatus === STATUS.ACTIVE}
              onPress={() => setFilterStatus(STATUS.ACTIVE)}
              style={styles.chip}
            >
              进行中
            </Chip>
            <Chip
              selected={filterStatus === STATUS.COMPLETED}
              onPress={() => setFilterStatus(STATUS.COMPLETED)}
              style={styles.chip}
            >
              已完成
            </Chip>
            <Chip
              selected={filterStatus === STATUS.ARCHIVED}
              onPress={() => setFilterStatus(STATUS.ARCHIVED)}
              style={styles.chip}
            >
              已归档
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.countText}>
            共 {totalCount} 条记录，筛选后 {filteredCount} 条
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleExport}
        loading={exporting}
        disabled={exporting || filteredCount === 0}
        style={[styles.exportButton, { backgroundColor: theme.colors.primary }]}
        labelStyle={styles.exportButtonLabel}
        icon="share-variant"
      >
        导出并分享
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioLabel: {
    fontSize: 15,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    marginBottom: 4,
  },
  countText: {
    fontSize: 15,
    color: '#616161',
    textAlign: 'center',
  },
  exportButton: {
    marginTop: 8,
    marginBottom: 32,
    paddingVertical: 6,
  },
  exportButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
