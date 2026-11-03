# BookNest

> A modern community library platform for discovering, sharing, and borrowing books.

BookNest is a full-featured Next.js frontend for a connected reading community. Users can discover books, view detailed information, share books with the library, manage their own collection, and keep track of borrowed books from a responsive, accessible interface.

## Live Demo

Visit the deployed application: **[booknest-client-seven.vercel.app](https://booknest-client-seven.vercel.app/)**

## Screenshots

### Home page

![BookNest home page](./public/screenshots/home-page.png)

### All books

![BookNest all books page](./public/screenshots/all-books.png)

### My borrows

![BookNest my borrows page](./public/screenshots/my-borrows.png)

## Features

- **Book discovery** — Browse the complete catalog, search by title or author, filter by category, and sort results.
- **Book details** — View detailed information and request to borrow an available book.
- **Community collection** — Add books with metadata and an optional JPG/PNG cover image.
- **Personal library** — View, search, filter, and manage books shared by the signed-in user.
- **Borrowing dashboard** — See borrowed books, borrowing dates, return deadlines, and return books.
- **Authentication** — Email/password sign-up and sign-in with Better Auth.
- **Social authentication** — Google and Facebook provider support through Better Auth.
- **Account recovery** — Password reset emails powered by Resend.
- **Protected routes** — Authenticated access is enforced for member-only pages.
- **Responsive UI** — Mobile-first layouts with reusable UI primitives, toast notifications, and polished loading/error states.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| Authentication | Better Auth with JWT plugin |
| Database adapter | MongoDB adapter for Better Auth |
| Icons and UI | Lucide React, Tabler Icons, custom UI primitives |
| Feedback | Sonner/toast notifications |
| Email | Resend |
| Image handling | Next.js Image |
| Development | ESLint, React Compiler, Turbopack |

## Application Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Landing page with featured/new arrivals and onboarding guidance | Public |
| `/all-books` | Browse, search, filter, and sort the book catalog | Public |
| `/all-books/[id]` | View a book and start a borrowing request | Public |
| `/sign-in` | Sign in to an existing account | Public |
| `/sign-up` | Create a new account | Public |
| `/forgot-password` | Request a password reset email | Public |
| `/reset-password` | Set a new account password | Authenticated flow |
| `/profile` | View and update account information | Protected |
| `/add-books` | Add a book to the shared library | Protected |
| `/my-books` | Manage books shared by the current user | Protected |
| `/my-borrows` | View and return borrowed books | Protected |

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A running BookNest backend API
- A MongoDB database for Better Auth
- A Resend account/API key for password reset emails
- OAuth credentials if Google or Facebook sign-in is enabled

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/billalhossain404/booknest-client.git
cd booknest-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL, without a trailing slash
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_DB_URL=mongodb://127.0.0.1:27017/booknest

# Password reset email
RESEND_API_KEY=re_xxxxxxxxx

# Optional social authentication
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
```

Do not commit `.env.local` or any other environment file. The repository ignores `.env*` files by default.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend API Contract

The frontend communicates with the backend using `NEXT_PUBLIC_API_URL`. The backend should provide the following resources:

| Method | Endpoint | Used for |
| --- | --- | --- |
| `GET` | `/all-books` | Load the catalog and new arrivals |
| `GET` | `/all-books/:id` | Load a single book |
| `POST` | `/add-books` | Add a book for the authenticated owner |
| `GET` | `/my-books/:userId` | Load books owned by the current user |
| `POST` | `/bookings` | Create a borrowing request |
| `GET` | `/my-bookings/:email` | Load the current user's borrowed books |
| `DELETE` | `/all-bookings/:id` | Return a borrowed book |

Book creation and borrowing requests use the Better Auth JWT token in the `Authorization` header. Ensure the backend validates that token and enforces ownership rules server-side.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

## Project Structure

```text
src/
├── app/
│   ├── (auth)/                 # Authentication and account pages
│   ├── all-books/              # Catalog and book details
│   ├── add-books/              # Add-book form
│   ├── my-books/               # User's shared collection
│   ├── my-borrows/             # Borrowing history and returns
│   ├── api/auth/[...all]/      # Better Auth API handler
│   ├── globals.css             # Global styles and design tokens
│   ├── layout.tsx              # Root layout, navigation, footer, metadata
│   └── page.tsx                # Home page
├── components/                 # Shared pages, sections, booking, and UI
├── lib/
│   ├── auth.ts                 # Server-side Better Auth configuration
│   ├── auth-client.ts          # Client-side auth helpers
│   └── getTokenFrom*.ts        # Auth token utilities
└── proxy.ts                    # Protected route session guard
```

## Authentication Notes

Better Auth stores users and sessions through MongoDB and exposes its handler at `/api/auth/*`. Email/password authentication is enabled, while email verification is configured for sign-up. Password reset messages are sent using Resend. The session uses a JWT-backed cookie cache with a three-day lifetime.

The frontend proxy protects member routes, but authorization must also be enforced by the backend for every protected API request.

## Deployment

1. Configure all production environment variables in the hosting provider.
2. Set `NEXT_PUBLIC_API_URL` to the deployed backend URL.
3. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` to the deployed frontend URL.
4. Add the production frontend URL to the Google/Facebook OAuth redirect configuration when social login is enabled.
5. Build and start the application:

   ```bash
   npm run build
   npm run start
   ```

BookNest can be deployed to any Node.js-compatible hosting platform. Vercel is also supported for standard Next.js deployments.

## Contributing

1. Create a feature branch from the default branch.
2. Keep changes focused and follow the existing TypeScript and component patterns.
3. Run `npm run lint` and `npm run build`.
4. Open a pull request with a concise description of the change and its validation.

## License

No license has been declared for this repository yet. Contact the repository owner before redistributing or using the project commercially.
