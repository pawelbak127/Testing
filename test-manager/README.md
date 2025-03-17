# Test Manager Application

A comprehensive application for managing test cases, test runs, and reports.

## Architecture

The application consists of two main components:

1. **Frontend**: Angular application
2. **Backend**: JSON Server REST API

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Docker and Docker Compose (optional, for containerized deployment)

## Development Setup

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the application:
   ```
   node server.js
   ```

   The backend will be available at http://localhost:8080/api

### Frontend

1. Navigate to the root directory and install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

   The frontend will be available at http://localhost:4200

## Docker Deployment

To run the entire application using Docker:

1. Build and start the containers:
   ```
   docker-compose up -d
   ```

2. Access the application at http://localhost:4200

3. To stop the containers:
   ```
   docker-compose down
   ```

## API Documentation

The backend API provides the following endpoints:

- `/api/projects` - CRUD operations for projects
- `/api/testCases` - CRUD operations for test cases
- `/api/testRuns` - CRUD operations for test runs
- `/api/reports` - CRUD operations for reports

## Features

- Project management
- Test case creation and management
- Test run execution and tracking
- Report generation
- Dashboard with analytics
