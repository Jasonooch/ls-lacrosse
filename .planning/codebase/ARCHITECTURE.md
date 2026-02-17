# Architecture

**Analysis Date:** 2026-02-14

## Pattern Overview

**Overall:** Next.js Component Library Architecture

**Key Characteristics:**
- App Router-based Next.js 16 application
- Server-side rendering (RSC) first design
- Tailwind CSS v4 for styling with utility-first approach
- Shadcn/ui conventions for component organization
- Type-safe React components with TypeScript strict mode

## Layers

**Presentation Layer:**
- Purpose: Render UI components using React Server Components and client-side components
- Location: `components/`
- Contains: UI primitives, card components, composed layout components
- Depends on: Utility functions, Tailwind CSS, React
- Used by: App pages and other components

**Page/Route Layer:**
- Purpose: Define application pages and routing structure
- Location: `app/`
- Contains: Layout components (`layout.tsx`), page components, test routes
- Depends on: Presentation layer components
- Used by: Next.js router

**Utility Layer:**
- Purpose: Provide common utilities for className merging and styling
- Location: `lib/utils.ts`
- Contains: Class merging utilities using clsx and tailwind-merge
- Depends on: clsx, tailwind-merge
- Used by: All components

**Configuration Layer:**
- Purpose: Configure build tools, styling, and framework behavior
- Location: Configuration files at project root
- Contains: TypeScript config, Next.js config, PostCSS config, ESLint config
- Depends on: Framework defaults
- Used by: Build and development tooling

## Data Flow

**Component Composition Flow:**

1. Page route (`app/page.tsx`) defines the main layout
2. Page imports UI components (`Button`, `HeadingUnderline`) and card components (`EventCardSidebar`)
3. Components receive props as data inputs (title, location, dates, callbacks)
4. Components use `cn()` utility to merge Tailwind classes
5. Components render with CSS Variables for theming (`var(--primary)`, `var(--font-roboto-condensed)`)
6. Browser applies Tailwind and global styles

**State Management:**
- Minimal - primarily prop-based data flow
- Event callbacks handled at component level (`onInfoClick`)
- No external state management (Redux, Zustand, Context)
- No API data fetching in components

## Key Abstractions

**Component Model:**
- Purpose: Reusable UI building blocks with TypeScript interfaces
- Examples: `components/ui/button.tsx`, `components/ui/HeadingUnderline.tsx`, `components/cards/EventCardSidebar.tsx`
- Pattern: Function components with typed props interfaces, className extension via `cn()` utility

**Class Merging Utility:**
- Purpose: Merge CSS classes while handling Tailwind CSS conflicts
- Examples: `lib/utils.ts`
- Pattern: Higher-order function using clsx and tailwind-merge

**CSS Variables & Theming:**
- Purpose: Theme colors and fonts through CSS custom properties
- Examples: `--primary`, `--font-roboto-condensed`, `--font-geist-sans`, `--font-geist-mono`
- Pattern: Declared in `app/globals.css`, consumed in component inline styles

## Entry Points

**Application Entry:**
- Location: `app/layout.tsx`
- Triggers: Initial page load, server-side rendering
- Responsibilities: Define root HTML structure, load Google fonts, set metadata, apply CSS variables to HTML element

**Main Page:**
- Location: `app/page.tsx`
- Triggers: Navigation to `/` route
- Responsibilities: Compose page layout using UI components with grid layout, demonstrate component usage

**Test Page:**
- Location: `app/test/page.tsx`
- Triggers: Navigation to `/test` route
- Responsibilities: Simple test route for component verification (renders bare Button)

## Error Handling

**Strategy:** Not explicitly implemented

**Patterns:**
- No error boundaries detected
- No error state handling in components
- Components expect valid props and will fail silently or throw if invalid

## Cross-Cutting Concerns

**Logging:** Not detected - no logging framework present

**Validation:** Type-based validation through TypeScript interfaces at component boundaries

**Authentication:** Not applicable - no authentication layer present

**Styling:** Global CSS variables in `app/globals.css` + component-scoped Tailwind classes. Custom font loading via Next.js font optimization.

---

*Architecture analysis: 2026-02-14*
