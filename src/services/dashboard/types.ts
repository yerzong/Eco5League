/**
 * Contratos del servicio del dashboard (panel de inicio).
 * Las pantallas dependen de la interfaz `DashboardService`, no del mock.
 */
import type { NotificationCategory } from '@/shared/notifications/categories';

/** Métrica del panel (número grande + etiqueta + acento). */
export interface DashboardStat {
  key: string;
  value: number;
  label: string;
  category: NotificationCategory;
}

/** Tarea pendiente que requiere acción del admin. */
export interface PendingTask {
  id: string;
  category: NotificationCategory;
  tagLabel: string;
  text: string;
}

/** Entrada de actividad reciente (timeline). */
export interface ActivityItem {
  id: string;
  category: NotificationCategory;
  text: string;
  time: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  tasks: PendingTask[];
  activity: ActivityItem[];
}

export interface DashboardService {
  /** Trae todo lo que pinta el panel de inicio. */
  getOverview(): Promise<DashboardData>;
}
