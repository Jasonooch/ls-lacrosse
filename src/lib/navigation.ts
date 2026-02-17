// lib/navigation.ts

import type { ReactNode } from "react";

export type NavItem = {
  title: string;
  href?: string;
  description?: string;
  items?: NavItem[]; // for nested dropdowns/accordions
};

export const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "News",
    href: "/news",
  },
  // {
  //   title: "Sub-Varsity",
  //   href: "/sub-varsity",
  // },
  {
    title: "Wematin",
    items: [
      {
        title: "Core Values",
        href: "/wematin",
        description: "Our guiding principles",
      },
      {
        title: "Wematin Sticks",
        href: "/wematin/wematin-sticks",
        description: "Mentorship and networking program",
      },
    ],
  },
  {
    title: "History",
    items: [
      {
        title: "Year-by-Year History",
        href: "/history/year-by-year-history",
        description: "Season recaps and archives",
      },
      {
        title: "All Americans",
        href: "/history/all-americans",
        description: "Honored players",
      },
      {
        title: "All Time Collegiate Players",
        href: "/history/all-time-collegiate-players",
        description: "Players who went on to college",
      },
      {
        title: "Hall of Fame",
        href: "/history/hall-of-fame",
        description: "Inductees and legacy",
      },
      {
        title: "Active Alumni",
        href: "/history/active-alumni",
        description: "Current involvement",
      },
    ],
  },
];

export const varsitySubnavItems: NavItem[] = [
  {
    title: "Schedule",
    href: "/varsity/schedule",
  },
  {
    title: "Roster",
    href: "/varsity/roster",
  },
  {
    title: "Coaches",
    href: "/varsity/coaches",
  },
];