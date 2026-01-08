# Smart Lead Automation System

A complete MERN stack application that automates lead enrichment and CRM synchronization using the Nationalize.io API.

## Features

- **Lead Enrichment**: Automatically determine the most likely country for a given name
- **Batch Processing**: Process multiples names concurrently for efficiency
- **Status Classification**: Classify leads as "Verified" (>60% confidence) or "To Check" (≤60% confidence)
- **Real-time Dashboard**: View and filter leads in a responsive UI
- **Automated CRM Sync**: Background job that syncs verified leads to CRM every 5 minutes
- **Idempotency**: Prevents duplicate CRM sync operations

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Background Jobs**: node-cron
- **API**: Nationalize.io for country prediction

## Architecture

### Backend Architecture
```
.
├── controllers/           # Request handling logic
│   └── leadController.js
├── cron/                # Scheduled tasks
│   └── crm-sync.js
├── models/              # Database models
│   └── Lead.js
├── routes/              # API route definitions
│   └── leads.js
├── services/            # Business logic
│   └── leadService.js
├── .env                 # Environment variables
├── package.json
└── server.js            # Entry point
```

### Frontend Architecture
```
.
├── src/
│   ├── App.jsx          # Main application component
│   └── main.jsx         # React entry point
├── index.html
├── package.json
└── vite.config.js       # Vite configuration
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB connection (either local or cloud)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your MongoDB URI:
```env
MONGO_URI=mongodb+srv://rk4765505:Knb3QJ4YMEZZSjyV@cluster0.etpxc.mongodb.net/business-auth
PORT=5000
```

4. Start the backend server:
```bash
npm start
```
Or for development with auto-restart:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### POST /api/leads/process
Process a batch of names and enrich them with country data.

Request body:
```json
{
  "names": ["Peter", "Aditi", "Ravi", "Satoshi"]
}
```

Response:
```json
{
  "success": true,
  "message": "4 leads processed successfully",
  "data": [...]
}
```

### GET /api/leads
Retrieve all leads with optional status filtering.

Query parameters:
- `status`: Filter by status ("Verified" or "To Check")

Example: `GET /api/leads?status=Verified`

## Key Implementation Details

### Batch API Calls
- Uses `Promise.all()` for concurrent processing of multiple names
- Makes parallel requests to Nationalize.io API to avoid blocking
- Handles failures gracefully without stopping the entire batch

### Idempotency in CRM Sync
- Uses a `crmSynced` boolean flag in the database
- Background job only processes leads where `status === 'Verified' && crmSynced === false`
- Updates the flag atomically after successful processing
- Prevents duplicate CRM sync even if cron job runs multiple times

### Database Schema
```javascript
{
  name: String,           // Input name
  country: String,        // Predicted country code
  probability: Number,    // Confidence score (0-1)
  status: String,         // "Verified" or "To Check"
  crmSynced: Boolean,     // Whether lead has been synced to CRM
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

## How to Use

1. Enter comma-separated names in the input field (e.g., "Peter, Aditi, Ravi, Satoshi")
2. Click "Submit Names" to process the batch
3. View results in the table with country predictions and confidence scores
4. Filter results by status using the filter buttons
5. The cron job will automatically sync verified leads to CRM every 5 minutes

## Screenshots

### Database Entries Example
```
Name     | Country | Probability | Status     | CRM Synced
---------|---------|-------------|------------|------------
Peter    | US      | 0.85        | Verified   | false
Aditi    | IN      | 0.45        | To Check   | false
Ravi     | IN      | 0.92        | Verified   | true
Satoshi  | JP      | 0.78        | Verified   | false
```

### CRM Sync Log
```
[CRM Sync Job] Starting CRM sync process...
[CRM Sync Job] Found 2 verified leads to sync.
[CRM Sync] Sending verified lead Ravi to Sales Team...
[CRM Sync] Sending verified lead Satoshi to Sales Team...
[CRM Sync Job] Successfully synced 2 leads.
```

## Error Handling

- Graceful handling of Nationalize.io API failures
- Input validation for batch processing
- Database operation error handling
- Cron job error logging and recovery

## Production Considerations

- Add rate limiting for API calls
- Implement API key management for Nationalize.io
- Add request/response logging
- Set up monitoring and alerting
- Add caching for frequently requested names
- Implement proper authentication and authorization