/**
 * EV-01 · Registrar / Corregir resultado (Figma 673-5366 · 633-31062)
 *
 * `mode='register'` — para partidos en vivo (sin warning banner).
 * `mode='correct'`  — para partidos finalizados (muestra aviso ámbar).
 *
 * Segmented control por mapa: el equipo seleccionado recibe gradiente rojo.
 * Banner verde se muestra automáticamente cuando un equipo alcanza los mapas
 * necesarios para ganar la serie.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { IconAlertCircle, IconChevronLeft } from '@/design-system/icons';
import { Txt } from '@/design-system/components/Txt';
import { fonts } from '@/design-system/tokens/typography';
import type { EventMatch } from '@/services';

/* ═══════════════════════════════════════════════════════════════════
   Props
═══════════════════════════════════════════════════════════════════ */

export interface RegistrarResultadoSheetProps {
  visible: boolean;
  match: EventMatch | null;
  mode: 'register' | 'correct';
  onClose: () => void;
  onSave: (winners: (0 | 1 | null)[]) => void;
}

/* ═══════════════════════════════════════════════════════════════════
   Helper — número de mapas en el formato
═══════════════════════════════════════════════════════════════════ */

function mapsForFormat(fmt: string): number {
  if (fmt === 'BO5') return 5;
  if (fmt === 'BO3') return 3;
  return 1;
}

function winsNeeded(fmt: string): number {
  if (fmt === 'BO5') return 3;
  if (fmt === 'BO3') return 2;
  return 1;
}

/* ═══════════════════════════════════════════════════════════════════
   Componente — MapWinnerSegmented
═══════════════════════════════════════════════════════════════════ */

interface MapWinnerSegmentedProps {
  index: number;
  team1Name: string;
  team2Name: string;
  winner: 0 | 1 | null;
  onSelect: (winner: 0 | 1) => void;
}

function MapWinnerSegmented({ index, team1Name, team2Name, winner, onSelect }: MapWinnerSegmentedProps) {
  const gradId = `rrs_mapGrad_${index}`;

  return (
    <View style={seg.container}>
      <Txt style={seg.label}>Mapa {index + 1}</Txt>
      <View style={seg.track}>
        {/* Opción equipo 1 */}
        <Pressable
          style={[seg.option, winner === 0 && seg.optionActive]}
          onPress={() => onSelect(0)}
          accessibilityRole="radio"
          accessibilityState={{ checked: winner === 0 }}
          accessibilityLabel={`${team1Name} gana mapa ${index + 1}`}>
          {winner === 0 && (
            <Svg style={StyleSheet.absoluteFill} width={200} height={42}>
              <Defs>
                <LinearGradient id={`${gradId}_t1`} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#ff3b52" />
                  <Stop offset="1" stopColor="#e11d36" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="200" height="42" rx="12" fill={`url(#${gradId}_t1)`} />
            </Svg>
          )}
          <Txt style={winner === 0 ? seg.optLabelActive : seg.optLabel} numberOfLines={1}>
            {team1Name}
          </Txt>
        </Pressable>

        {/* Opción equipo 2 */}
        <Pressable
          style={[seg.option, winner === 1 && seg.optionActive]}
          onPress={() => onSelect(1)}
          accessibilityRole="radio"
          accessibilityState={{ checked: winner === 1 }}
          accessibilityLabel={`${team2Name} gana mapa ${index + 1}`}>
          {winner === 1 && (
            <Svg style={StyleSheet.absoluteFill} width={200} height={42}>
              <Defs>
                <LinearGradient id={`${gradId}_t2`} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#ff3b52" />
                  <Stop offset="1" stopColor="#e11d36" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="200" height="42" rx="12" fill={`url(#${gradId}_t2)`} />
            </Svg>
          )}
          <Txt style={winner === 1 ? seg.optLabelActive : seg.optLabel} numberOfLines={1}>
            {team2Name}
          </Txt>
        </Pressable>
      </View>
    </View>
  );
}

