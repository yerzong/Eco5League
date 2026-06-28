/**
 * Barra de controles del rediseño glass: pill de orden (criterio + dirección)
 * + botón de filtros (con badge de nº activos). Reutilizable en listas SA.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import {
  IconArrowsSort,
  IconChevronDown,
  IconAdjustmentsHorizontal,
} from '@/design-system/icons';
import { Txt } from './Txt';

interface GlassToolbarProps {
  sortLabel: string;
  sortValue: string;
  onSort?: () => void;
  filtersCount?: number;
  onFilters?: () => void;
}

export function GlassToolbar({
  sortLabel,
  sortValue,
  onSort,
  filtersCount = 0,
  onFilters,
}: GlassToolbarProps) {
  return (
    <View style={styles.row}>
      <Pressable style={styles.pill} onPress={onSort}>
        <IconArrowsSort size={18} color="#f6f6f8" strokeWidth={2} />
        <Txt style={styles.sortLabel}>{sortLabel}</Txt>
        <Txt style={styles.sortValue}>{sortValue}</Txt>
        <IconChevronDown size={14} color="rgba(246,246,248,0.5)" strokeWidth={2} />
      </Pressable>
      <Pressable style={styles.filters} onPress={onFilters}>
        <IconAdjustmentsHorizontal size={18} color="#f6f6f8" strokeWidth={2} />
        <Txt style={styles.filtersText}>Filtros</Txt>
        {filtersCount > 0 ? (
          <View style={styles.badge}>
            <Txt style={styles.badgeText}>{filtersCount}</Txt>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  sortLabel: { fontFamily: fonts.glassBodySemibold, fontSize: 13.5, color: '#f6f6f8' },
  sortValue: { fontFamily: fonts.glassBodyMedium, fontSize: 13.5, color: 'rgba(246,246,248,0.5)' },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  filtersText: { fontFamily: fonts.glassBodySemibold, fontSize: 14, color: '#f6f6f8' },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: theme.colors.redBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.glassBodyBold, fontSize: 10, color: theme.colors.white },
});
