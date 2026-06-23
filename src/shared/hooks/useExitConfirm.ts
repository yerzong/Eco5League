/**
 * Intercepta cualquier intento de salir de la pantalla (botón atrás, gesto de
 * deslizar, header) para pedir confirmación. Devuelve el estado del modal.
 *
 * Uso:
 *   const exit = useExitConfirm();
 *   <ConfirmModal visible={exit.visible} onCancel={exit.onCancel} onConfirm={exit.onConfirm} ... />
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export function useExitConfirm() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const confirmed = useRef(false);
  const pendingAction = useRef<any>(null);

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e: any) => {
      if (confirmed.current) return; // ya confirmó: dejar salir
      // Solo confirmamos cuando el usuario intenta retroceder (atrás/gesto).
      // La navegación programática (reset/navigate al completar el flujo) pasa libre.
      const type = e.data?.action?.type;
      if (type !== 'GO_BACK' && type !== 'POP' && type !== 'POP_TO_TOP') return;
      e.preventDefault();
      pendingAction.current = e.data.action;
      setVisible(true);
    });
    return unsub;
  }, [navigation]);

  const onCancel = () => setVisible(false);

  const onConfirm = () => {
    confirmed.current = true;
    setVisible(false);
    if (pendingAction.current) navigation.dispatch(pendingAction.current);
  };

  /** Permite la siguiente salida sin pedir confirmación (acciones intencionales). */
  const bypass = () => {
    confirmed.current = true;
  };

  return { visible, onCancel, onConfirm, bypass };
}
