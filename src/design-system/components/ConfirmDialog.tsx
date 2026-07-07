/**
 * Modal de confirmación genérico con acento configurable.
 * Más flexible que ConfirmModal: acepta ícono custom, gradiente y
 * color del texto del CTA para cubrir variantes amber, verde, etc.
 *
 * Usar cuando el modal necesita un color de acento distinto al rojo.
 * Para confirmaciones de peligro (rojo), usar ConfirmModal.
 */
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

export interface ConfirmDialogProps {
  visible: boolean;
  /** Nodo React que se renderiza dentro del cuadrado de ícono. */
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  title: string;
  body: string;
  cancelLabel?: string;
  confirmLabel: string;
  /** Gradiente vertical del botón principal [top, bottom]. */
  confirmGradient: readonly [string, string];
  /** Color del shadow del botón principal. */
  confirmShadowColor?: string;
  /** true cuando el fondo del botón es claro y el texto debe ser oscuro. */
  confirmTextDark?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  visible,
  icon,
  iconBg,
  iconBorder,
  title,
  body,
  cancelLabel = 'Cancelar',
  confirmLabel,
  confirmGradient,
  confirmShadowColor = 'rgba(0,0,0,0.3)',
  confirmTextDark = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const ctaTextColor = confirmTextDark ? '#1a1405' : '#ffffff';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <Pressable style={s.scrim} onPress={onCancel}>
        <Pressable style={s.dialog} onPress={() => {}}>
          {/* Ícono */}
          <View style={[s.iconBox, { backgroundColor: iconBg, borderColor: iconBorder }]}>
            {icon}
          </View>

          {/* Textos */}
          <Txt style={s.title}>{title}</Txt>
          <Txt style={s.body}>{body}</Txt>

          {/* Acciones */}
          <View style={s.actions}>
            <Pressable
              style={({ pressed }) => [s.cancelBtn, pressed && { opacity: 0.8 }]}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}>
              <Txt style={s.cancelLabel}>{cancelLabel}</Txt>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                s.confirmBtn,
                { shadowColor: confirmShadowColor },
                pressed && { opacity: 0.85 },
              ]}
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}>
              <Svg style={StyleSheet.absoluteFill} width={200} height={49}>
                <Defs>
                  <LinearGradient id="dialogGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={confirmGradient[0]} />
                    <Stop offset="1" stopColor={confirmGradient[1]} />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="200" height="49" rx="15" fill="url(#dialogGrad)" />
              </Svg>
              <Txt style={[s.confirmLabel, { color: ctaTextColor }]}>{confirmLabel}</Txt>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.66)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    width: 320,
    backgroundColor: 'rgba(20,15,17,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 26,
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 24,
    gap: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowRadius: 25,
    shadowOpacity: 0.7,
    elevation: 20,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.glassTitle,
    fontSize: 19,
    color: '#f6f6f8',
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13.5,
    lineHeight: 19,
    color: 'rgba(246,246,248,0.55)',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    paddingTop: 6,
  },
  cancelBtn: {
    flex: 1,
    height: 49,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 14,
    color: '#ffffff',
  },
  confirmBtn: {
    flex: 1,
    height: 49,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    shadowOpacity: 1,
    elevation: 8,
  },
  confirmLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 14,
  },
});
