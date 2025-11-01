BookIt: Experiences & Slots
This is a complete end-to-end web application built for a full-stack internship assignment. The project allows users to browse travel experiences, view available dates and time slots, select a quantity, and complete a secure booking. The application is built from scratch based on a provided Figma design, with a focus on real-world API integration, database transactions, and a clean, responsive UI.

🚀 Live Demo (Placeholders)
Frontend (Vercel): [Your Deployed Frontend Link Here]

Backend (Railway/Render): [Your Deployed Backend Link Here]

✨ Features
Browse & Search: View all travel experiences in a responsive 4-column grid. Filter experiences by title, location, or description using the search bar.

View Details: A pixel-perfect, dynamic details page for each experience.

Slot Selection: Choose from 5 available dates and 4 daily time slots.

Real-time Availability: View remaining spots for each slot (e.g., (2 left), Sold out).

Quantity Control: Select the number of spots to book, with + and - buttons that respect the available stock for the chosen slot.

Promo Code Validation: Enter a promo code (SAVE10, FLAT100) at checkout to validate it against the API and receive a discount.

Secure Booking: A backend-driven booking process that uses PostgreSQL transactions to check for stock and create a booking in a single, safe operation, preventing double-booking.

Confirmation Page: A dynamic success or failure page shown after a booking attempt.

Local Image Hosting: The backend server hosts and serves all experience images.

🛠️ Tech Stack
Frontend: React, TypeScript, Vite, TailwindCSS

Backend: Node.js, Express, TypeScript

Database: PostgreSQL

ORM: Prisma (for type-safe queries, migrations, and seeding)

Routing: React Router DOM

API Client: Axios

Validation: Zod (for backend request validation)

Local Development Setup
Prerequisites
Node.js (v18 or later recommended)

Git

A free PostgreSQL database URL (e.g., from Aiven, Supabase, or Railway)

1. Clone the Repository
Bash

git clone https://github.com/your-username/bookit-assignment.git
cd bookit-assignment
2. Set Up the Backend (server)
Navigate to the server directory:

Bash

cd server
Install all dependencies:

Bash

npm install
Set up environment variables: Create a file named .env in the server directory and add your database URL:

Code snippet

DATABASE_URL="postgresql://user:password@host:port/dbname"
Run database migrations: This will create all the tables (Experience, Slot, Booking).

Bash

npx prisma migrate dev
(Optional) Set up local images: Place your 8 experience images (e.g., kayaking.jpg) inside the server/public/images/ folder. The seed script is already configured to use these paths.

Seed the database: This will populate the database with 8 experiences and all their slots.

Bash

npm run seed
3. Set Up the Frontend (client)
Open a new terminal and navigate to the client directory:

Bash

cd client
Install all dependencies:

Bash

npm install
Set up environment variables: Create a file named .env.local in the client directory. This tells the frontend where to find the backend server.

Code snippet

VITE_API_URL=http://localhost:4000
4. Run the Application
You need to run both servers at the same time.

Terminal 1 (Backend):

Bash

cd server
npm run dev
(Server will be running at http://localhost:4000)

Terminal 2 (Frontend):

Bash

cd client
npm run dev
(Client will be running at http://localhost:5173)

Open http://localhost:5173 in your browser.

📖 API Endpoints
GET /api/health: Health check.

GET /api/experiences: Get all experiences. Supports ?search=query param for filtering.

GET /api/experiences/:id: Get a single experience by ID, including its slots.

POST /api/promo/validate: Validates a promo code.

POST /api/bookings: Creates a new booking after checking for slot availability and quantity.