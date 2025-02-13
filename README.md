# AetherHR - Local Development Setup

A Next.js application with MongoDB, Redis, and WorkOS authentication.

## Prerequisites

- Node.js 18.x or higher
- Docker and Docker Compose
- Git

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/AIAgentsNSUT/dashboard
cd dashboard
npm install
```

### 2. Environment Setup

1. Copy the environment example file:

```bash
cp .env.example .env.local
```

2. Configure WorkOS (Required for Authentication):

   - Create an account at [WorkOS Dashboard](https://dashboard.workos.com)
   - Create a new workspace
   - Get your Client ID and API Key
   - Create a test organization
   - Update `.env.local` with your WorkOS credentials:
   - Add the redirect uri in the redirects tab
     ```
     WORKOS_CLIENT_ID=<your-client-id>
     WORKOS_API_KEY=<your-api-key>
     NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/api/auth/workos
     WORKOS_COOKIE_PASSWORD=<generate-secure-password>
     WORKOS_TEST_ORG_ID=<your-test-org-id>
     ```

3. Database Configuration:
   - The default configuration in `.env.local` should work for local development:
     ```
     MONGO_ROOT_USERNAME=admin
     MONGO_ROOT_PASSWORD=password123
     MONGO_DATABASE=aetherhr
     MONGODB_URI=mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@localhost:27017/${MONGO_DATABASE}?authSource=${MONGO_ROOT_USERNAME}
     REDIS_URL=redis://localhost:6379
     ```

### 3. Start Dependencies

1. Start MongoDB and Redis using Docker Compose:

```bash
docker-compose up -d
```

2. Initialize MongoDB:

```bash
chmod +x init-mongodb.sh
./init-mongodb.sh
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [WorkOS Documentation](https://workos.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
