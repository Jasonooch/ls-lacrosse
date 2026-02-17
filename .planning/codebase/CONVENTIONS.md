# Coding Conventions

**Analysis Date:** 2026-02-14

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `Button.tsx`, `EventCardSidebar.tsx`, `HeadingUnderline.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)
- Config files: lowercase with extensions (e.g., `eslint.config.mjs`, `next.config.ts`)
- Type definition files: `.d.ts` extension for global types (e.g., `next-env.d.ts`)

**Functions:**
- Named functions in components use PascalCase for component exports (e.g., `function Button()`, `export { Button }`)
- Utility functions use camelCase (e.g., `cn()`)
- Event handlers use camelCase with action prefix (e.g., `onInfoClick`)

**Variables:**
- camelCase for local variables and parameters (e.g., `className`, `children`, `startDate`)
- CONST_CASE for configuration constants (CSS variables like `--primary`, `--font-roboto-condensed`)
- Destructured parameters follow standard camelCase

**Types:**
- Interface names use PascalCase with "Props" suffix for component props (e.g., `ButtonProps`, `EventCardSidebarProps`, `HeadingUnderlineProps`)
- HTML attribute types extend standard React types (e.g., `React.ButtonHTMLAttributes<HTMLButtonElement>`)

## Code Style

**Formatting:**
- No explicit formatter configured (ESLint is used for linting only)
- Semicolons present at end of statements
- Single quotes for strings in most cases, following Next.js defaults
- 2-space indentation (observed in files)
- Line length appears unrestricted (inline styling can be long)

**Linting:**
- ESLint with Next.js configuration: `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Config file: `eslint.config.mjs` (modern flat config format)
- Linting command: `npm run lint` (runs `eslint`)
- Configured with TypeScript support via `eslint-config-next/typescript`

## Import Organization

**Order:**
1. React and external libraries (`import * as React from "react"`, `import type { ... } from "..."`)
2. Local utilities and helpers (`import { cn } from "@/lib/utils"`)
3. Local components (`import { Button } from "@/components/ui/button"`, `import { HeadingUnderline } from "@/components/ui/HeadingUnderline"`)

**Path Aliases:**
- `@/*` resolves to project root (configured in `tsconfig.json` at line 22: `"@/*": ["./*"]`)
- Used for all local imports (utilities, components, types)
- Enables clean import paths without relative `../../../` chains

**Import Style:**
- Named imports preferred: `import { Button } from "@/components/ui/button"`
- Namespace imports used for React: `import * as React from "react"`
- Type imports when needed: `import type { Metadata } from "next"`

## Error Handling

**Patterns:**
- No explicit error handling patterns observed in current codebase
- Components use optional callback props with `?:` syntax (e.g., `onInfoClick?: () => void`)
- No try/catch blocks in examined components
- UI rendering defaults (empty/null returns) not explicitly shown

## Logging

**Framework:** None detected
- No logging imports found in components or utilities
- No console usage patterns established
- Development happens without structured logging

## Comments

**When to Comment:**
- Block comments used sparingly but clearly for sections (e.g., `{/* Title */}` in JSX)
- Comments placed above or inline with the element they describe
- Typically used to denote sections within component renders

**JSDoc/TSDoc:**
- No JSDoc comments found in examined files
- Type safety via TypeScript interfaces serves as primary documentation
- Function signatures are self-documenting via typed parameters

## Function Design

**Size:** Functions kept reasonably small
- Component functions typically 20-40 lines
- Focused on single responsibility (render component or utility function)
- Decomposition into smaller components when needed

**Parameters:**
- Destructured object parameters preferred for component props (e.g., `{ title, location, className }`)
- Spread operator used to collect remaining props (e.g., `{ ...props }` for HTML attributes)
- Optional parameters marked with `?:` in interfaces

**Return Values:**
- Components return JSX elements (React.ReactNode-typed or implied)
- Utility functions return specific types (e.g., `cn()` returns string from twMerge)
- Explicit type annotations on function returns not required when inferred by TypeScript

## Module Design

**Exports:**
- Named exports preferred: `export { Button }`, `export function EventCardSidebar(...) { ... }`
- Default exports used for page components (e.g., `export default function Page()` in Next.js pages)
- Barrel files not extensively used in current structure

**Barrel Files:**
- No barrel file pattern observed (e.g., no `index.ts` re-exporting from a directory)
- Components imported directly from their files

## TypeScript Configuration

**Settings:**
- Target: ES2017 (line 3 of `tsconfig.json`)
- Strict mode enabled (line 7)
- JSX: react-jsx (line 14)
- Module resolution: bundler (line 11)
- No emit on compile (line 8)

**Type Safety:**
- React components typed with interfaces extending HTML attributes
- Props explicitly defined via interface definitions
- Children typed as `React.ReactNode` for flexibility

---

*Convention analysis: 2026-02-14*
