/**
 * Campo de carga de imagen de portada. Estado vacío (zona punteada "Subir
 * imagen") vs imagen subida (preview + Cambiar / Quitar + meta del archivo).
 * Usa react-native-image-picker para elegir de la galería.
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
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconPhoto } from '@/design-system/icons';
import { Txt } from './Txt';

const EMPTY_H = 96;

interface CoverUploadProps {
  value?: Asset | null;
  onChange: (asset: Asset | null) => void;
}

/** Texto de meta del archivo (nombre · WxH · tamaño). */
function fileMeta(a: Asset): string {
  const dims = a.width && a.height ? ` · ${a.width}×${a.height}` : '';
  const size = a.fileSize ? ` · ${(a.fileSize / 1048576).toFixed(1)} MB` : '';
  return `${a.fileName ?? 'portada.jpg'}${dims}${size}`;
}

export function CoverUpload({ value, onChange }: CoverUploadProps) {
  const [w, setW] = useState(0);
  const pick = async () => {
    const res = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    });
    if (res.didCancel || !res.assets?.[0]) return;
    onChange(res.assets[0]);
  };

  if (!value?.uri) {
    return (
      <Pressable
        style={styles.empty}
        onPress={pick}
        onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}>
        {/* Borde punteado vía SVG (RN no soporta dashed + borderRadius). */}
        {w > 0 ? (
          <Svg width={w} height={EMPTY_H} style={StyleSheet.absoluteFill}>
            <Rect
              x={0.75}
              y={0.75}
              width={w - 1.5}
              height={EMPTY_H - 1.5}
              rx={11.25}
              ry={11.25}
              fill="none"
              stroke={theme.colors.borderStrong}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          </Svg>
        ) : null}
        <IconPhoto size={26} color={theme.colors.textSecondary} strokeWidth={1.8} />
        <Txt style={styles.emptyTitle}>Subir imagen</Txt>
        <Txt style={styles.emptyHint}>PNG · JPG · 1200×400px · máx 2 MB</Txt>
      </Pressable>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.preview}>
        <Image source={{ uri: value.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.actions}>
          <Pressable style={styles.changeBtn} onPress={pick}>
            <Txt style={styles.changeText}>Cambiar</Txt>
          </Pressable>
          <Pressable style={styles.removeBtn} onPress={() => onChange(null)}>
            <Txt style={styles.removeText}>✕</Txt>
          </Pressable>
        </View>
      </View>
      <View style={styles.metaRow}>
        <Txt style={styles.metaText} numberOfLines={1}>
          {fileMeta(value)}
        </Txt>
        <View style={styles.uploaded}>
          <Txt style={styles.uploadedText}>✓</Txt>
          <Txt style={styles.uploadedText}>Subida</Txt>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Vacío
  empty: {
    height: EMPTY_H,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  emptyTitle: { fontFamily: fonts.label, fontSize: 13, lineHeight: 16, color: theme.colors.textSecondary },
  emptyHint: { fontFamily: fonts.body, fontSize: 11, lineHeight: 13, color: theme.colors.textTertiary },

  // Subida
  wrap: { gap: theme.spacing.sm, width: '100%' },
  preview: { height: 124, borderRadius: 12, overflow: 'hidden', backgroundColor: theme.colors.surfaceSunken },
  actions: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', gap: theme.spacing.sm },
  changeBtn: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#0c0c10c7',
    borderWidth: 1,
    borderColor: '#ffffff2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeText: { fontFamily: fonts.label, fontSize: 12, color: theme.colors.white },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0c0c10c7',
    borderWidth: 1,
    borderColor: '#ffffff2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.white },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metaText: { flex: 1, fontFamily: fonts.body, fontSize: 12, color: theme.colors.textSecondary },
  uploaded: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, paddingLeft: theme.spacing.sm },
  uploadedText: { fontFamily: fonts.label, fontSize: 12, color: theme.colors.accentGreen },
});
