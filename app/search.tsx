import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Searchbar, SegmentedButtons, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { getAllMemos } from '../database/memoRepository';
import { type Memo, type MemoFilter } from '../database/types';
import MemoCard from '../components/MemoCard';
import EmptyState from '../components/EmptyState';
import { useMemoStore } from '../stores/memoStore';
import { CATEGORY, STATUS, type Category, type Status } from '../constants/theme';

export default function SearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const toggleStatus = useMemoStore((s) => s.toggleStatus);
  const removeMemo = useMemoStore((s) => s.removeMemo);
  const loadMemos = useMemoStore((s) => s.loadMemos);

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [status, setStatus] = useState<Status | ''>('');
  const [results, setResults] = useState<Memo[]>([]);
  const [searching, setSearching] = useState(false);

  const doSearch = useCallback(async () => {
    setSearching(true);
    try {
      const filter: MemoFilter = {};
      if (keyword.trim()) filter.keyword = keyword.trim();
      if (category) filter.category = category;
      if (status) filter.status = status;
      const memos = await getAllMemos(filter);
      setResults(memos);
    } finally {
      setSearching(false);
    }
  }, [keyword, category, status]);

  useEffect(() => {
    doSearch();
  }, [category, status]);

  const handleSubmitSearch = () => {
    doSearch();
  };

  const handleDelete = useCallback((id: string) => {
    Alert.alert('删除确认', '确定要删除这条记录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: async () => { await removeMemo(id); doSearch(); } },
    ]);
  }, [removeMemo, doSearch]);

  const handleToggleStatus = useCallback(async (id: string) => {
    await toggleStatus(id);
    doSearch();
  }, [toggleStatus, doSearch]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchBar}>
        <Searchbar
          placeholder="搜索标题或内容..."
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSubmitSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filterSection}>
        <SegmentedButtons
          value={category}
          onValueChange={(val) => setCategory(val as Category | '')}
          buttons={[
            { value: '', label: '全部' },
            { value: CATEGORY.IDEA, label: '想法' },
            { value: CATEGORY.PLAN, label: '计划' },
            { value: CATEGORY.TODO, label: '待办' },
            { value: CATEGORY.NOTE, label: '笔记' },
          ]}
          style={styles.segment}
        />
      </View>

      <View style={styles.filterSection}>
        <SegmentedButtons
          value={status}
          onValueChange={(val) => setStatus(val as Status | '')}
          buttons={[
            { value: '', label: '全部' },
            { value: STATUS.ACTIVE, label: '进行中' },
            { value: STATUS.COMPLETED, label: '已完成' },
            { value: STATUS.ARCHIVED, label: '已归档' },
          ]}
          style={styles.segment}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemoCard
            memo={item}
            onPress={(id) => router.push(`/edit/${id}`)}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={results.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="没有找到记录"
            subtitle="试试调整搜索条件"
          />
        }
        refreshing={searching}
        onRefresh={doSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchInput: {
    elevation: 0,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  segment: {
    marginBottom: 2,
  },
  list: {
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
});
