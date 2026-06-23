/**
 * Implementación SIMULADA del centro de alertas (maqueta SA-M05).
 */
import type { NotificationCategory } from '@/shared/notifications/categories';
import type { NotificationItem, NotificationsService } from './types';

const DATA: NotificationItem[] = [
  { id: 'n1', category: 'inscripcion', badge: 'I', text: 'Team Ozone completó inscripción en Copa T1', time: 'Hace 5 min' },
  { id: 'n2', category: 'inscripcion', badge: 'I', text: 'NightWolves solicitan inscripción · Torneo #4', time: 'Hace 12 min' },
  { id: 'n3', category: 'transferencia', badge: 'T', text: '@player_x quiere pasar a Red Gaming', time: 'Hace 28 min' },
  { id: 'n4', category: 'resultado', badge: 'R', text: 'QF-01 confirmado: Team Ozone 2–1 Viral GG', time: 'Hace 1 h' },
  { id: 'n5', category: 'sistema', badge: 'S', text: 'Bracket generado para Copa ECO5 T1', time: 'Hace 3 h' },
  { id: 'n6', category: 'resultado', badge: 'R', text: 'QF-02 confirmado: Red Gaming 2–0 Steel', time: 'Hace 5 h' },
  { id: 'n7', category: 'transferencia', badge: 'T', text: 'Transferencia @nova_carry aprobada', time: 'Hace 2 d' },
];

export class MockNotificationsService implements NotificationsService {
  async list(category?: NotificationCategory): Promise<NotificationItem[]> {
    if (!category) return DATA;
    return DATA.filter(n => n.category === category);
  }
}
