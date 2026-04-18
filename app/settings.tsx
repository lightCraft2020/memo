import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, useTheme, Divider, Text } from 'react-native-paper';
import { useMemoStore } from '../stores/memoStore';

export default function SettingsScreen() {
  const theme = useTheme();
  const isDarkMode = useMemoStore((s) => s.isDarkMode);
  const setDarkMode = useMemoStore((s) => s.setDarkMode);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>外观</List.Subheader>
        <List.Item
          title="深色模式"
          description={isDarkMode ? '已开启' : '已关闭'}
          left={(props) => <List.Icon {...props} icon="weather-night" />}
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={setDarkMode}
              color={theme.colors.primary}
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>数据</List.Subheader>
        <List.Item
          title="数据存储"
          description="所有数据保存在本地设备"
          left={(props) => <List.Icon {...props} icon="database" />}
        />
        <List.Item
          title="导出功能"
          description="支持 TXT 和 Markdown 格式导出"
          left={(props) => <List.Icon {...props} icon="file-export-outline" />}
        />
      </List.Section>

      <Divider />

      <View style={styles.about}>
        <Text style={styles.aboutTitle}>Memo v1.0.0</Text>
        <Text style={styles.aboutDesc}>一款简洁的想法与计划记录工具</Text>
        <Text style={styles.aboutDesc}>数据完全本地存储，保护你的隐私</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  about: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 8,
  },
  aboutDesc: {
    fontSize: 13,
    color: '#9E9E9E',
    marginBottom: 4,
  },
});
