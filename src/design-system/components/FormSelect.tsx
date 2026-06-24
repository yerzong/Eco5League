/**
 * Selector de formulario desplegable. Cerrado muestra el valor; al tocarlo
 * abre un menú flotante (overlay, NO empuja el contenido) anclado debajo del
 * campo, con la opción activa resaltada (✓) y borde de foco. Genérico.
 */
import React, { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconChevronDown } from '@/design-system/icons';
import { Txt } from './Txt';

interface FormSelectProps {
  value?: string;
  options?: string[];
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

interface Anchor {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function FormSelect({
  value,
  options = [],
  onChange,
  placeholder = 'Selecciona…',
  style,
}: FormSelectProps) {
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor>({ x: 0, y: 0, w: 0, h: 0 });

  const openMenu = () => {
    if (!options.length) return;
    triggerRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, w, h });
      setOpen(true);
    });
  };

  return (
    <View style={style}>
      <Pressable
        ref={triggerRef}
        onPress={openMenu}
        style={[styles.box, open && styles.boxFocus]}>
        <Txt style={[styles.value, ...(value ? [] : [styles.placeholder])]} numberOfLines={1}>
          {value || placeholder}
        </Txt>
        <View style={open ? styles.chevUp : undefined}>
          <IconChevronDown size={18} color={theme.colors.textSecondary} strokeWidth={2} />
        </View>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
        <View
          style={[
            styles.menu,
            { position: 'absolute', top: anchor.y + anchor.h + 8, left: anchor.x, width: anchor.w },
          ]}>
          {options.map(opt => {
            const selected = opt === value;
            return (
              <Pressable
                key={opt}
                style={[styles.option, selected && styles.optionSel]}
                onPress={() => {
                  onChange?.(opt);
                  setOpen(false);
                }}>
                <Txt style={[styles.optionText, ...(selected ? [styles.optionTextSel] : [])]}>
                  {opt}
                </Txt>
                {selected ? <Txt style={styles.check}>✓</Txt> : null}
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingLeft: 14,
    paddingRight: 12,
    backgroundColor: theme.colors.surfaceSunken,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: 10,
  },
  boxFocus: { borderWidth: 1.5, borderColor: theme.colors.brandRedBorder },
  chevUp: { transform: [{ rotate: '180deg' }] },
  value: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: theme.colors.textPrimary },
  placeholder: { color: theme.colors.textTertiary },

  // Menú flotante (overlay)
  menu: {
    padding: 6,
    gap: 2,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
  },
  optionSel: { backgroundColor: theme.colors.brandRed + '24' },
  optionText: { fontFamily: fonts.body, fontSize: 14, color: theme.colors.textPrimary },
  optionTextSel: { fontFamily: fonts.label, color: theme.colors.brandRedBorder },
  check: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.brandRedBorder },
});
