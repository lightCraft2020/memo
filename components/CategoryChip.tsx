import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CATEGORY_LABELS, CATEGORY_COLORS, type Category } from '../constants/theme';

interface CategoryChipProps {
  category: Category | 'all';
  selected: boolean;
  onPress: (category: Category | 'all') => void;
}

const ALL_COLOR = '#6200EE';

export default function CategoryChip({ category, selected, onPress }: CategoryChipProps) {
  const isAll = category === 'all';
  const color = isAll ? ALL_COLOR : CATEGORY_COLORS[category as Category];
  const label = isAll ? '全部' : CATEGORY_LABELS[category as Category];

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: selected ? color : color + '15',
          borderColor: color,
        },
      ]}
      onPress={() => onPress(category)}
    >
      <Text style={[styles.text, { color: selected ? '#FFF' : color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});
