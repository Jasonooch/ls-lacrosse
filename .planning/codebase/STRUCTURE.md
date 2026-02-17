# Codebase Structure

**Analysis Date:** 2026-02-14

## Directory Layout

```
my-components/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Home page with component showcase
│   ├── test/
│   │   └── page.tsx        # Test route for component verification
│   └── globals.css         # Global styles, CSS variables, Tailwind config
├── components/             # Reusable React components
│   ├── ui/                 # UI primitives and base components
│   │   ├── button.tsx      # Button component with Tailwind styling
│   │   └── HeadingUnderline.tsx  # Styled heading component
│   ├── cards/              # Composite card components
│   │   └── EventCardSidebar.tsx  # Event card for sidebar display
│   └── news-story/         # News story components (empty directory)
├── lib/                    # Utility functions and helpers
│   └── utils.ts            # Class merging utility (cn)
├── css/                    # Additional CSS (currently empty)
├── public/                 # Static assets
├── .vscode/                # VS Code workspace configuration
├── .git/                   # Git repository
├── .next/                  # Build output (generated)
├── node_modules/           # Dependencies (generated)
├── package.json            # NPM dependencies and scripts
├── package-lock.json       # NPM lockfile
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
├── postcss.config.mjs      # PostCSS configuration for Tailwind
├── eslint.config.mjs       # ESLint configuration
├── components.json         # Shadcn/ui configuration
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
└── next-env.d.ts          # TypeScript declarations (generated)
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router structure - pages, layouts, and global styling
- Contains: Route segments, page components, layout definitions, CSS
- Key files: `layout.tsx` (root), `page.tsx` (home), `globals.css` (theming)

**`components/`:**
- Purpose: Organize all React components by category
- Contains: UI primitives, composite cards, feature-specific components
- Key files: All component exports

**`components/ui/`:**
- Purpose: Small, reusable UI primitives used across the application
- Contains: Basic components like buttons, headings, inputs (typically from shadcn/ui or custom)
- Key files: `button.tsx`, `HeadingUnderline.tsx`

**`components/cards/`:**
- Purpose: Composite card components combining UI primitives
- Contains: Larger components for specific use cases
- Key files: `EventCardSidebar.tsx` (event display card)

**`components/news-story/`:**
- Purpose: News story related components (not yet implemented)
- Contains: Currently empty, reserved for future news components
- Key files: None

**`lib/`:**
- Purpose: Utility functions and helper modules
- Contains: Pure functions, utilities, constants
- Key files: `utils.ts` (class merging)

**`css/`:**
- Purpose: Additional CSS files beyond globals (currently unused)
- Contains: Potentially component-specific CSS or theme variations
- Key files: None currently

**`public/`:**
- Purpose: Static assets served at root URL
- Contains: Images, fonts, manifests, favicons
- Key files: None examined

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout - defines HTML structure, loads fonts, sets metadata
- `app/page.tsx`: Home page route - main showcase page
- `app/test/page.tsx`: Test route - for component verification

**Configuration:**
- `tsconfig.json`: TypeScript compiler options with path aliases (`@/*` → root)
- `next.config.ts`: Next.js configuration (currently minimal)
- `postcss.config.mjs`: PostCSS plugins for Tailwind CSS v4
- `eslint.config.mjs`: ESLint extends Next.js core-web-vitals and TypeScript configs
- `components.json`: Shadcn/ui configuration for component generation

**Core Logic:**
- `lib/utils.ts`: `cn()` function for className merging

**Global Styling:**
- `app/globals.css`: CSS variables, Tailwind theme, dark mode variants

## Naming Conventions

**Files:**
- PascalCase for React components: `Button.tsx`, `HeadingUnderline.tsx`, `EventCardSidebar.tsx`
- camelCase for utilities and helpers: `utils.ts`
- camelCase for page routes: `page.tsx`, `layout.tsx`
- Descriptive names reflecting component purpose

**Directories:**
- kebab-case for category directories: `news-story`, `components/ui/`
- Semantic names reflecting content: `cards`, `ui`, `lib`, `app`

**Components:**
- PascalCase for exported component names: `export function Button`, `export { HeadingUnderline }`
- Props interfaces named as `{ComponentName}Props`: `ButtonProps`, `HeadingUnderlineProps`
- Default exports for page routes, named exports for reusable components

## Where to Add New Code

**New Feature:**
- Primary code: `components/{category}/{FeatureName}.tsx`
- Tests: Not yet established (no test files present)
- Import in consuming page: `app/{route}/page.tsx`

**New Component/Module:**
- UI primitives: `components/ui/{ComponentName}.tsx`
- Composite cards: `components/cards/{CardName}.tsx`
- Feature-specific: `components/{feature}/{ComponentName}.tsx`
- Utilities: `lib/{utilityName}.ts`

**New Page/Route:**
- Create directory structure: `app/{route}/page.tsx`
- Optional layout: `app/{route}/layout.tsx`
- Import components from `components/`

**Utilities:**
- Shared helpers: `lib/utils.ts` or create new file `lib/{name}.ts`
- Import pattern: `import { utilName } from "@/lib/utils"`

**Styling:**
- Component-scoped Tailwind: Use `className` prop and `cn()` for class merging
- Global theme: Modify CSS variables in `app/globals.css`
- Custom CSS: Add to `css/` directory if needed (not currently used)

## Special Directories

**`.next/`:**
- Purpose: Build output and Next.js internal files
- Generated: Yes
- Committed: No (in `.gitignore`)

**`node_modules/`:**
- Purpose: Installed NPM dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in `.gitignore`)

**`.vscode/`:**
- Purpose: VS Code workspace settings and extensions
- Generated: No (manually maintained)
- Committed: Yes

**`.env`:**
- Purpose: Environment variables for local development
- Generated: No
- Committed: Likely no (should be in `.gitignore`)

## Import Path Aliases

Path alias defined in `tsconfig.json`:
- `@/*` maps to project root

**Usage Examples:**
- `import { cn } from "@/lib/utils"`
- `import { Button } from "@/components/ui/button"`
- `import { EventCardSidebar } from "@/components/cards/EventCardSidebar"`

This allows clean imports from any component level without relative path traversal.

---

*Structure analysis: 2026-02-14*
