/**
 * Campo de carga de PDF (reglamento). Estado vacío (zona punteada "Subir
 * reglamento (PDF)") vs PDF subido (badge PDF + nombre + ✓ + quitar).
 * Genérico/reutilizable. Nota: la selección real de archivos requiere un
 * document-picker; aquí se simula el alta para la maqueta.
 */
import React, { useState } from 'react';
import {
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import {
  pick as pickDocument,
  types,
  errorCodes,
  isErrorWithCode,
} from '@react-native-documents/picker';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconUpload } from '@/design-system/icons';
import { Txt } from './Txt';

const BOX_H = 80;

export interface PdfFile {
  name: string;
  size: string;
}

interface PdfUploadProps {
  value?: PdfFile | null;
  onChange: (file: PdfFile | null) => void;
}

/** Tamaño en bytes → "0.8 MB" (o "" si no se conoce). */
function formatSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1048576) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function PdfUpload({ value, onChange }: PdfUploadProps) {
  const [w, setW] = useState(0);

  // Abre el explorador de archivos del sistema y filtra a PDF.
  const pick = async () => {
    try {
      const [res] = await pickDocument({ type: [types.pdf] });
      onChange({ name: res.name ?? 'documento.pdf', size: formatSize(res.size) });
    } catch (e) {
      if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED) return;
      // Cualquier otro error: se ignora silenciosamente en la maqueta.
    }
  };

  if (!value) {
    return (
      <Pressable
        style={styles.empty}
        onPress={pick}
        onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}>
        {w > 0 ? (
          <Svg width={w} height={BOX_H} style={StyleSheet.absoluteFill}>
            <Rect
              x={0.75}
              y={0.75}
              width={w - 1.5}
              height={BOX_H - 1.5}
              rx={11.25}
              ry={11.25}
              fill="none"
              stroke={theme.colors.borderStrong}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          </Svg>
        ) : null}
        <IconUpload size={22} color={theme.colors.textSecondary} strokeWidth={1.8} />
        <Txt style={styles.emptyTitle}>Subir reglamento (PDF)</Txt>
        <Txt style={styles.emptyHint}>PDF · máx 10 MB</Txt>
      </Pressable>
    );
  }

  return (
    <View style={styles.uploaded}>
      <View style={styles.badge}>
        <Txt style={styles.badgeText}>PDF</Txt>
      </View>
      <View style={styles.info}>
        <Txt style={styles.name} numberOfLines={1}>
          {value.name}
        </Txt>
        <View style={styles.metaRow}>
          <Txt style={styles.check}>✓</Txt>
          <Txt style={styles.meta}>{value.size ? `Subido · ${value.size}` : 'Subido'}</Txt>
        </View>
      </View>
      <Pressable style={styles.removeBtn} onPress={() => onChange(null)}>
        <Txt style={styles.removeX}>✕</Txt>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Vacío
  empty: {
    height: BOX_H,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  emptyTitle: { fontFamily: fonts.label, fontSize: 13, lineHeight: 16, color: theme.colors.textSecondary },
  emptyHint: { fontFamily: fonts.body, fontSize: 12, lineHeight: 14, color: theme.colors.textTertiary },

  // Subido
  uploaded: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    height: BOX_H,
    padding: 12,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceSunken,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  badge: {
    width: 40,
    height: 44,
    borderRadius: 8,
    backgroundColor: theme.colors.brandRed + '26',
    borderWidth: 1,
    borderColor: theme.colors.brandRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.label, fontSize: 11, color: theme.colors.brandRedBorder },
  info: { flex: 1, gap: 3 },
  name: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  check: { fontFamily: fonts.label, fontSize: 11, color: theme.colors.accentGreen },
  meta: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textTertiary },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.surfacePill,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeX: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textSecondary },
});