const seg = StyleSheet.create({
  container: { gap: 6 },
  label: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 12.5,
    color: 'rgba(246,246,248,0.7)',
  },
  track: {
    flexDirection: 'row',
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 5,
    gap: 5,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 11,
    paddingHorizontal: 6,
  },
  optionActive: {},
  optLabel: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 13.5,
    color: 'rgba(246,246,248,0.55)',
  },
  optLabelActive: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 13.5,
    color: '#f6f6f8',
  },
});

/* ═══════════════════════════════════════════════════════════════════
   Componente principal
═══════════════════════════════════════════════════════════════════ */

export function RegistrarResultadoSheet({
  visible, match, mode, onClose, onSave,
}: RegistrarResultadoSheetProps) {
  const [mapWinners, setMapWinners] = useState<(0 | 1 | null)[]>([]);
  const [note, setNote] = useState('');

  // Inicializar winners cuando cambia el match o el modo
  useEffect(() => {
    if (!match) return;
    if (mode === 'correct') {
      setMapWinners(
        match.maps.map(m =>
          m.status === 'won_t1' ? 0 : m.status === 'won_t2' ? 1 : null,
        ),
      );
    } else {
      setMapWinners(Array(mapsForFormat(match.format)).fill(null));
    }
    setNote('');
  }, [match, mode]);

  const handleSelect = useCallback((mapIdx: number, winner: 0 | 1) => {
    setMapWinners(prev => {
      const next = [...prev];
      next[mapIdx] = winner;
      return next;
    });
  }, []);

  if (!match) return null;

  const needed = winsNeeded(match.format);
  const wins1 = mapWinners.filter(w => w === 0).length;
  const wins2 = mapWinners.filter(w => w === 1).length;
  const seriesWinner =
    wins1 >= needed ? 0 : wins2 >= needed ? 1 : null;

  const winnerBannerText =
    seriesWinner === 0
      ? `${match.team1.name} gana la serie ${wins1} – ${wins2}`
      : seriesWinner === 1
      ? `${match.team2.name} gana la serie ${wins2} – ${wins1}`
      : null;

  const title   = mode === 'correct' ? 'Corregir resultado' : 'Registrar resultado';
  const ctaLabel = mode === 'correct' ? 'Guardar corrección'  : 'Guardar resultado';
  const numMaps = mapsForFormat(match.format);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent>
      <SafeAreaProvider>
      <SafeAreaView style={s.root}>

        {/* ── Contenido scrollable ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={s.header}>
            <Pressable onPress={onClose} hitSlop={14} style={s.backBtn}>
              <IconChevronLeft size={22} color="#f6f6f8" strokeWidth={2.5} />
            </Pressable>
            <Txt style={s.headerTitle}>{title}</Txt>
          </View>

          {/* Aviso ámbar (solo modo corregir) */}
          {mode === 'correct' && (
            <View style={s.warningBanner}>
              <IconAlertCircle size={20} color="#f6c878" strokeWidth={1.8} />
              <Txt style={s.warningText}>
                Estás corrigiendo un resultado YA oficial. Se recalculará la tabla y el cuadro.
              </Txt>
            </View>
          )}

          {/* Equipos */}
          <View style={s.teamsPill}>
            <Txt style={s.teamsPillName}>{match.team1.name}</Txt>
            <Txt style={s.teamsPillVs}>vs</Txt>
            <Txt style={s.teamsPillName}>{match.team2.name}</Txt>
          </View>

          {/* GANADOR POR MAPA */}
          <Txt style={s.sectionLabel}>GANADOR POR MAPA</Txt>

          {Array.from({ length: numMaps }, (_, i) => (
            <MapWinnerSegmented
              key={i}
              index={i}
              team1Name={match.team1.name}
              team2Name={match.team2.name}
              winner={mapWinners[i] ?? null}
              onSelect={w => handleSelect(i, w)}
            />
          ))}

          {/* Banner ganador de serie */}
          {winnerBannerText ? (
            <View style={s.winnerBanner}>
              <Txt style={s.winnerBannerText}>{winnerBannerText}</Txt>
            </View>
          ) : (
            <View style={s.winnerBannerPlaceholder} />
          )}

          {/* Nota del oficial */}
          <View style={s.noteContainer}>
            <Txt style={s.noteLabel}>NOTA DEL OFICIAL (OPCIONAL)</Txt>
            <TextInput
              style={s.noteInput}
              multiline
              value={note}
              onChangeText={setNote}
              placeholder="Incidencias, pausas, etc."
              placeholderTextColor="rgba(246,246,248,0.42)"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* ── Footer fijo ── */}
        <View style={s.footer}>
          {/* Cancelar */}
          <Pressable
            style={({ pressed }) => [s.footerBtnGhost, pressed && { opacity: 0.75 }]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancelar">
            <Txt style={s.footerBtnLabel}>Cancelar</Txt>
          </Pressable>

          {/* Guardar */}
          <Pressable
            style={({ pressed }) => [s.footerBtnPrimary, pressed && { opacity: 0.85 }]}
            onPress={() => onSave(mapWinners)}
            disabled={seriesWinner === null}
            accessibilityRole="button"
            accessibilityLabel={ctaLabel}>
            <Svg style={StyleSheet.absoluteFill} width={300} height={54}>
              <Defs>
                <LinearGradient id="rrs_footerGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#ff3b52" />
                  <Stop offset="1" stopColor="#e11d36" />
                </LinearGradient>
              </Defs>
              <Rect
                x="0" y="0" width="300" height="54" rx="16"
                fill={seriesWinner !== null ? 'url(#rrs_footerGrad)' : 'rgba(255,255,255,0.1)'}
              />
            </Svg>
            <Txt style={seriesWinner === null ? [s.footerBtnLabel, { opacity: 0.4 }] : s.footerBtnLabel}>
              {ctaLabel}
            </Txt>
          </Pressable>
        </View>
      </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Estilos
═══════════════════════════════════════════════════════════════════ */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#060608' },
  content: {
    gap: 16,
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 20,
  },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', height: 40, gap: 14 },
  backBtn: { padding: 2 },
  headerTitle: { fontFamily: fonts.glassTitle, fontSize: 20, color: '#f6f6f8' },

  /* Warning ámbar */
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(246,166,35,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(246,166,35,0.4)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 76,
  },
  warningText: {
    flex: 1,
    fontFamily: fonts.glassBodyMedium,
    fontSize: 12.5,
    color: '#f6c878',
    lineHeight: 18,
  },

  /* Equipos pill */
  teamsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 14,
  },
  teamsPillName: { fontFamily: fonts.glassBodyBold, fontSize: 14, color: '#f6f6f8' },
  teamsPillVs: { fontFamily: fonts.glassBodyBold, fontSize: 12, color: 'rgba(246,246,248,0.4)' },

  /* Section label */
  sectionLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: 'rgba(246,246,248,0.45)',
  },

  /* Winner banner */
  winnerBanner: {
    backgroundColor: 'rgba(52,215,127,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52,215,127,0.35)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  winnerBannerText: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 13,
    color: '#5fe49a',
  },
  winnerBannerPlaceholder: { height: 44 },

  /* Nota */
  noteContainer: { gap: 8 },
  noteLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11.5,
    letterSpacing: 1,
    color: 'rgba(246,246,248,0.5)',
  },
  noteInput: {
    height: 96,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontFamily: fonts.glassBodyMedium,
    fontSize: 14,
    color: '#f6f6f8',
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: 'rgba(9,9,11,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  footerBtnGhost: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBtnPrimary: {
    flex: 1,
    height: 54,
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
  footerBtnLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});
