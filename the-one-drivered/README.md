# The One DriverEdOS

This repository contains a minimal, functional prototype for a national driver education platform. It demonstrates the architecture proposed in the system design and includes both a FastAPI backend and a Vite/React frontend.

## Project Structure

```
the-one-drivered/
├── backend/       # FastAPI application
│   ├── app/
│   │   ├── api/   # API routers (auth, students)
│   │   ├── core/  # Configuration and security utilities
│   │   ├── rules/ # State-specific rules and registry
│   │   └── services/  # In-memory user service
│   └── requirements.txt
├── frontend/      # Vite + React application
│   └── src/
│       ├── pages/      # Top-level pages (Login, Dashboard)
│       ├── components/ # Reusable components
│       ├── auth/       # Auth hooks and helpers
│       └── lib/        # API client
└── README.md
```

## Backend

The backend is built with **FastAPI**. For demonstration purposes, it uses an in-memory store for users and students. Authentication is handled via JWTs; a token is returned from the `/api/auth/login` endpoint when valid credentials are supplied.

To run the backend locally:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

This will start the API on `http://localhost:8000`. A simple health check is available at `/api/health`.

### Default Users

Two users are preconfigured for demonstration:

- **admin** / **admin**
- **student** / **student**

## Frontend

The frontend is powered by **Vite** and **React**. It includes a simple login page and a dashboard that lists students. The authentication token is stored in local storage and attached to API requests.

To run the frontend locally:

```bash
cd frontend
npm install
npm run dev
```

This will start the development server on `http://localhost:5173` (or the next available port). Make sure the backend is running so the frontend can communicate with the API.

## Deploying

This prototype is designed for deployment to services like Railway (backend) and Vercel (frontend). Update environment variables and configuration files appropriately before deployment.

## Disclaimer

This is a proof-of-concept implementation meant for demonstration and development purposes only. It is not a complete production system. Additional work is required to handle persistent storage, multi-tenancy, comprehensive state rules, funding integrations, and robust security.