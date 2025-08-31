# Overview

This is a multilingual conversation starter application that provides thoughtfully curated questions to help people connect in various social situations. The application displays random questions in multiple languages with filtering options by mood (funny, caring, warm, etc.) and occasion (first meetup, team meeting, family dinner, etc.). Built as a full-stack TypeScript application with a React frontend and Express backend, it features a modern UI using shadcn/ui components and Tailwind CSS styling.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for question retrieval with query parameter filtering
- **Error Handling**: Centralized error middleware with structured error responses
- **Request Logging**: Custom middleware for API request/response logging

## Data Storage
- **Database**: PostgreSQL configured through Drizzle ORM
- **ORM**: Drizzle with TypeScript-first schema definitions
- **Migrations**: Drizzle Kit for database schema management
- **Schema Validation**: Drizzle-Zod integration for runtime type safety
- **Development Storage**: In-memory storage implementation for development/testing

## Database Schema
- **Questions Table**: Stores questions with mood, occasion, and multilingual translations as JSONB
- **Shared Types**: TypeScript types generated from Drizzle schema definitions

## External Dependencies
- **Database Provider**: Neon Database (PostgreSQL) via @neondatabase/serverless
- **UI Components**: Comprehensive Radix UI component collection for accessible primitives
- **Validation**: Zod for schema validation and type inference
- **Date Handling**: date-fns for date manipulation utilities
- **Styling Utilities**: clsx and class-variance-authority for conditional styling
- **Development Tools**: Replit-specific plugins for development environment integration
