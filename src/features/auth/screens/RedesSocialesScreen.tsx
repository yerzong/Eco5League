/**
 * OB-07 · Modal Agregar red social — bottom sheet "glass".
 * Grilla de redes seleccionables (2×3) + usuario + CTA "Agregar".
 * Fiel a Figma "Agregar red social ✦ glass".
 */
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Txt,
  BottomSheet,
  AppButton,
  type BottomSheetHandle,
} from '@/design-system/components';
import { IconX } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { NETWORKS } from '@/features/auth/socialNetworks';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'RedesSocialesModal'>;

export function RedesSocialesScreen({ navigation, route }: Props) {
  const sheetRef = useRef<BottomSheetHandle>(null);
  const [selected, setSelected] = useState('tiktok');
  const [usuario, setUsuario] = useState('');
  const net = NETWORKS.find(n => n.key === selected)!;
  const isWeb = selected === 'web';

  const handleAdd = () => {
    if (usuario.trim()) {
      route.params?.onAdd?.({ networkKey: selected, handle: usuario.trim() });
    }
    sheetRef.current?.close();
  };

  const header = (
    <>
      <View style={styles.headerRow}>
        <Txt style={styles.title}>Agregar red social</Txt>
        <Pressable onPress={() => sheetRef.current?.close()} hitSlop={12}>
          <IconX size={18} color={theme.colors.textOnGlassDim} strokeWidth={2.2} />
        </Pressable>
      </View>
      <Txt style={styles.subtitle}>Conecta tus redes para tu perfil público.</Txt>
    </>
  );

  return (
    <BottomSheet
      ref={sheetRef}
      glass
      header={header}
      onClose={() => navigation.goBack()}>
      {/* Grilla de redes (2×3) */}
      <View style={styles.grid}>
        {NETWORKS.map(n => {
          const active = n.key === selected;
          const Icon = n.icon;
          return (
            <Pressable
              key={n.key}
              onPress={() => setSelected(n.key)}
              style={[styles.tile, active && styles.tileActive]}>
              <Icon size={26} color={n.color} strokeWidth={1.9} />
              <Txt style={styles.tileLabel}>{n.label}</Txt>
            </Pressable>
          );
        })}
      </View>

      {/* Usuario de la red seleccionada */}
      <View style={styles.field}>
        <Txt style={styles.fieldLabel}>
          {isWeb ? 'URL DE TU SITIO' : `TU USUARIO DE ${net.label.toUpperCase()}`}
        </Txt>
        <View style={styles.inputBox}>
          {!isWeb ? <Txt style={styles.at}>@</Txt> : null}
          <TextInput
            style={styles.input}
            placeholder={isWeb ? 'https://tusitio.com' : 'tu_usuario'}
            placeholderTextColor={theme.colors.textOnGlassFaint}
            autoCapitalize="none"
            value={usuario}
            onChangeText={setUsuario}
            keyboardType={isWeb ? 'url' : 'default'}
          />
        </View>
      </View>

      <AppButton label="Agregar" style={styles.cta} onPress={handleAdd} />
    </BottomSheet>
  );
}

const RED_BORDER = 'rgba(255,59,82,0.7)';

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.glassTitle,
    fontSize: 19,
    letterSpacing: -0.3,
    color: '#f6f6f8',
  },
  subtitle: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13,
    color: theme.colors.textOnGlassDim,
    marginTop: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: theme.spacing.lg,
  },
  tile: {
    width: '30%',
    flexGrow: 1,
    height: 78,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  tileActive: {
    backgroundColor: theme.colors.glassFillStrong,
    borderWidth: 1.5,
    borderColor: 'rgba(255,59,82,0.8)',
  },
  tileLabel: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 12,
    color: theme.colors.textOnGlass,
  },
  field: { gap: theme.spacing.sm, marginTop: theme.spacing.lg },
  fieldLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: theme.colors.textOnGlassDim,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1.5,
    borderColor: RED_BORDER,
    borderRadius: 16,
  },
  at: { fontFamily: fonts.glassBodyBold, fontSize: 15, color: theme.colors.textOnGlassDim },
  input: {
    flex: 1,
    color: 'rgba(246,246,248,0.95)',
    fontFamily: fonts.glassBodyMedium,
    fontSize: 15,
    padding: 0,
  },
  cta: { marginTop: theme.spacing.lg, marginBottom: theme.spacing.md },
});
