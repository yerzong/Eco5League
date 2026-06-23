/**
 * SA-M06 · Perfil (Super-admin) — fiel al diseño de Figma.
 * Avatar + datos de cuenta + configuración + cerrar sesión.
 * Incluye un selector de rol PROVISIONAL (demo) para probar la navegación.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Txt,
  GlowBackground,
  BackButton,
  Eyebrow,
  Avatar,
  SettingRow,
} from '@/design-system/components';
import { IconLogout } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useSession } from '@/shared/auth/SessionContext';
import { ROLE_LABELS, Role } from '@/shared/auth/roles';

const ROLES: Role[] = [
  'visitante',
  'jugador',
  'capitan',
  'coach',
  'manager',
  'staff',
  'admin',
  'superadmin',
];

/** Fila de dato de cuenta: etiqueta pequeña + valor. */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Txt style={styles.infoLabel}>{label}</Txt>
      <Txt variant="bodyMedium" color="textPrimary" style={styles.infoValue}>
        {value}
      </Txt>
    </View>
  );
}

export function PerfilScreen() {
  const { role, nombre, initials, setRole, signOut } = useSession();

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.02} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <BackButton style={styles.back} />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* Cabecera de perfil */}
          <View style={styles.head}>
            <Avatar initials={initials} size={88} />
            <Txt style={styles.name}>{nombre}</Txt>
            <View style={styles.roleBadge}>
              <Txt style={styles.roleBadgeText}>
                {ROLE_LABELS[role].toUpperCase()}
              </Txt>
            </View>
          </View>

          {/* Información de cuenta */}
          <View style={styles.divider} />
          <Eyebrow label="// Información de cuenta" />
          <View style={styles.infoBlock}>
            <InfoRow label="Correo electrónico" value="gerson.garcia@engen.com.mx" />
            <InfoRow label="Teléfono" value="+52 733 123 4567" />
            <InfoRow label="Región" value="México · CDMX" />
          </View>

          {/* Configuración */}
          <View style={styles.divider} />
          <Eyebrow label="// Configuración" />
          <View style={styles.settings}>
            <SettingRow label="Editar perfil" onPress={() => {}} />
            <SettingRow label="Cambiar contraseña" onPress={() => {}} />
            <SettingRow label="Privacidad y seguridad" onPress={() => {}} />
          </View>

          {/* Selector de rol (DEMO) */}
          <View style={styles.divider} />
          <Eyebrow label="// Rol activo (demo)" />
          <View style={styles.roleGrid}>
            {ROLES.map(r => {
              const active = r === role;
              return (
                <Pressable
                  key={r}
                  onPress={() => setRole(r)}
                  style={[styles.roleChip, active && styles.roleChipActive]}>
                  <Txt
                    style={active ? [styles.roleChipText, styles.roleChipTextActive] : styles.roleChipText}>
                    {ROLE_LABELS[r]}
                  </Txt>
                </Pressable>
              );
            })}
          </View>

          {/* Cerrar sesión */}
          <Pressable style={styles.logout} onPress={signOut}>
            <IconLogout size={18} color={theme.colors.brandRed} strokeWidth={2} />
            <Txt style={styles.logoutText}>CERRAR SESIÓN</Txt>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1, paddingHorizontal: theme.spacing['2xl'] },
  back: { marginTop: theme.spacing.md },
  content: { paddingBottom: theme.spacing['3xl'] },
  head: { alignItems: 'center', marginTop: theme.spacing.md },
  name: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    lineHeight: 30,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  roleBadge: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.brandRed,
  },
  roleBadgeText: {
    fontFamily: fonts.label,
    fontSize: 11,
    letterSpacing: 0.5,
    color: theme.colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderDefault,
    marginVertical: theme.spacing.xl,
  },
  infoBlock: { gap: theme.spacing.lg, marginTop: theme.spacing.md },
  infoRow: { gap: 3 },
  infoLabel: { fontFamily: fonts.label, fontSize: 12, color: theme.colors.textTertiary },
  infoValue: { fontSize: 14 },
  settings: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  roleChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
  },
  roleChipActive: { backgroundColor: theme.colors.brandRed, borderColor: theme.colors.brandRed },
  roleChipText: { fontFamily: fonts.button, fontSize: 12, color: theme.colors.textSecondary },
  roleChipTextActive: { color: theme.colors.white },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    height: 48,
    marginTop: theme.spacing.xl,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.brandRed,
  },
  logoutText: {
    fontFamily: fonts.button,
    fontSize: 14,
    color: theme.colors.brandRed,
    letterSpacing: 0.5,
  },
});
