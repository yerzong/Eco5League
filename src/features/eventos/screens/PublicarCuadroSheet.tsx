/**
 * EV ✦ Bottom sheet de confirmación "Publicar cuadro" (Figma 633:29409).
 * Lista las 4 consecuencias de publicar (3 verdes + 1 ámbar) y ofrece
 * las acciones Cancelar / Publicar.
 */
import React, { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { BottomSheet, type BottomSheetHandle } from '@/design-system/components/BottomSheet';
import { IconAlertCircle, IconCheck } from '@/design-system/icons';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from '@/design-system/components/Txt';

/* ─── Consecuencias (datos puros fuera del componente) ─── */

type ConsequenceVariant = 'check' | 'warning';

interface Consequence {
  variant: ConsequenceVariant;
  text: string;
}

const CONSEQUENCES: Consequence[] = [
  { variant: 'check',   text: 'El cuadro se vuelve visible para equipos y público.' },
  { variant: 'check',   text: 'Se notifica a cada equipo su grupo y rival.'         },
  { variant: 'check',   text: 'Se agenda el calendario de partidas.'                },
  { variant: 'warning', text: 'El seeding queda fijo y no se puede regenerar.'      },
];

/* ─── Props ─── */

interface PublicarCuadroSheetProps {
  onPublish: () => void;
  onClose: () => void;
}

/* ─── Componente ─── */

export function PublicarCuadroSheet({ onPublish, onClose }: PublicarCuadroSheetProps) {
  const sheetRef = useRef<BottomSheetHandle>(null);

  const header = (
    <View style={s.headerBlock}>
      <Txt style={s.title}>Publicar cuadro</Txt>
    </View>
  );

  function handlePublish() {
    onPublish();
    sheetRef.current?.close();
  }

  return (
    <BottomSheet ref={sheetRef} header={header} glass onClose={onClose}>
      <View style={s.body}>

        {/* Lista de consecuencias */}
        <View style={s.consequenceList}>
          {CONSEQUENCES.map((c, i) => (
            <ConsequenceRow key={i} variant={c.variant} text={c.text} />
          ))}
        </View>

        {/* Acciones */}
        <View style={s.actions}>
          <Pressable
            style={({ pressed }) => [s.cancelBtn, pressed && { opacity: 0.8 }]}
            onPress={() => sheetRef.current?.close()}
            accessibilityRole="button"
            accessibilityLabel="Cancelar publicación">
            <Txt style={s.cancelLabel}>Cancelar</Txt>
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.publishBtn, pressed && { opacity: 0.85 }]}
            onPress={handlePublish}
            accessibilityRole="button"
            accessibilityLabel="Confirmar publicación del cuadro">
            <Svg style={StyleSheet.absoluteFill} width={200} height={52}>
              <Defs>
                <LinearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#ff3b52" />
                  <Stop offset="1" stopColor="#e11d36" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="200" height="52" fill="url(#pubGrad)" />
            </Svg>
            <Txt style={s.publishLabel}>Publicar</Txt>
          </Pressable>
        </View>

      </View>
    </BottomSheet>
  );
}

/* ─── Fila de consecuencia ─── */

interface ConsequenceRowProps {
  variant: ConsequenceVariant;
  text: string;
}

function ConsequenceRow({ variant, text }: ConsequenceRowProps) {
  return (
    <View style={s.consequenceRow}>
      {variant === 'check' ? (
        <IconCheck size={18} color="#34d77f" strokeWidth={2.2} />
      ) : (
        <IconAlertCircle size={18} color="#f6c878" strokeWidth={1.8} />
      )}
      <Txt style={s.consequenceText}>{text}</Txt>
    </View>
  );
}

/* ─── Estilos ─── */

const s = StyleSheet.create({
  headerBlock: { gap: 2 },
  title: {
    fontFamily: fonts.glassTitle,
    fontSize: 22,
    color: '#f6f6f8',
  },
  body: { gap: 18, paddingTop: 4, paddingBottom: 8 },

  consequenceList: { gap: 14 },
  consequenceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  consequenceText: {
    flex: 1,
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13.5,
    lineHeight: 19,
    color: 'rgba(246,246,248,0.8)',
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  publishBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  publishLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});
