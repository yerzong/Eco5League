/**
 * Implementación SIMULADA del dashboard (maqueta SA-M01).
 * Devuelve los datos demo del panel de Super-admin.
 */
import type { DashboardData, DashboardService } from './types';

export class MockDashboardService implements DashboardService {
  async getOverview(): Promise<DashboardData> {
    return {
      stats: [
        { key: 'eventos', value: 3, label: 'Eventos activos', accent: '#ff2d46' },
        { key: 'inscripciones', value: 7, label: 'Inscrip. pendientes', accent: '#f6a623' },
        { key: 'equipos', value: 24, label: 'Equipos', accent: '#2e8fd6' },
        { key: 'staff', value: 12, label: 'Staff activo', accent: '#34d77f' },
      ],
      tasks: [
        {
          id: 't1',
          category: 'transferencia',
          tagLabel: 'Transferencia',
          text: 'Aprobar transferencia · NightWolves',
        },
        {
          id: 't2',
          category: 'inscripcion',
          tagLabel: 'Inscripción',
          text: 'Revisar inscripción · Phoenix X',
        },
        {
          id: 't3',
          category: 'resultado',
          tagLabel: 'Resultado',
          text: 'Fijar resultado · J2 · Grupo A',
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
