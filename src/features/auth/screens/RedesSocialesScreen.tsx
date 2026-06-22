/**
 * OB-07 · Modal Agregar red social — bottom sheet.
 * Grilla de redes seleccionables + usuario + botón AGREGAR.
 */
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Txt,
  BottomSheet,
  AngularButton,
  type BottomSheetHandle,
} from '@/design-system/components';
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
    sheetRef.current?.close(); // cierra con animación
  };

  return (
    <BottomSheet
      ref={sheetRef}
      title="Agregar red social"
      subtitle="Conecta tus redes para tu perfil público."
      onClose={() => navigation.goBack()}>
      {/* Grilla de redes */}
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
              <Txt variant="label" color="textPrimary">
                {n.label}
              </Txt>
            </Pressable>
          );
        })}
      </View>

      {/* Usuario de la red seleccionada */}
      <View style={styles.field}>
        <Txt variant="label" color="textSecondary" style={styles.fieldLabel}>
          {isWeb ? 'URL DE TU SITIO' : `TU USUARIO DE ${net.label.toUpperCase()}`}
        </Txt>
        <View style={styles.inputBox}>
          {!isWeb ? <Txt style={styles.at}>@</Txt> : null}
          <TextInput
            style={styles.input}
            placeholder={isWeb ? 'https://tusitio.com' : 'tu_usuario'}
            placeholderTextColor={theme.colors.textTertiary}
            autoCapitalize="none"
            value={usuario}
            onChangeText={setUsuario}
            keyboardType={isWeb ? 'url' : 'default'}
          />
        </View>
      </View>

      <AngularButton
        label="AGREGAR"
        height={56}
        borderColor="#f04d60"
        style={styles.cta}
        onPress={handleAdd}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  tile: {
    width: '30%',
    flexGrow: 1,
    height: 77,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface2,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  tileActive: {
    borderColor: theme.colors.brandRed,
  },
  field: { gap: theme.spacing.sm, marginTop: theme.spacing.xl },
  fieldLabel: { letterSpacing: 0.5 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    height: 50,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.bgBase,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    borderRadius: theme.radius.sm,
  },
  at: { fontFamily: fonts.body, fontSize: 14, color: theme.colors.textTertiary },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 14,
    padding: 0,
  },
  cta: { marginTop: theme.spacing.xl, marginBottom: theme.spacing.md },
});
