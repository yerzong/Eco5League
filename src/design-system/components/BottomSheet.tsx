/**
 * Hoja inferior (bottom sheet) con animación de entrada/salida (abajo→arriba)
 * y gesto de deslizar hacia abajo para cerrar.
 * Scrim oscuro (tap para cerrar) + panel anclado abajo con asa, título y ✕.
 */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/design-system/theme';
import { IconX } from '@/design-system/icons';
import { Txt } from './Txt';

const DRAG_CLOSE_THRESHOLD = 120;

interface BottomSheetProps {
  title: string;
  subtitle?: string;
  /** Se llama DESPUÉS de la animación de salida. */
  onClose: () => void;
  children: React.ReactNode;
}

export interface BottomSheetHandle {
  /** Cierra con animación (desliza hacia abajo). */
  close: () => void;
}

export const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>(
  function BottomSheet({ title, subtitle, onClose, children }, ref) {
  const { height: SCREEN_H } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(SCREEN_H)).current;
  const scrim = useRef(new Animated.Value(0)).current;

  // Entrada: desliza hacia arriba + aparece el scrim.
  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 2 }),
      Animated.timing(scrim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [translateY, scrim]);

  // Salida: desliza hacia abajo y luego ejecuta onClose.
  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: SCREEN_H, duration: 220, useNativeDriver: true }),
      Animated.timing(scrim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => onClose());
  }, [translateY, scrim, onClose, SCREEN_H]);

  useImperativeHandle(ref, () => ({ close }), [close]);

  // Gesto de arrastre hacia abajo en el asa/encabezado.
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DRAG_CLOSE_THRESHOLD || g.vy > 0.8) {
          close();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 2 }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.scrim, { opacity: scrim }]}>
        <Pressable style={styles.fill} onPress={close} />
      </Animated.View>

      <View style={styles.anchor} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          {/* Zona de arrastre: asa + encabezado */}
          <View {...pan.panHandlers}>
            <View style={styles.handle} />
            <View style={styles.headerRow}>
              <View style={styles.titleRow}>
                <View style={styles.bar} />
                <Txt variant="h2">{title}</Txt>
              </View>
              <Pressable onPress={close} hitSlop={12}>
                <IconX size={20} color={theme.colors.textSecondary} strokeWidth={2} />
              </Pressable>
            </View>
            {subtitle ? (
              <Txt variant="bodySm" color="textSecondary" style={styles.subtitle}>
                {subtitle}
              </Txt>
            ) : null}
          </View>

          <SafeAreaView edges={['bottom']}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </View>
  );
});

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
