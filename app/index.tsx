import React, { useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Appbar, FAB, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMemoStore } from '../stores/memoStore';
import MemoCard from '../components/MemoCard';
import CategoryChip from '../components/CategoryChip';
import EmptyState from '../components/EmptyState';
import { CATEGORY, type Category } from '../constants/theme';

const CATEGORIES: Category[] = [CATEGORY.IDEA, CATEGORY.PLAN, CATEGORY.TODO, CATEGORY.NOTE];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { memos, filter, loading, loadMemos, setFilter, clearFilter, removeMemo, toggleStatus } = useMemoStore();

  useEffect(() => {
    loadMemos();
  }, []);

  const handleCategoryPress = useCallback((category: Category) => {
    if (filter.category === category) {
      clearFilter();
    } else {
      setFilter({ ...filter, category });
    }
  }, [filter, setFilter, clearFilter]);

  const handleMemoPress = useCallback((id: string) => {
    router.push(`/edit/${id}`);
  }, [router]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('删除确认', '确定要删除这条记录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => removeMemo(id) },
    ]);
  }, [removeMemo]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Content title="Memo" titleStyle={{ color: '#FFF', fontWeight: '700', fontSize: 22 }} />
        <Appbar.Action icon="magnify" color="#FFF" onPress={() => router.push('/search')} />
        <Appbar.Action icon="export-variant" color="#FFF" onPress={() => router.push('/export')} />
        <Appbar.Action icon="cog-outline" color="#FFF" onPress={() => router.push('/settings')} />
      </Appbar.Header>

      <View style={styles.filterRow}>
        <CategoryChip
          category={CATEGORY.IDEA}
          selected={filter.category === CATEGORY.IDEA}
          onPress={handleCategoryPress}
        />
        <CategoryChip
          category={CATEGORY.PLAN}
          selected={filter.category === CATEGORY.PLAN}
          onPress={handleCategoryPress}
        />
        <CategoryChip
          category={CATEGORY.TODO}
          selected={filter.category === CATEGORY.TODO}
          onPress={handleCategoryPress}
        />
        <CategoryChip
          category={CATEGORY.NOTE}
          selected={filter.category === CATEGORY.NOTE}
          onPress={handleCategoryPress}
        />
      </View>

      <FlatList
        data={memos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemoCard
            memo={item}
            onPress={handleMemoPress}
            onToggleStatus={toggleStatus}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={memos.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title="还没有记录"
            subtitle="点击右下角按钮开始记录你的想法和计划"
          />
        }
        refreshing={loading}
        onRefresh={loadMemos}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#FFF"
        onPress={() => router.push('/create')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  list: {
    paddingBottom: 80,
  },
  emptyList: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    elevation: 4,
  },
});
