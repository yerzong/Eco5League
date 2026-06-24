/**
 * Fila de controles de listado: control de orden (izq) + botón Filtros (der).
 * Reutilizable en Eventos, Staff, Equipos, Usuarios.
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SortControl } from './SortControl';
import { FiltersButton } from './FiltersButton';

interface ControlsRowProps {
  sortLabel: string;
  sortValue: string;
  onSort?: () => void;
  filtersCount?: number;
  onFilters?: () => void;
  style?: ViewStyle;
}

export function ControlsRow({
  sortLabel,
  sortValue,
  onSort,
  filtersCount,
  onFilters,
  style,
}: ControlsRowProps) {
  return (
    <View style={[styles.row, style]}>
      <SortControl label={sortLabel} value={sortValue} onPress={onSort} />
      <FiltersButton count={filtersCount} onPress={onFilters} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});
