/**
 * Diálogo de confirmación de acción destructiva (centrado): ícono de alerta,
 * título, sujeto (ej. nombre del evento), descripción y botones Cancelar /
 * acción peligrosa. Genérico/reutilizable (eliminar evento, remover equipo…).
 */
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface DangerConfirmProps {
  visible: boolean;
  title: string;
  /** Sujeto resaltado (ej. "Copa ECO5 · Temporada 1"). */
  subject?: string;
  body: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DangerConfirm({
  visible,
  title,
  subject,
  body,
  confirmLabel = 'Eliminar',
  onCancel,
  onConfirm,
}: DangerConfirmProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.scrim} onPress={onCancel} />
      <View style={styles.center} pointerEvents="box-none">
        <View style={styles.card}>
          <View style={styles.icon}>
            <Txt style={styles.iconText}>!</Txt>
          </View>
          <Txt style={styles.title}>{title}</Txt>
          {subject ? <Txt style={styles.subject}>{subject}</Txt> : null}
          <Txt style={styles.body}>{body}</Txt>
          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onCancel}>
              <Txt style={styles.cancelLabel}>Cancelar</Txt>
            </Pressable>
            <Pressable style={styles.confirmBtn} onPress={onConfirm}>
              <Txt style={styles.confirmLabel}>{confirmLabel}</Txt>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing['2xl'] },
  card: {
    width: 330,
    maxWidth: '100%',
    alignItems: 'center',
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: 20,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: theme.spacing.md,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 99,
    backgroundColor: theme.colors.brandRed + '24',
    borderWidth: 1.5,
    borderColor: theme.colors.brandRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontFamily: fonts.headingBold, fontSize: 28, color: theme.colors.brandRed },
  title: { fontFamily: fonts.headingBold, fontSize: 20, letterSpacing: 0.2, color: theme.colors.textPrimary },
  subject: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center' },
  body: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 19, color: theme.colors.textTertiary, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, width: '100%', marginTop: theme.spacing.sm },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#1a1d23',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.textPrimary },
  confirmBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: theme.colors.brandRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLabel: { fontFamily: fonts.headingBold, fontSize: 13, letterSpacing: 0.26, color: theme.colors.white },
});
