/**
 * Catálogo de redes sociales soportadas (modal OB-07 + perfil OB-04b).
 * Compartido entre RedesSocialesScreen y CompletarPerfilScreen.
 */
import React from 'react';
import {
  IconBrandTiktok,
  IconBrandFacebook,
  IconBrandYoutube,
  IconBrandX,
  IconBrandTwitch,
  IconWorld,
  type IconProps,
} from '@/design-system/icons';
import { theme } from '@/design-system/theme';

export interface SocialNetwork {
  key: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  color: string;
}

export const NETWORKS: SocialNetwork[] = [
  { key: 'tiktok', label: 'TikTok', icon: IconBrandTiktok, color: theme.colors.textPrimary },
  { key: 'facebook', label: 'Facebook', icon: IconBrandFacebook, color: '#1877f2' },
  { key: 'youtube', label: 'YouTube', icon: IconBrandYoutube, color: '#ff0000' },
  { key: 'x', label: 'X', icon: IconBrandX, color: theme.colors.textPrimary },
  { key: 'twitch', label: 'Twitch', icon: IconBrandTwitch, color: '#9146ff' },
  { key: 'web', label: 'Sitio web', icon: IconWorld, color: theme.colors.textSecondary },
];

export const getNetwork = (key: string) => NETWORKS.find(n => n.key === key);

/** Una red agregada al perfil. */
export interface AddedSocial {
  networkKey: string;
  handle: string;
}
