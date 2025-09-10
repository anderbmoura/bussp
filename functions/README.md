# Firebase Functions

This directory contains the Firebase Cloud Functions for the bussp project.

## Setup

1. Install dependencies:
   ```bash
   cd functions
   npm install
   ```

2. Copy environment configuration:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase project configuration
   ```

3. Update Firebase project ID in `.firebaserc` in the root directory

## Available Functions

### HTTP Functions
- `helloWorld` - Simple hello world function for testing
- `getBusData` - Retrieve bus data from Firestore
- `updateBusLocation` - Update bus location coordinates

### Firestore Triggers
- `createUserProfile` - Triggered when a new user document is created

## Development

1. Build the functions:
   ```bash
   npm run build
   ```

2. Run locally with emulators:
   ```bash
   npm run serve
   ```

3. Deploy to Firebase:
   ```bash
   npm run deploy
   ```

## Project Structure

```
functions/
├── src/
│   └── index.ts          # Main functions file
├── .env.example          # Environment variables template
├── .eslintrc.js         # ESLint configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## API Endpoints (after deployment)

- `GET /helloWorld` - Test endpoint
- `GET /getBusData` - Get all bus data
- `POST /updateBusLocation` - Update bus location
  ```json
  {
    "busId": "bus123",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
  ```