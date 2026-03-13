# BitChat

BitChat is a real-time chat application built with **React**, **Vite**, and **Convex**. It supports authenticated users, chat rooms, and a modern UI with Tailwind-based styling.

## Tech stack

- React 19
- Vite
- Convex (backend + auth + presence)
- Tailwind CSS and shadcn/ui-style components
- TypeScript

## Getting started

### Prerequisites

- Node.js 18+ and npm
- A Convex project (see `convex/` directory)

### Install dependencies

```bash
npm install
```

### Run in development

This runs both the frontend (Vite) and backend (Convex) together:

```bash
npm run dev
```

If the Convex dev server is not already configured, see `convex/` and `setup.mjs` for any project-specific setup.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Scripts reference

These come from `package.json`:

- `npm run dev`: Run frontend and backend in parallel.
- `npm run dev:frontend`: Run Vite dev server.
- `npm run dev:backend`: Run Convex dev server.
- `npm run build`: Type-check (`tsc -b`) and build with Vite.
- `npm run lint`: Type-check and run ESLint.
- `npm run preview`: Preview the production build with Vite.

## Contributing

1. Create a new branch for your changes.
2. Run `npm run lint` and `npm run build` to ensure everything passes.
3. Open a pull request and describe your changes clearly.

## License

This project is currently unlicensed. If you intend to open source it, add a proper license file (for example, MIT, Apache-2.0) and update this section.
