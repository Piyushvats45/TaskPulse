# TaskPulse
I built a distributed job queue system using Node.js, Redis (BullMQ), and MongoDB. Instead of processing heavy tasks synchronously, the system pushes jobs into a queue and processes them asynchronously using worker processes. It includes retry mechanisms, rate limiting, and real-time job status tracking.

### ENDPOINTS
- POST api/auth/register - Create account
- POST api/auth/login - Get JWT token
- POST api/auth/logout - Blacklist token
- GET /api/jobs - Create Job
- GET /api/jobs/:id - Get Job status

### TECHSTACK
- Node.js
- Express.js
- MongoDB
- JWT
- Token blacklisting
- REST API
- Redis

