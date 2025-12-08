# APIMatic Platform - Architecture Overview

## Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type safety
- **Vite 5.4.21** - Build tool & dev server
- **TanStack Router 1.80.1** - File-based routing with lazy loading
- **Tailwind CSS 4.1.17** - Utility-first CSS (no config files!)

### Monorepo
- **pnpm** - Fast package manager with workspace support
- **Turborepo** - Build system (planned)

### Database
- **Prisma** - ORM for database access
- Schema includes: Users, Workspaces, Projects, API Specs, SDK Configs, etc.

## Project Structure

```
apimatic-platform-app/
├── apps/
│   └── web/                    # Main Vite + React app
│       ├── src/
│       │   ├── routes/         # File-based routes
│       │   │   ├── __root.tsx  # Root layout
│       │   │   ├── index.tsx   # Home page (/)
│       │   │   ├── login.tsx   # Login page (/login)
│       │   │   └── signup.tsx  # Signup page (/signup)
│       │   ├── styles/
│       │   │   └── app.css     # Tailwind v4 config
│       │   └── main.tsx        # App entry point
│       └── vite.config.ts      # Vite + Router + Tailwind plugins
│
├── packages/
│   ├── api/                    # API layer
│   │   ├── src/
│   │   │   ├── client/         # Browser-safe functions
│   │   │   │   └── auth.ts     # Mock auth (login, signup, getMe)
│   │   │   └── server-functions/ # TanStack Start functions (future)
│   │   │       └── auth.ts     # Real server auth (not used yet)
│   │   └── package.json        # Exports "./auth" → client/auth.ts
│   │
│   ├── auth-routes/            # Auth UI components
│   │   └── src/
│   │       ├── login.tsx       # Login page component
│   │       └── signup.tsx      # Signup page component
│   │
│   ├── ui/                     # Shared UI components
│   │   └── src/components/ui/  # Button, Input, Card, etc.
│   │
│   ├── config/                 # Shared configs
│   │   └── styles/
│   │       └── theme.css       # Tailwind theme (not used - inline in app.css)
│   │
│   └── db/                     # Prisma schema & client
│       └── prisma/schema.prisma
│
└── package.json                # Root workspace config
```

## Application Flow

### 1. **App Initialization**
```
index.html → main.tsx → RouterProvider → __root.tsx
```
- Vite serves `index.html`
- Loads `main.tsx` which creates TanStack Router
- Router uses auto-generated `routeTree.gen.ts`
- `__root.tsx` provides layout + DevTools

### 2. **Routing (File-Based)**
```
URL              File                    Component Source
/                index.tsx               Local
/login           login.tsx               @apimatic/auth-routes/login
/signup          signup.tsx              @apimatic/auth-routes/signup
```

**Lazy Loading Pattern:**
```tsx
// apps/web/src/routes/login.tsx
import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: lazyRouteComponent(() => import('@apimatic/auth-routes/login')),
})
```

### 3. **Authentication Flow (Current - Mock)**

**Login:**
```
User fills form → LoginPage component → login() from @apimatic/api/auth
  → Mock validation (zod) → Simulate 1s delay → Return mock user data
  → navigate({ to: result.redirectTo }) → Redirect to /dashboard
```

**SignUp:**
```
User fills form → SignUpPage component → signUp() from @apimatic/api/auth
  → Mock validation → Create mock user/workspace/project
  → navigate({ to: result.redirectTo }) → Redirect to /onboarding
```

**Current Implementation:**
- ✅ Client-side mock functions in `packages/api/src/client/auth.ts`
- ❌ No real backend/database connection yet
- ❌ No session persistence (refresh = logged out)
- 🔜 Replace mocks with real API calls when backend is ready

### 4. **Styling System (Tailwind v4)**

**Design Tokens:**
```css
/* apps/web/src/styles/app.css */
@import "tailwindcss";

@theme {
  --color-primary: hsl(240 5.9% 10%);
  --color-background: hsl(0 0% 100%);
  --radius-lg: 0.5rem;
}
```

**Usage:**
```tsx
<Button className="bg-primary text-primary-foreground rounded-lg">
  Click me
</Button>
```

**How It Works:**
- Tailwind v4 Vite plugin processes CSS
- `@theme` directive defines custom tokens
- No `tailwind.config.js` needed!
- Automatic dark mode via `@media (prefers-color-scheme: dark)`

### 5. **Component Import Flow**

```
auth-routes/src/login.tsx
  ↓ imports
ui/src/components/ui/ (Button, Input, Card, etc.)
  ↓ imports
@apimatic/api/auth (login function)
  ↓ imports
zod (validation)
```

## Key Patterns

### 1. **Package-Based Route Splitting**
Routes live in separate packages (`auth-routes`) and are lazy-loaded:
- ✅ Better code organization
- ✅ Automatic code splitting
- ✅ Reusable across multiple apps

### 2. **Workspace Dependencies**
```json
{
  "dependencies": {
    "@apimatic/api": "workspace:*",
    "@apimatic/ui": "workspace:*"
  }
}
```
- All packages linked via pnpm workspaces
- Changes reflect immediately (no rebuild needed)

### 3. **Export Mapping**
```json
// packages/auth-routes/package.json
{
  "exports": {
    "./login": "./src/login.tsx",
    "./signup": "./src/signup.tsx"
  }
}
```
Allows: `import LoginPage from '@apimatic/auth-routes/login'`

## Current State

### ✅ Working
- File-based routing with TanStack Router
- Lazy-loaded auth pages from package
- Tailwind v4 styling system
- UI component library
- Mock authentication flow
- TypeScript across all packages

### 🔜 TODO
- Connect to real backend API
- Implement session management
- Add protected routes
- Build dashboard pages
- Implement onboarding flow
- Add API spec upload/management
- SDK generation features

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server
cd apps/web
pnpm dev

# Access app
http://localhost:5173

# Routes available
/          - Home page
/login     - Login form (mock auth)
/signup    - Signup form (mock auth)
```

## Next Steps

1. **Setup Real Backend:**
   - Deploy API server (Node.js/Express or similar)
   - Connect Prisma to actual database
   - Update `packages/api/src/client/auth.ts` to call real endpoints

2. **Add Session Management:**
   - Store auth token (localStorage/cookie)
   - Add auth context provider
   - Implement protected routes

3. **Build Core Features:**
   - Dashboard
   - Project management
   - API spec upload
   - SDK configuration
   - Code generation

---

**Last Updated:** December 2024
