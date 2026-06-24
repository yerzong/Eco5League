/**
 * Estado de carga simulado por pestaña: cada vez que la pantalla recibe foco
 * muestra "cargando" durante `ms` (skeleton) y luego revela el contenido.
 * Útil para maquetar la carga progresiva entre módulos.
 */
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export function useTabLoading(ms = 1000): boolean {
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), ms);
      return () => clearTimeout(t);
    }, [ms]),
  );

  return loading;
}
