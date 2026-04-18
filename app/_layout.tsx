import React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useMemoStore } from '../stores/memoStore';
import { THEME_LIGHT, THEME_DARK } from '../constants/theme';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: THEME_LIGHT.primary,
    primaryContainer: THEME_LIGHT.primaryLight,
    surface: THEME_LIGHT.surface,
    background: THEME_LIGHT.background,
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: THEME_DARK.primary,
    primaryContainer: THEME_DARK.primaryDark,
    surface: THEME_DARK.surface,
    background: THEME_DARK.background,
  },
};

export default function RootLayout() {
  const isDarkMode = useMemoStore((s) => s.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Memo', headerShown: false }} />
        <Stack.Screen name="create" options={{ title: '新建记录', presentation: 'modal' }} />
        <Stack.Screen name="edit/[id]" options={{ title: '编辑记录', presentation: 'modal' }} />
        <Stack.Screen name="search" options={{ title: '搜索' }} />
        <Stack.Screen name="export" options={{ title: '导出' }} />
        <Stack.Screen name="settings" options={{ title: '设置' }} />
      </Stack>
    </PaperProvider>
  );
}
