/**
 * Modal de confirmación centrado (ej. "¿Salir sin guardar?") — estilo "glass".
 * Badge "!", título Space Grotesk, cuerpo Manrope y dos acciones:
 * confirmar (rojo suave) + cancelar (degradado, acción principal = quedarse).
 * Controlado por `visible`. Reutilizable para cualquier confirmación.
 */
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';
import { AppButton } from './AppButton';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  body: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const RED = '#ff3b52';

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
          <View style={styles.badge}>
            <Txt style={styles.badgeText}>!</Txt>
          </View>
          <Txt style={styles.title}>{title}</Txt>
          <Txt style={styles.body}>{body}</Txt>
          <View style={styles.actions}>
            <AppButton
              label={cancelLabel}
              variant="secondary"
              onPress={onCancel}
              fullWidth={false}
              style={styles.actionBtn}
            />
            <AppButton
              label={confirmLabel}
              onPress={onConfirm}
              fullWidth={false}
              style={styles.actionBtn}
            />
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
    alignItems: 'center',
    backgroundColor: 'rgba(20,15,17,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 26,
    paddingTop: 26,
    paddingBottom: 22,
    paddingHorizontal: 22,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 24 },
    elevation: 12,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,59,82,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,59,82,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.glassTitle, fontSize: 28, color: RED },
  title: {
    fontFamily: fonts.glassTitle,
    fontSize: 20,
    letterSpacing: -0.3,
    color: '#f6f6f8',
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13.5,
    lineHeight: 20,
    color: theme.colors.textOnGlassDim,
    textAlign: 'center',
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: theme.spacing.xs, width: '100%' },
  actionBtn: { flex: 1, height: 50 },
});
