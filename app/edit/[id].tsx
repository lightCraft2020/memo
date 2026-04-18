import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { TextInput, Button, SegmentedButtons, useTheme, HelperText } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMemoStore } from '../../stores/memoStore';
import { getMemoById } from '../../database/memoRepository';
import { CATEGORY, PRIORITY, STATUS, type Category, type Priority, type Status } from '../../constants/theme';
import type { Memo } from '../../database/types';

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const editMemo = useMemoStore((s) => s.editMemo);

  const [memo, setMemo] = useState<Memo | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORY.IDEA);
  const [priority, setPriority] = useState<Priority>(PRIORITY.MEDIUM);
  const [status, setStatus] = useState<Status>(STATUS.ACTIVE);
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getMemoById(id).then((m) => {
        if (m) {
          setMemo(m);
          setTitle(m.title);
          setContent(m.content);
          setCategory(m.category as Category);
          setPriority(m.priority as Priority);
          setStatus(m.status as Status);
          setTags(m.tags);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await editMemo(id, {
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        status,
        tags: tags.trim(),
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!memo) {
    return (
      <View style={styles.loading}>
        <Button onPress={() => router.back()}>记录不存在，返回</Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <SegmentedButtons
            value={category}
            onValueChange={(val) => setCategory(val as Category)}
            buttons={[
              { value: CATEGORY.IDEA, label: '💡 想法' },
              { value: CATEGORY.PLAN, label: '📋 计划' },
              { value: CATEGORY.TODO, label: '✅ 待办' },
              { value: CATEGORY.NOTE, label: '📝 笔记' },
            ]}
            style={styles.segment}
          />
        </View>

        <View style={styles.section}>
          <SegmentedButtons
            value={status}
            onValueChange={(val) => setStatus(val as Status)}
            buttons={[
              { value: STATUS.ACTIVE, label: '进行中' },
              { value: STATUS.COMPLETED, label: '已完成' },
              { value: STATUS.ARCHIVED, label: '已归档' },
            ]}
            style={styles.segment}
          />
          <HelperText type="info" visible>状态</HelperText>
        </View>

        <View style={styles.section}>
          <TextInput
            label="标题"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            maxLength={100}
          />
        </View>

        <View style={styles.section}>
          <TextInput
            label="内容"
            value={content}
            onChangeText={setContent}
            mode="outlined"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <SegmentedButtons
            value={priority.toString()}
            onValueChange={(val) => setPriority(Number(val) as Priority)}
            buttons={[
              { value: PRIORITY.LOW.toString(), label: '低' },
              { value: PRIORITY.MEDIUM.toString(), label: '中' },
              { value: PRIORITY.HIGH.toString(), label: '高' },
            ]}
            style={styles.segment}
          />
          <HelperText type="info" visible>优先级</HelperText>
        </View>

        <View style={styles.section}>
          <TextInput
            label="标签"
            value={tags}
            onChangeText={setTags}
            mode="outlined"
            placeholder="用逗号分隔多个标签"
            maxLength={200}
          />
        </View>

        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
          >
            取消
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
          >
            保存
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  segment: {
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
