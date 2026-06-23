/**
 * Implementación SIMULADA del dashboard (maqueta SA-M01).
 * Devuelve los datos demo del panel de Super-admin.
 */
import type { DashboardData, DashboardService } from './types';

export class MockDashboardService implements DashboardService {
  async getOverview(): Promise<DashboardData> {
    return {
      stats: [
        { key: 'eventos', value: 3, label: 'Eventos activos', category: 'resultado' },
        { key: 'equipos', value: 24, label: 'Equipos registrados', category: 'transferencia' },
        { key: 'staff', value: 12, label: 'Staff activo', category: 'inscripcion' },
        { key: 'inscripciones', value: 7, label: 'Inscripciones pend.', category: 'resultado' },
      ],
      tasks: [
        {
          id: 't1',
          category: 'transferencia',
          tagLabel: 'Transferencia',
          text: '@player_x → Red Gaming · revisar',
        },
        {
          id: 't2',
          category: 'inscripcion',
          tagLabel: 'Inscripción',
          text: 'NightWolves esperan aprobación · Torneo #4',
        },
        {
          id: 't3',
          category: 'resultado',
          tagLabel: 'Resultado',
          text: 'QF-03 sin reportar · árbitros alertados',
        },
      ],
      activity: [
        { id: 'a1', category: 'inscripcion', text: 'Team Ozone completó inscripción', time: '5 min' },
        { id: 'a2', category: 'resultado', text: 'QF-02 confirmado · Red Gaming 2–0', time: '1 h' },
        { id: 'a3', category: 'transferencia', text: 'Transferencia @player_x recibida', time: '28 min' },
      ],
    };
  }
}
