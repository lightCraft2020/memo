export const CATEGORY = {
  IDEA: 'idea',
  PLAN: 'plan',
  TODO: 'todo',
  NOTE: 'note',
} as const;

export type Category = (typeof CATEGORY)[keyof typeof CATEGORY];

export const CATEGORY_LABELS: Record<Category, string> = {
  idea: '想法',
  plan: '计划',
  todo: '待办',
  note: '笔记',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  idea: 'lightbulb-outline',
  plan: 'calendar-outline',
  todo: 'checkbox-marked-circle-outline',
  note: 'notebook-outline',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  idea: '#FF9800',
  plan: '#2196F3',
  todo: '#4CAF50',
  note: '#9C27B0',
};

export const STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

export const STATUS_LABELS: Record<Status, string> = {
  active: '进行中',
  completed: '已完成',
  archived: '已归档',
};

export const PRIORITY = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;

export type Priority = 1 | 2 | 3;

export const PRIORITY_LABELS: Record<Priority, string> = {
  1: '低',
  2: '中',
  3: '高',
};

export const PRIORITY_STARS: Record<Priority, string> = {
  1: '⭐',
  2: '⭐⭐',
  3: '⭐⭐⭐',
};

export const THEME_LIGHT = {
  primary: '#6200EE',
  primaryDark: '#3700B3',
  primaryLight: '#B794F6',
  accent: '#03DAC6',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  error: '#B00020',
};

export const THEME_DARK = {
  primary: '#BB86FC',
  primaryDark: '#985EFF',
  primaryLight: '#D1C4E9',
  accent: '#03DAC6',
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  text: '#E0E0E0',
  textSecondary: '#9E9E9E',
  border: '#424242',
  error: '#CF6679',
};
