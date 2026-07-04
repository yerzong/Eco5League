/**
 * Campo de carga de imagen de portada. Estado vacío (zona punteada "Subir
 * imagen") vs imagen subida (preview + Cambiar / Quitar + meta del archivo).
 * Usa react-native-image-picker para elegir de la galería.
 * Estilos homologados con GlassUploader de CrearEventoScreen (Figma 629:4322).
 */
import React, { useState } from 'react';
import {
  Image,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { launchImageLibrary, type Asset } from 'react-native-image-picker';
import { fonts } from '@/design-system/tokens/typography';
import { IconPhoto, IconX } from '@/design-system/icons';
import { Txt } from './Txt';

const EMPTY_H = 110;

interface CoverUploadProps {
  value?: Asset | null;
  onChange: (asset: Asset | null) => void;
}

function fileMeta(a: Asset): string {
  const dims = a.width && a.height ? ` · ${a.width}×${a.height}` : '';
  const size = a.fileSize ? ` · ${(a.fileSize / 1048576).toFixed(1)} MB` : '';
  return `${a.fileName ?? 'portada.jpg'}${dims}${size}`;
}

export function CoverUpload({ value, onChange }: CoverUploadProps) {
  const [w, setW] = useState(0);
  const pick = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
    if (res.didCancel || !res.assets?.[0]) return;
    onChange(res.assets[0]);
  };

  if (!value?.uri) {
    return (
      <Pressable
        style={styles.empty}
        onPress={pick}
        onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}>
        {w > 0 ? (
          <Svg width={w} height={EMPTY_H} style={StyleSheet.absoluteFill}>
            <Rect
              x={0.75} y={0.75}
              width={w - 1.5} height={EMPTY_H - 1.5}
              rx={11.25} ry={11.25}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          </Svg>
        ) : null}
        <IconPhoto size={26} color="rgba(246,246,248,0.85)" strokeWidth={1.8} />
        <Txt style={styles.emptyTitle}>Subir imagen</Txt>
        <Txt style={styles.emptyHint}>PNG · JPG · 1200×400px · máx 2 MB</Txt>
      </Pressable>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.preview}>
        <Image source={{ uri: value.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.previewActions}>
          <Pressable style={styles.changeBtn} onPress={pick}>
            <Txt style={styles.changeBtnLabel}>Cambiar</Txt>
          </Pressable>
          <Pressable style={styles.removeBtn} onPress={() => onChange(null)}>
            <IconX size={14} color="#f6f6f8" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
      <View style={styles.metaRow}>
        <Txt style={styles.metaText} numberOfLines={1}>{fileMeta(value)}</Txt>
        <View style={styles.uploadedBadge}>
          <Txt style={styles.uploadedText}>✓ Subida</Txt>
        </View>
      </View>
    </View>
  );
}

const BTN_BG = 'rgba(0,0,0,0.4)';
const BTN_BORDER = 'rgba(255,255,255,0.2)';

const styles = StyleSheet.create({
  // Vacío
  empty: {
    height: EMPTY_H,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: { fontFamily: fonts.glassBodyBold, fontSize: 14, color: 'rgba(246,246,248,0.85)' },
  emptyHint: { fontFamily: fonts.glassBodyMedium, fontSize: 11, color: 'rgba(246,246,248,0.4)' },

  // Cargado (Figma 629:4322)
  wrap: { gap: 8, width: '100%' },
  preview: { height: 118, borderRadius: 14, overflow: 'hidden', backgroundColor: '#14080a' },
  previewActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 6,
  },
  changeBtn: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: BTN_BG,
    borderWidth: 1,
    borderColor: BTN_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBtnLabel: { fontFamily: fonts.glassBodyBold, fontSize: 12.5, color: '#f6f6f8' },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: BTN_BG,
    borderWidth: 1,
    borderColor: BTN_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metaText: { flex: 1, fontFamily: fonts.glassBodyMedium, fontSize: 11.5, color: 'rgba(246,246,248,0.5)' },
  uploadedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 8 },
  uploadedText: { fontFamily: fonts.glassBodyBold, fontSize: 11.5, color: '#5fe49a' },
});
