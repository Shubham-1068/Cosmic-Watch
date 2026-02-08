# WORKING_AND_IMPLEMENTATION


## 1. Introduction
Cosmic Watch is a full-stack web application that monitors Near-Earth Objects (NEOs) using live data from NASA’s NeoWs API.

This document explains how the system works internally, how components interact, and how key features are implemented across the frontend, backend, and database layers.

The architecture follows a clean separation of concerns:

Frontend → UI, visualization, interaction
Backend → Business logic, risk analysis, authentication
Database → Persistent user and alert data
External API → NASA NeoWs asteroid data

## 2. System Architecture Overview

Cosmic Watch follows a three-tier architecture:
Presentation Layer (Next.js Frontend)
Application Layer (Node.js + Express Backend)
Data Layer (PostgreSQL Database)
External data is fetched from NASA NeoWs and processed before being exposed to the frontend.

Data Flow

Frontend sends request to backend.
Backend validates authentication (if required).
Backend fetches asteroid data from NASA NeoWs API.
Backend applies risk analysis logic.
Processed data is returned to frontend.
Frontend renders interactive dashboard and visualizations.

## 3. Frontend Implementation (Next.js + TypeScript)
### 3.1 Structure

The frontend is built using Next.js (App Router) with TypeScript for type safety and maintainability.

Key directories:

app/ → Pages and routing
components/ → Reusable UI components
lib/ → API interaction layer
hooks/ → Custom React hooks

### 3.2 Authentication Handling

On login, backend returns a JWT.
Token is stored in localStorage.
Token is attached to protected API requests via Authorization header.
Protected routes validate user session before rendering content.

Example:
Authorization: Bearer <JWT_TOKEN>

### 3.3 API Integration Layer

The lib/api.ts module:

Centralizes all API calls
Handles token injection
Normalizes backend responses
Manages error handling
This avoids repetitive fetch logic across components.

### 3.4 Dashboard Rendering

The dashboard:

Fetches asteroid feed
Displays summary metrics
Allows sorting and filtering
Displays risk indicators using color-coded badges
State management is handled using React hooks with memoization to optimize rendering.

## 4. Backend Implementation (Node.js + Express)
### 4.1 Server Architecture

The backend is built with:

Express.js for routing
JWT for authentication
bcrypt for password hashing
node-cron for scheduled tasks
Socket.io for real-time communication

The backend is responsible for:
User authentication
Risk score calculation
Watchlist management
Alert generation
NASA API integration

## 5. Authentication System
### 5.1 Registration

User submits registration data.
Password is hashed using bcrypt.
User record is stored in PostgreSQL.
Success response returned.

### 5.2 Login

Credentials are validated.
Password hash comparison performed.
JWT token generated.
Token returned to frontend.

### 5.3 Protected Routes

Middleware verifies:

JWT validity
Token expiration
User existence in database
If validation fails → 401 Unauthorized.

## 6. NASA NeoWs API Integration

Backend connects to:
NASA NeoWs API (Near Earth Object Web Service)

Endpoints used:
Feed endpoint (date range)
Lookup endpoint (asteroid ID)

Implementation Steps

Backend sends request to NASA.
Raw JSON response received.
Relevant asteroid data extracted:

Diameter
Velocity
Miss distance
Close approach date
Hazard flag

Data transformed into simplified format.
Risk analysis applied.
Final structured response sent to frontend.

This ensures frontend never handles raw NASA data directly.

## 7. Risk Analysis Engine

The risk engine converts scientific parameters into a simplified score.

Factors Considered
Estimated diameter
Relative velocity
Miss distance
NASA hazardous classification

Risk Score Logic
Each factor contributes weighted points.

Example logic:

Larger diameter → higher risk weight
Smaller miss distance → higher risk weight
Hazard flag → immediate score boost

The final numerical score is mapped to categories:

Low Risk
Moderate Risk
High Risk

This abstraction allows non-technical users to understand asteroid danger levels without scientific expertise.

## 8. Watchlist & Alert System
### 8.1 Watchlist

When a user saves an asteroid:

Asteroid ID stored in watchlist table
Linked to user ID
Unique constraint prevents duplicates

###8.2 Scheduled Monitoring

Using node-cron:

Background job runs at fixed intervals
Re-checks watched asteroids
Applies risk evaluation
Compares against user-defined alert conditions

If conditions met:

Notification record created
Stored in database
Displayed in user dashboard

## 9. 3D Visualization (Three.js)

The 3D module:

Renders Earth at center
Creates simplified orbital paths
Animates asteroid movement
Uses WebGL for hardware acceleration

Optimization strategies:

Memoized calculations
Reduced polygon complexity
Efficient render loop

This feature enhances spatial understanding without heavy physics simulation.

## 10. Database Design (PostgreSQL)

Core tables:

Users
id
email
password_hash
created_at
Watchlist
id
user_id
asteroid_id
Notifications
id
user_id
asteroid_id
message
created_at

ORM (Prisma or Sequelize) abstracts raw SQL and enforces schema validation.

## 11. Real-Time Communication (Optional Feature)

Socket.io enables:

Live chat functionality
Instant dashboard updates
Real-time alert delivery
Connection secured using token validation.

## 12. Containerization & Deployment

Cosmic Watch uses Docker and docker-compose.

Services:

Frontend container
Backend container
PostgreSQL container

To start entire system:

docker-compose up --build


Benefits:

Environment consistency
Easy local setup
Simplified deployment pipeline

## 13. Security Considerations

Password hashing using bcrypt
JWT expiration handling
Protected API routes
CORS configuration
Input validation and sanitization
Environment variables for secrets
Sensitive keys (NASA API, JWT secret, DB credentials) are never hardcoded.

## 14. Performance Considerations

API response transformation on backend
Frontend memoization
Lazy-loaded components
Optimized 3D rendering
Efficient database indexing

The architecture supports scalability for additional features.

## 15. Conclusion

Cosmic Watch demonstrates a complete full-stack implementation that combines:

Secure authentication
External API integration
Risk modeling logic
Real-time monitoring
Interactive 3D visualization
Containerized deployment

The system transforms complex astronomical datasets into accessible, structured, and meaningful insights.
It is designed to be scalable, secure, and suitable for both hackathon submission and real-world expansion.