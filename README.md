# UBTAN Salon Website

A premium, luxury-focused salon website for UBTAN with elegant animations, a polished service experience, and owner-managed content sections.

## Features

- Premium landing page with refined scroll animation and luxe styling
- Services section with a private owner-editable menu
- Review and gallery sections backed by a lightweight API and local SQLite data store
- Booking and gallery modals for the public-facing experience

## Project structure

- artifacts/ubtan-salon: Vite + React frontend
- artifacts/api-server: Express API backend
- lib: shared API client and database packages

## Getting started

### 1. Install dependencies

From the repository root:

```bash
npm install
```

### 2. Start the API server

```bash
cd artifacts/api-server
npm run dev
```

### 3. Start the frontend

In a separate terminal:

```bash
cd artifacts/ubtan-salon
npm run dev
```

The frontend will be available at http://localhost:5173 and the API will run on the configured port.

## Owner access

The private services-management panel can be unlocked with the owner access code:

```text
ubtan2026
```

## Notes

The services, reviews, and gallery content are stored through the API using a local SQLite database for local development and demo purposes.
