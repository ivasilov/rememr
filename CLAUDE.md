# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rememr is a bookmark management application built as a monorepo with two main applications:
- **Web App**: Next.js 15 application with React 19, Supabase backend, TailwindCSS styling
- **Browser Extension**: Plasmo-based Chrome/Firefox extension for bookmark capture

## Architecture

The project uses a **monorepo structure** managed by pnpm workspaces and Turbo:
- `apps/web/` - Next.js web application
- `apps/extension/` - Browser extension
- `packages/` - Shared packages (UI components, utilities)
- `supabase/` - Database schema, migrations, and configuration

### Web Application Architecture
- **Framework**: Next.js 15 with App Router and React Server Components
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: Supabase Auth
- **Styling**: TailwindCSS 4.0 with shadcn/ui components
- **State Management**: TanStack Query for server state, React Hook Form for forms
- **AI Integration**: OpenAI integration for bookmark analysis

### Key Data Models
- **Bookmarks**: Core entity with URL, title, description, tags, and sessions
- **Tags**: Hierarchical tagging system for bookmark organization
- **Sessions**: Browsing session tracking for contextual bookmarks
- **Users**: Supabase auth users with RLS policies

## Development Commands

### Root Level
```bash
# Install dependencies
pnpm install

# Format code
pnpm run fix:prettier

# Clean all node_modules
pnpm run clean

# Database migrations
pnpm run migration:create
```

### Web App (`apps/web/`)
```bash
# Development server with Turbopack
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start

# Linting
pnpm run lint

# Type checking
pnpm run test:types

# Generate database types from Supabase
pnpm run generate:types
```

### Browser Extension (`apps/extension/`)
```bash
# Development mode
pnpm run dev

# Build extension
pnpm run build

# Package for distribution
pnpm run package

# Generate database types
pnpm run generate:types
```

### Database Development

Supabase is used for the backend with migrations in `supabase/migrations/`. The main tables are:
- `bookmarks` - Main bookmark storage
- `tags` - Tag definitions with hierarchical structure
- `bookmark_tags` - Many-to-many relationship
- `sessions` - Browsing session tracking

Database types are auto-generated to `src/lib/database.types.ts` using `supabase gen types`.

## Code Conventions

Follow the existing patterns established in `.cursorrules`:
- Use **kebab-case** for component filenames (e.g., `my-component.tsx`)
- Prefer **React Server Components** and Next.js SSR features
- Minimize **client components** (`'use client'`) to isolated, interactive components
- Always include **loading and error states** for data fetching
- Use **semantic HTML elements**
- Focus on **readability over performance**

### File Organization
- Server components in `app/` directory using App Router conventions
- Reusable components in `components/` directory
- Database queries and mutations co-located with components
- Shared utilities in `lib/` directory

## Development Workflow

1. **Type Generation**: Run `generate:types` after database schema changes
2. **Development**: Use `pnpm run dev` in respective app directories
3. **Type Checking**: Always run `test:types` before committing
4. **Code Formatting**: Use `fix:prettier` to format code
5. **Database Changes**: Create migrations with `migration:create`

## Package Management

- Uses **pnpm** as package manager with workspace configuration
- **Turbo** for build orchestration and caching
- React 19 with TypeScript 5.1 across all packages
- Shared UI components via `@rememr/ui` workspace package