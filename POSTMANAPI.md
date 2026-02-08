# Cosmic Watch API Specification

## Overview

Cosmic Watch is a backend service for monitoring Near-Earth Objects (NEOs), managing user authentication, and maintaining asteroid watchlists.
All endpoints return JSON unless otherwise stated.

# Authentication

Authentication is handled using JWT tokens.
Protected routes require:

```
Authorization: Bearer <token>
```

# Endpoints

## 1. Health Check

### GET /

Returns basic server status.
### Success Response — 200 OK

```json
"Hello World!"
```

# 2. Authentication
## 2.1 Register User
Create a new user account.

### Endpoint
```
POST /auth/register
```
### Content-Type
```
application/json
```
### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response — 201 Created
```json
{
  "message": "User registered successfully"
}
```

### Error Responses
**400 Bad Request** — Missing required field
```json
{
  "message": "Invalid input data"
}
```

## 2.2 Login User

Authenticate user and return JWT token.
### Endpoint
```
POST /auth/login
```
### Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response — 200 OK
```json
{
  "token": "jwt_token_here"
}
```

### Error Responses
**401 Unauthorized**
```json
{
  "message": "Invalid credentials"
}
```

# 3. NEO Feed

> All routes in this section require authentication.


## 3.1 Get NEO Feed
Retrieve list of Near-Earth Objects.
### Endpoint
```
GET /feed
```

### Headers
```
Authorization: Bearer <token>
```
### Success Response — 200 OK
```json
[
  {
    "id": "123",
    "name": "Asteroid XYZ",
    "magnitude": 22.1,
    "isHazardous": false
  }
]
```

## 3.2 Get NEO Details
Retrieve details of a specific Near-Earth Object.
### Endpoint

```
GET /feed/:id
```
### URL Parameter

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| id        | string | NEO unique identifier |

### Success Response — 200 OK
```json
{
  "id": "123",
  "name": "Asteroid XYZ",
  "magnitude": 22.1,
  "isHazardous": false,
  "approachDate": "2026-02-08"
}
```

### Error Responses
**404 Not Found**
```json
{
  "message": "NEO not found"
}
```

# 4. Alerts

> All routes require authentication.


## 4.1 Add to Watchlist
Add a Near-Earth Object to user's watchlist.

### Endpoint
```
POST /alerts/watch
```

### Request Body
```json
{
  "neoId": "123"
}
```

### Success Response — 200 OK
```json
{
  "message": "Asteroid added to watchlist"
}
```

## 4.2 Remove from Watchlist
Remove a Near-Earth Object from user's watchlist.

### Endpoint
```
POST /alerts/unwatch/:neoId
```

### URL Parameter
| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| neoId     | string | NEO unique identifier |

### Success Response — 200 OK
```json
{
  "message": "Asteroid removed from watchlist"
}
```

### Error Responses
**404 Not Found**
```json
{
  "message": "Asteroid not found in watchlist"
}
```

# Error Handling
All error responses follow this structure:
```json
{
  "message": "Error description"
}
```
