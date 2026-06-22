/**
 * Modal de confirmación centrado (ej. "¿Salir sin guardar?").
 * Scrim + tarjeta con título, cuerpo y dos botones (cancelar / confirmar).
 * Controlado por `visible`. Reutilizable para cualquier confirmación.
 */
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { Txt } from './Txt';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  body: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  visible,
  title,
  body,
  cancelLabel = 'Cancelar',
  confirmLabel = 'Confirmar',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.scrim}>
        <View style={styles.card}>
          <Txt variant="h2" style={styles.title}>
            {title}
          </Txt>
          <Txt variant="bodySm" color="textSecondary" style={styles.body}>
            {body}
          </Txt>
          <View style={styles.actions}>
            <Pressable
              style={[styles.btn, styles.cancel]}
              onPress={onCancel}>
              <Txt variant="button" color="textPrimary">
                {cancelLabel}
              </Txt>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.confirm]}
              onPress={onConfirm}>
              <Txt variant="button" color="white">
                {confirmLabel}
              </Txt>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing['2xl'],
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    borderRadius: theme.radius.lg,
    padding: theme.spacing['2xl'],
    gap: theme.spacing.md,
  },
  title: { },
  body: { },
  actions: { flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.sm },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: { backgroundColor: theme.colors.surface2 },
  confirm: { backgroundColor: theme.colors.brandRed },
});
