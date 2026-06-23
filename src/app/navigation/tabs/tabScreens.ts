/**
 * Registro: cada TabKey → su componente de pantalla.
 * Centralizado para que AppTabs arme la tab bar sin conocer cada feature.
 * Las pantallas aún sin maquetar usan un Placeholder.
 */
import React, { type ComponentType } from 'react';
import { TabKey } from '@/shared/auth/roles';
import { Placeholder } from '@/design-system/components';
import { InicioScreen } from '@/features/eventos/screens/InicioScreen';
import { EventosScreen } from '@/features/eventos/screens/EventosScreen';
import { BuscarOrgScreen } from '@/features/descubrir/screens/BuscarOrgScreen';
import { MiOrgScreen } from '@/features/organizacion/screens/MiOrgScreen';
import { InvitacionesScreen } from '@/features/invitaciones/screens/InvitacionesScreen';
import { PartidasScreen } from '@/features/partidas/screens/PartidasScreen';
import { TareasScreen } from '@/features/staff/screens/TareasScreen';
import { GestionScreen } from '@/features/gestion/screens/GestionScreen';

/** Placeholder con nombre, para tabs pendientes de maquetar. */
const ph = (figmaRef: string, title: string): ComponentType =>
  () => React.createElement(Placeholder, { figmaRef, title });

export const TAB_SCREENS: Record<TabKey, ComponentType<any>> = {
  inicio: InicioScreen,
  buscarOrg: BuscarOrgScreen,
  miOrg: MiOrgScreen,
  invitaciones: InvitacionesScreen,
  partidas: PartidasScreen,
  tareas: TareasScreen,
  gestion: GestionScreen,
  eventos: EventosScreen,
  // Tabs del Super-admin pendientes de maquetar
  staff: ph('SA-M03', 'Staff'),
  equipos: ph('SA-M04', 'Equipos'),
  usuarios: ph('USR', 'Usuarios'),
};
