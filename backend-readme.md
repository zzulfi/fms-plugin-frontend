# FMS Auction Backend API

A comprehensive Node.js Express backend API for managing sports festival auctions with real-time team bidding, participant management, and role-based access control.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- MongoDB 4.4+
- Firebase project (for real-time features)

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd fms-plugin-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## 📋 Table of Contents
- [Environment Configuration](#environment-configuration)
- [Authentication](#authentication)
- [User Management](#user-management)
- [Team Management](#team-management)
- [Section Management](#section-management)
- [Participant Management](#participant-management)
- [Group Management](#group-management)
- [Auction Management](#auction-management)
- [Real-time Features](#real-time-features)
- [Frontend Integration](#frontend-integration)
- [Error Handling](#error-handling)
- [Security](#security)

## 🔧 Environment Configuration

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/fms-auction

# JWT Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=24h

# Firebase Configuration (for real-time features)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"your-project-id","private_key_id":"key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYour Firebase private key here\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com","client_id":"client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com"}'

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🔐 Authentication

### Base URL
```
http://localhost:3000/api
```

### Signup
```http
POST /auth/signup
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "SecurePassword123!",
    "displayName": "Admin User",
    "phoneNumber": "+1234567890",
    "role": "admin",
    "team": "team-id-for-team-managers" // Optional, required for team-manager role
}
```

**Roles:**
- `admin`: Full system access
- `team-manager`: Can manage assigned teams and auctions
- `user`: Read-only access to public information

**Response:**
```json
{
    "user": {
        "uid": "generated-user-id",
        "email": "admin@example.com",
        "displayName": "Admin User",
        "phoneNumber": "+1234567890",
        "role": "admin",
        "team": null,
        "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "SecurePassword123!"
}
```

**Response:** Same as signup

### Get Current User Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

### Set User Role (Admin Only)
```http
PATCH /auth/users/:userId/role
Authorization: Bearer <token>
Content-Type: application/json

{
    "role": "team-manager"
}
```

## 👥 User Management

### Get User Permissions
```http
GET /auth/permissions
Authorization: Bearer <token>
```

**Response:**
```json
{
    "canCreateAuction": true,
    "canStartAuction": true,
    "canEndAuction": true,
    "canManageUsers": true,
    "canAssignRoles": true
}
```

### Get All Users (Admin Only)
```http
GET /auth/users
Authorization: Bearer <token>
```

**Response:**
```json
[
    {
        "uid": "nc1z1zdb5",
        "email": "admin@example.com",
        "displayName": "Admin User",
        "phoneNumber": "+1234567890",
        "role": "admin",
        "team": null,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
        "uid": "abc123def",
        "email": "manager@example.com",
        "displayName": "Team Manager",
        "phoneNumber": "+9876543210",
        "role": "team-manager",
        "team": {
            "_id": "team-id",
            "name": "Team Warriors"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
]
```

## 🏆 Team Management

### Create Team
```http
POST /teams
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Team Warriors",
    "logoUrl": "https://example.com/logo.png", // Optional
    "colorCode": "#FF0000" // Optional
}
```

### Get All Teams
```http
GET /teams
Authorization: Bearer <token>
```

### Get Team by ID
```http
GET /teams/:id
Authorization: Bearer <token>
```

### Update Team
```http
PATCH /teams/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Updated Team Name",
    "logoUrl": "https://example.com/new-logo.png",
    "colorCode": "#00FF00"
}
```

### Delete Team
```http
DELETE /teams/:id
Authorization: Bearer <token>
```

## 📚 Section Management

### Create Section
```http
POST /sections
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Senior Secondary"
}
```

### Get All Sections
```http
GET /sections
```

### Update Section
```http
PATCH /sections/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Updated Section Name"
}
```

### Delete Section
```http
DELETE /sections/:id
Authorization: Bearer <token>
```

## 👤 Participant Management

### Create Single Participant
```http
POST /participants
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "dob": "2000-01-15",
    "gender": "MALE", // "MALE" or "FEMALE"
    "section": "section-id",
    "group": "group-id", // Optional
    "admNo": "ADM001",
    "chestNo": "CH001",
    "avatar": "https://example.com/avatar.jpg", // Optional
    "achievements": ["Achievement 1", "Achievement 2"], // Optional
    "skills": ["Skill 1", "Skill 2"], // Optional
    "isActive": true
}
```

### Bulk Create Participants
```http
POST /participants/bulk
Authorization: Bearer <token>
Content-Type: application/json

[
    {
        "name": "Participant 1",
        "email": "p1@example.com",
        "section": "section-id",
        // ... other fields
    },
    {
        "name": "Participant 2",
        "email": "p2@example.com",
        "section": "section-id",
        // ... other fields
    }
]
```

### Get All Participants (with filtering and pagination)
```http
GET /participants
Authorization: Bearer <token>
```

**Available Filters (Query Parameters):**

**Basic Filters:**
```http
GET /participants?section=section-id
GET /participants?group=group-id  
GET /participants?team=team-id
GET /participants?isActive=true
GET /participants?hasTeam=false
GET /participants?gender=MALE
```

**String Search (Case-insensitive, Partial Match):**
```http
GET /participants?name=john
GET /participants?email=example.com
GET /participants?phone=123
GET /participants?admNo=ADM001
GET /participants?chestNo=CH001
```

**Array Filters (Contains):**
```http
GET /participants?achievements=football
GET /participants?skills=leadership
```

**Date Filters:**
```http
GET /participants?dob=2000-01-15
```

**Pagination Parameters:**
```http
# Page-based pagination (default: page=1, limit=10)
GET /participants?page=2&limit=20

# Offset-based pagination
GET /participants?offset=50&limit=25

# Sorting (default: sortBy=createdAt, sortOrder=desc)
GET /participants?sortBy=name&sortOrder=asc
GET /participants?sortBy=email&sortOrder=desc

# Combined pagination and sorting
GET /participants?page=1&limit=15&sortBy=name&sortOrder=asc
```

**Available Sort Fields:**
- `createdAt` (default)
- `updatedAt`
- `name`
- `email`
- `admNo`
- `chestNo`
- `dob`

**Multiple Filters with Pagination (Combined with AND logic):**
```http
GET /participants?section=section-id&gender=MALE&isActive=true&page=1&limit=10&sortBy=name&sortOrder=asc
```

**Example Response:**
```json
{
    "data": [
        {
            "_id": "participant-id",
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890",
            "section": "section-id",
            "group": "group-id",
            "gender": "MALE",
            "isActive": true,
            "hasTeam": false,
            "team": null,
            "admNo": "ADM001",
            "chestNo": "CH001",
            "dob": "2000-01-15T00:00:00.000Z",
            "avatar": null,
            "achievements": ["football", "basketball"],
            "skills": ["leadership", "teamwork"],
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 50,
        "itemsPerPage": 10,
        "hasNextPage": true,
        "hasPreviousPage": false,
        "nextPage": 2,
        "previousPage": null
    }
}
```

### Get Participant by ID
```http
GET /participants/:id
Authorization: Bearer <token>
```

### Update Participant
```http
PATCH /participants/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Updated Name",
    "phone": "+9876543210"
}
```

### Delete Participant
```http
DELETE /participants/:id
Authorization: Bearer <token>
```

## 👥 Group Management

### Create Group
```http
POST /groups
Authorization: Bearer <token>
Content-Type: application/json

{
    "key": "group_type",
    "value": "senior_secondary",
    "description": "Group for senior secondary students"
}
```

**Response:**
```json
{
    "_id": "group-id",
    "key": "group_type",
    "value": "senior_secondary",
    "description": "Group for senior secondary students",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get All Groups
```http
GET /groups
Authorization: Bearer <token>
```

**Response:**
```json
[
    {
        "_id": "group-id",
        "key": "group_type",
        "value": "senior_secondary",
        "description": "Group for senior secondary students",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
]
```

### Get Group by ID
```http
GET /groups/:id
Authorization: Bearer <token>
```

### Update Group
```http
PATCH /groups/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "key": "updated_group_type",
    "value": "junior_secondary", 
    "description": "Updated description for the group"
}
```

### Delete Group
```http
DELETE /groups/:id
Authorization: Bearer <token>
```

## 🎯 Auction Management

### Create Auction
```http
POST /auctions
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Football Players Auction",
    "description": "Annual football team selection",
    "section": "section-id", // Use "All" for all sections
    "timer": 60, // Optional: bidding timer in seconds
    "extraTime": 10, // Optional: extra time in seconds
    "firstTeamsOrder": ["team1-id", "team2-id", "team3-id"] // Team bidding order
}
```

### Add Authorized Managers
```http
POST /auctions/:auctionId/managers
Authorization: Bearer <token>
Content-Type: application/json

{
    "managerIds": ["manager1-id", "manager2-id"]
}
```

### Get All Auctions
```http
GET /auctions
Authorization: Bearer <token>
```

### Get Auction by ID
```http
GET /auctions/:id
Authorization: Bearer <token>
```

### Update Auction
```http
PATCH /auctions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Updated Auction Name",
    "description": "Updated description",
    "timer": 90,
    "firstTeamsOrder": ["team1-id", "team2-id", "team3-id", "team4-id"]
}
```

### Start Auction
```http
POST /auctions/:id/start
Authorization: Bearer <token>
Content-Type: application/json

{
    "accessCode": "ABC123"
}
```

**Prerequisites:**
- Auction must have `firstTeamsOrder` containing ALL teams in the system
- User must be admin with valid access code
- Changes auction status to "live" and creates Firebase real-time entry

### End Auction
```http
POST /auctions/:id/end
Authorization: Bearer <token>
Content-Type: application/json

{
    "accessCode": "ABC123"
}
```

### Verify Access Code
```http
POST /auctions/:id/verify-access
Authorization: Bearer <token>
Content-Type: application/json

{
    "accessCode": "ABC123"
}
```

### Revoke Access Code
```http
POST /auctions/:id/revoke-access
Authorization: Bearer <token>
```

### Regenerate Access Code
```http
POST /auctions/:id/regenerate-access
Authorization: Bearer <token>
```

## ⚡ Real-time Features (Firebase Integration)

### Update Team with Participant
```http
POST /auctions/:id/update-team-with-auction
Authorization: Bearer <token>
```

**How it works:**
1. Gets `selectedParticipant` from Firebase `/currentAuctions/{auctionId}/selectedParticipant`
2. If `selectedParticipant` is "skip", skips turn and moves to next team
3. If `selectedParticipant` is a participant ID, assigns participant to current team
4. Waits 3 seconds then rotates to next team
5. Updates Firebase with new team order

### Firebase Real-time Structure
```json
{
  "currentAuctions": {
    "auction-id": {
      "team": {
        "currentTeam": "team1-id",
        "nextTeam": "team2-id"
      },
      "selectedParticipant": "participant-id-or-skip",
      "timestamp": 1234567890
    }
  }
}
```

## 🌐 Frontend Integration

### Authentication Flow
```javascript
// Login
const loginUser = async (email, password) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }
    throw new Error(data.message);
};

// Set authorization header for subsequent requests
const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});
```

### Auction Management Example
```javascript
// Start auction
const startAuction = async (auctionId, accessCode) => {
    const response = await fetch(`/api/auctions/${auctionId}/start`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ accessCode })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    
    return await response.json();
};

// Update team with participant
const updateTeamWithParticipant = async (auctionId) => {
    const response = await fetch(`/api/auctions/${auctionId}/update-team-with-auction`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    
    return await response.json();
};
```

### Firebase Real-time Integration
```javascript
// Initialize Firebase (frontend)
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const firebaseConfig = {
    // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Listen to auction updates
const listenToAuction = (auctionId, callback) => {
    const auctionRef = ref(database, `currentAuctions/${auctionId}`);
    return onValue(auctionRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
};

// Set selected participant
const setSelectedParticipant = async (auctionId, participantId) => {
    const participantRef = ref(database, `currentAuctions/${auctionId}/selectedParticipant`);
    await set(participantRef, participantId);
};

// Skip turn
const skipTurn = async (auctionId) => {
    await setSelectedParticipant(auctionId, 'skip');
};
```

### Complete Auction Flow Example
```javascript
class AuctionManager {
    constructor() {
        this.currentAuction = null;
        this.unsubscribe = null;
    }
    
    async startAuction(auctionId, accessCode) {
        try {
            // Start the auction via API
            await startAuction(auctionId, accessCode);
            
            // Listen to real-time updates
            this.unsubscribe = listenToAuction(auctionId, (data) => {
                this.handleAuctionUpdate(data);
            });
            
            this.currentAuction = auctionId;
        } catch (error) {
            console.error('Failed to start auction:', error);
            throw error;
        }
    }
    
    handleAuctionUpdate(data) {
        if (data) {
            console.log('Current team:', data.team.currentTeam);
            console.log('Next team:', data.team.nextTeam);
            console.log('Selected participant:', data.selectedParticipant);
            
            // Update UI accordingly
            this.updateUI(data);
        }
    }
    
    async selectParticipant(participantId) {
        if (this.currentAuction) {
            await setSelectedParticipant(this.currentAuction, participantId);
            // The backend will handle the rest automatically
        }
    }
    
    async skipCurrentTurn() {
        if (this.currentAuction) {
            await skipTurn(this.currentAuction);
        }
    }
    
    async confirmSelection() {
        if (this.currentAuction) {
            await updateTeamWithParticipant(this.currentAuction);
        }
    }
    
    cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}
```

## 🛠️ Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created successfully
- `207`: Multi-status (partial success in bulk operations)
- `400`: Bad request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found
- `500`: Internal server error

### Error Response Format
```json
{
    "message": "Descriptive error message",
    "errors": [ // Optional, for validation errors
        {
            "field": "email",
            "message": "Email is already in use"
        }
    ]
}
```

### Common Error Scenarios
1. **Authentication Errors**
   - Invalid credentials
   - Expired token
   - Missing authorization header

2. **Permission Errors**
   - Insufficient role permissions
   - Unauthorized team access
   - Invalid access code

3. **Validation Errors**
   - Required fields missing
   - Invalid data format
   - Duplicate unique fields

4. **Business Logic Errors**
   - Auction not in correct state
   - Participant already assigned
   - Invalid team order configuration

## 🔒 Security

### JWT Token Structure
```json
{
    "uid": "user-id",
    "email": "user@example.com",
    "role": "admin",
    "team": {
        "_id": "team-id",
        "name": "Team Name"
    },
    "iat": 1234567890,
    "exp": 1234567890
}
```

### Role-Based Access Control

| Feature | Admin | Team Manager | User |
|---------|-------|--------------|------|
| Create/Manage Auctions | ✅ | ❌ | ❌ |
| Start/End Auctions | ✅ | ❌ | ❌ |
| Manage Participants | ✅ | ❌ | ❌ |
| Manage Teams | ✅ | ❌ | ❌ |
| Update Team Assignments | ✅ | ✅* | ❌ |
| View Auction Details | ✅ | ✅* | ✅ |
| Assign User Roles | ✅ | ❌ | ❌ |

*Only for current team or authorized auctions

### Security Features
- JWT-based authentication
- Role-based authorization
- Input validation and sanitization
- CORS protection
- Rate limiting (recommended)
- Environment variable protection
- MongoDB injection prevention
- Password hashing with bcrypt

## 📊 Data Models

### User
```typescript
{
    uid: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    photoURL?: string;
    role: 'admin' | 'team-manager' | 'user';
    team?: ObjectId; // Team reference for team managers
    createdAt: Date;
    updatedAt: Date;
}
```

### Team
```typescript
{
    _id: ObjectId;
    name: string; // Unique
    logoUrl?: string;
    colorCode?: string;
    createdAt: Date;
    updatedAt: Date;
}
```

### Participant
```typescript
{
    _id: ObjectId;
    name: string;
    email: string; // Unique
    phone?: string;
    dob: Date;
    gender: 'MALE' | 'FEMALE';
    section: ObjectId; // Section reference
    group?: ObjectId; // Group reference
    team?: ObjectId; // Team reference (assigned during auction)
    hasTeam: boolean;
    admNo?: string;
    chestNo?: string;
    avatar?: string;
    achievements?: string[];
    skills?: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
```

### Auction
```typescript
{
    _id: ObjectId;
    name: string;
    description?: string;
    section: ObjectId | 'All'; // Section reference or "All"
    timer?: number; // Bidding timer in seconds
    extraTime?: number; // Extra time in seconds
    firstTeamsOrder: ObjectId[]; // Team bidding order
    status: 'upcoming' | 'live' | 'ended';
    accessCode: string; // 6-character code
    authorizedManagers: ObjectId[]; // User references
    createdBy: ObjectId; // User reference
    createdAt: Date;
    updatedAt: Date;
}
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fms-auction
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"your-project","private_key_id":"key-id","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@your-project.iam.gserviceaccount.com","client_id":"client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40your-project.iam.gserviceaccount.com"}'
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Health Check Endpoint
```http
GET /health
```

Response:
```json
{
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 3600,
    "database": "connected",
    "firebase": "connected"
}
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for troubleshooting

---

**Note:** This API is designed specifically for sports festival auction management systems. Ensure proper environment configuration and security measures before deploying to production.
