import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, SegmentedButtons, useTheme, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMemoStore } from '../stores/memoStore';
import { CATEGORY, PRIORITY, type Category, type Priority } from '../constants/theme';

export default function CreateScreen() {
  const router = useRouter();
  const theme = useTheme();
  const addMemo = useMemoStore((s) => s.addMemo);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORY.IDEA);
  const [priority, setPriority] = useState<Priority>(PRIORITY.MEDIUM);
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);
    try {
      await addMemo({
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        tags: tags.trim(),
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

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
          <TextInput
            label="标题"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            placeholder="给这条记录起个标题"
            maxLength={100}
          />
        </View>

        <View style={styles.section}>
          <TextInput
            label="内容"
            value={content}
            onChangeText={setContent}
            mode="outlined"
            placeholder="记录你的想法..."
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
            disabled={saving || (!title.trim() && !content.trim())}
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
});
