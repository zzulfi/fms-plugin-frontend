# API Services Architecture

This document describes the restructured API services architecture for the FMS Plugin Frontend application.

## Overview

The API services have been restructured from a single monolithic `api.service.ts` file to a feature-based service architecture that follows the project's separation of concerns principle.

## Architecture

### Base Service
- **HttpService** (`/src/shared/services/base/http.service.ts`)
  - Base class providing common HTTP methods (GET, POST, PATCH, DELETE)
  - Handles authentication tokens automatically
  - Centralized error handling and request configuration

### Feature Services

#### Authentication (`/src/features/auth/services/`)
- **AuthService** (`auth.service.ts`)
  - User login and signup
  - Profile management
  - Token handling (automated through HttpService)

#### Admin Features (`/src/features/admin/services/`)
- **TeamService** (`team.service.ts`)
  - Team CRUD operations
  - Team member management
  
- **ParticipantService** (`participant.service.ts`)
  - Participant CRUD operations
  - Bulk operations and filtering
  
- **SectionService** (`section.service.ts`)
  - Section management
  - Section-related operations
  
- **GroupService** (`group.service.ts`)
  - Group management within sections
  - Group-specific operations

#### Auction Features (`/src/features/auction/services/`)
- **AuctionService** (`auction.service.ts`)
  - Auction management
  - Bid operations
  - Auction lifecycle management

#### Team Manager Features (`/src/features/team-manager/services/`)
- **WishListService** (`wishlist.service.ts`)
  - Wishlist management
  - Priority-based participant selection

## Benefits

1. **Separation of Concerns**: Each service handles a specific domain
2. **Maintainability**: Smaller, focused service files are easier to maintain
3. **Reusability**: Services can be easily imported where needed
4. **Type Safety**: Each service has its own TypeScript interfaces
5. **Testing**: Individual services can be tested in isolation

## Usage

### Direct Import
```typescript
import { authService } from '../../features/auth/services';
import { teamService, participantService } from '../../features/admin/services';
```

### Central Import (Optional)
```typescript
import { authService, teamService, participantService } from '../../shared/services';
```

## Migration from Old Architecture

The old monolithic `api.service.ts` has been replaced with:
- Component imports updated to use feature-specific services
- AuthContext updated to use AuthService
- All TypeScript interfaces moved to service files
- Error handling and loading states maintained

## TypeScript Interfaces

Each service exports its own interfaces:
- Request/Response types
- Domain model interfaces
- Service-specific types

This provides better type safety and reduces coupling between features.