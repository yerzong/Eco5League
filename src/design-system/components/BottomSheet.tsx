/**
 * Hoja inferior (bottom sheet) reutilizable para modales.
 * Scrim oscuro (tap para cerrar) + panel anclado abajo con asa, título y ✕.
 * Pensado para usarse en una ruta con presentation: 'transparentModal'.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/design-system/theme';
import { IconX } from '@/design-system/icons';
import { Txt } from './Txt';

interface BottomSheetProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ title, subtitle, onClose, children }: BottomSheetProps) {
  return (
    <View style={styles.fill}>
      <Pressable style={styles.scrim} onPress={onClose} />
      <View style={styles.anchor}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <SafeAreaView edges={['bottom']}>
            <View style={styles.headerRow}>
              <View style={styles.titleRow}>
                <View style={styles.bar} />
                <Txt variant="h2">{title}</Txt>
              </View>
              <Pressable onPress={onClose} hitSlop={12}>
                <IconX size={20} color={theme.colors.textSecondary} strokeWidth={2} />
              </Pressable>
            </View>
            {subtitle ? (
              <Txt variant="bodySm" color="textSecondary" style={styles.subtitle}>
                {subtitle}
              </Txt>
            ) : null}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  anchor: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: theme.colors.surface1,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.md,
    maxHeight: '88%',
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 99,
    backgroundColor: theme.colors.borderStrong,
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  bar: { width: 4, height: 20, backgroundColor: theme.colors.brandRed },
  subtitle: { marginTop: theme.spacing.sm },
});
