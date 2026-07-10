# UBTAN

I created this website for my mother's salon, UBTAN, and wanted it to feel elegant, warm, and premium while still being easy to use. The goal was to build a digital space that reflects the salon's identity and gives visitors a calm, luxurious first impression.

The brand line behind this project is: "Blossom into a new u..."

## What this site includes

- A refined landing experience with polished motion and premium styling
- A service-focused layout that highlights the salon's offerings
- A gallery and review experience that helps build trust with visitors
- A private owner-managed content area for updating the service menu without exposing the editing flow publicly

## Tech stack

- React + TypeScript for the frontend experience
- Vite for fast local development and build tooling
- Express for the lightweight backend API
- SQLite for local content storage during development
- Tailwind CSS for the visual design system

## Project structure

- artifacts/ubtan-salon: frontend application
- artifacts/api-server: backend API
- lib: shared packages and supporting libraries

## Getting started

### 1. Install dependencies

From the repository root:

```bash
cd /Users/varunikarai/Desktop/Ubtan_website/UBTAN-Salon
pnpm install
```

### 2. Start the frontend app

Run the salon frontend from the app folder:

```bash
cd /Users/varunikarai/Desktop/Ubtan_website/UBTAN-Salon/artifacts/ubtan-salon
pnpm dev
```

The app will be available at:

```text
http://localhost:5173/
```

### 3. Start the backend API (optional)

If you also want the local API server running:

```bash
cd /Users/varunikarai/Desktop/Ubtan_website/UBTAN-Salon/artifacts/api-server
pnpm dev
```

### 4. Useful checks

To verify the frontend build locally:

```bash
cd /Users/varunikarai/Desktop/Ubtan_website/UBTAN-Salon/artifacts/ubtan-salon
pnpm build
```

## Notes

This project was built as a personal, brand-focused website for UBTAN and is intended to reflect the salon's atmosphere: thoughtful, elevated, and welcoming.

Thanks for Visiting!
