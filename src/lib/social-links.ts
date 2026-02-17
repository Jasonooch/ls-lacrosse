import {
  SiInstagram,    // Only these three are actually included in bundle
  SiFacebook,
  SiX       // Note: X/Twitter is usually 'Twitter' or 'X' — check simpleicons.org
} from '@icons-pack/react-simple-icons'
import type { ComponentType } from 'react';

export interface SocialLink {
  name: string;
  href: string;
  icon: ComponentType<{ size?: number | string; className?: string }>;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "X",
    href: "https://x.com",
    icon: SiX,
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: SiFacebook,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: SiInstagram,
  },
];


