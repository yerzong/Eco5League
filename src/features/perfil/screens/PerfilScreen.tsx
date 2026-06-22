import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen, Txt, Button } from '@/design-system/components';
import { theme } from '@/design-system/theme';
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

/**
 * Perfil. Desde aquí se entra a Notificaciones y Configuración (no van en tab bar).
 * Incluye un selector de rol PROVISIONAL para probar la navegación por rol.
 */
export function PerfilScreen() {
  const { role, setRole, signOut } = useSession();
  return (
    <Screen>
      <Txt variant="overline" color="brandRed">
        PRF-1 · PERFIL
      </Txt>
      <Txt variant="h2" style={styles.title}>
        Mi perfil
      </Txt>

      <Txt variant="sectionLabel" color="textSecondary" style={styles.section}>
        ROL ACTIVO (DEMO) — {ROLE_LABELS[role]}
      </Txt>
      <View style={styles.roles}>
        {ROLES.map(r => (
          <Button
            key={r}
            label={ROLE_LABELS[r]}
            variant={r === role ? 'primary' : 'secondary'}
            onPress={() => setRole(r)}
            style={styles.roleBtn}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Button label="Cerrar sesión" variant="ghost" onPress={signOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: theme.spacing.xs },
  section: { marginTop: theme.spacing.xl, marginBottom: theme.spacing.sm },
  roles: { gap: theme.spacing.sm },
  roleBtn: { height: 44 },
  footer: { marginTop: 'auto', paddingTop: theme.spacing.lg },
});
