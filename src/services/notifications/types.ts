/**
 * Contratos del servicio de notificaciones (centro de alertas SA-M05).
 */
import type { NotificationCategory } from '@/shared/notifications/categories';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  text: string;
  time: string;
  /** Inicial mostrada en el badge (I, T, R, S). */
  badge: string;
}

export interface NotificationsService {
  /** Lista de notificaciones. `category` filtra; omitir = todas. */
  list(category?: NotificationCategory): Promise<NotificationItem[]>;
}
