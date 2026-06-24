/**
 * Registro: cada TabKey → su componente de pantalla.
 * Centralizado para que AppTabs arme la tab bar sin conocer cada feature.
 */
import { type ComponentType } from 'react';
import { TabKey } from '@/shared/auth/roles';
import { InicioScreen } from '@/features/eventos/screens/InicioScreen';
import { EventosScreen } from '@/features/eventos/screens/EventosScreen';
import { BuscarOrgScreen } from '@/features/descubrir/screens/BuscarOrgScreen';
import { MiOrgScreen } from '@/features/organizacion/screens/MiOrgScreen';
import { InvitacionesScreen } from '@/features/invitaciones/screens/InvitacionesScreen';
import { PartidasScreen } from '@/features/partidas/screens/PartidasScreen';
import { TareasScreen } from '@/features/staff/screens/TareasScreen';
import { GestionScreen } from '@/features/gestion/screens/GestionScreen';
import { StaffScreen } from '@/features/staff/screens/StaffScreen';
import { EquiposScreen } from '@/features/equipos/screens/EquiposScreen';
import { UsuariosScreen } from '@/features/usuarios/screens/UsuariosScreen';

export const TAB_SCREENS: Record<TabKey, ComponentType<any>> = {
  inicio: InicioScreen,
  buscarOrg: BuscarOrgScreen,
  miOrg: MiOrgScreen,
  invitaciones: InvitacionesScreen,
  partidas: PartidasScreen,
  tareas: TareasScreen,
  gestion: GestionScreen,
  eventos: EventosScreen,
  staff: StaffScreen,
  equipos: EquiposScreen,
  usuarios: UsuariosScreen,
};
