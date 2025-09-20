# BMW ME9.2 Steuergeräte Platform

## Overview

This is a full-stack web application designed for managing BMW ME9.2 Engine Control Unit (ECU) files and educational resources. The platform serves as a comprehensive tool for BMW enthusiasts and professionals working with E-series models, providing file upload/management capabilities for XDF, BIN, and A2L files, along with tutorial video management and technical information resources.

The application targets BMW E-series vehicles (E46, E39, E60, E90, E87) and their associated engines (M54, N52, N54, M47), offering a specialized platform for ECU tuning and diagnostic file management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/UI components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Styling**: Custom BMW-themed design system with CSS variables and Tailwind utilities

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **File Handling**: Multer middleware for multipart/form-data file uploads with memory storage
- **API Design**: RESTful API with structured error handling and request logging
- **Development Server**: Vite middleware integration for hot module replacement in development

### Data Storage Solutions
- **Database**: PostgreSQL configured via environment variable
- **ORM**: Drizzle ORM with schema-first approach for type-safe database operations
- **Schema Location**: Shared schema definitions in `/shared/schema.ts` for type consistency
- **Migrations**: Drizzle Kit for database schema migrations
- **In-Memory Fallback**: Memory-based storage implementation for development/testing

### Database Schema Design
- **Files Table**: Stores ECU file metadata including original name, file type (XDF/BIN/A2L), BMW model, engine type, description, file size, and upload timestamp
- **Tutorials Table**: Manages YouTube tutorial videos with categories (basic, advanced, troubleshooting, tools), including extracted YouTube IDs and descriptions
- **Validation**: Zod schemas for runtime type checking and API request validation

### File Management System
- **Supported Formats**: XDF (definition files), BIN (binary ECU dumps), A2L (ASAM standard files)
- **File Validation**: Server-side file type validation based on file extensions
- **Size Limits**: 50MB maximum file size with client and server-side enforcement
- **Storage Strategy**: Files stored with UUID-based naming to prevent conflicts
- **Model-Specific Filtering**: Files can be filtered by BMW model for targeted browsing

### Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Basic session infrastructure present but not actively used
- **Security**: File upload restrictions and type validation as primary security measures

### External Dependencies
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Video Platform**: YouTube integration for tutorial embedding
- **Development Tools**: Replit-specific plugins for development environment integration
- **UI Components**: Comprehensive Radix UI component library for accessible interface elements

### API Structure
- **File Operations**: GET /api/files (with optional model filtering), POST /api/files (with multipart upload)
- **Tutorial Operations**: GET /api/tutorials, POST /api/tutorials, DELETE /api/tutorials/:id
- **Error Handling**: Centralized error middleware with structured JSON responses
- **Request Logging**: Automatic API request logging with response time tracking

### Development and Build Process
- **Development**: Concurrent client and server development with Vite HMR
- **Type Safety**: Shared TypeScript types between client and server
- **Build Process**: Separate client (Vite) and server (esbuild) build processes
- **Code Organization**: Clear separation between client, server, and shared code