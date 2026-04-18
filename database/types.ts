import { CATEGORY, STATUS, PRIORITY, type Category, type Status, type Priority } from '../constants/theme';

export interface Memo {
  id: string;
  title: string;
  content: string;
  category: Category;
  priority: Priority;
  status: Status;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface MemoFilter {
  category?: Category;
  status?: Status;
  keyword?: string;
  tag?: string;
}
