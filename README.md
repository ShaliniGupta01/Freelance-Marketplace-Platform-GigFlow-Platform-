# Freelance Marketplace Platform
# Client Info:
(1) email:client@test.com
password:123456

(2) email:rak12@gmail.com
password:aa1234

#Freelancer Info:
(1) email:free@gmail.com
password:456

(2) email: sona@gmail.com
password: 789



A **full-stack freelance marketplace** built with the **MERN stack** (MongoDB, Express, React, Node.js). This platform allows clients to post gigs/projects and hire freelancers, while freelancers can submit bids, deliver work, and receive reviews.

## Features

- **User Authentication & Profiles**
  - JWT-based signup/login.
  - Role-based access (client or freelancer).
- **Gig Management**
  - Clients can create, update, and delete gigs.
  - Each gig includes title, description, price, and delivery time.
- **Bidding & Hiring**
  - Freelancers can submit bids for gigs.
  - Clients can view bids and hire freelancers.
  - Status tracking for proposals (pending, hired, completed).
- **Reviews & Ratings**
  - Clients can review completed gigs.
  - Duplicate reviews are handled gracefully.
- **Dashboard**
  - Clients see their posted gigs and received bids.
  - Freelancers see available gigs and submitted proposals.
- **Responsive UI**
  - Clean interface with React and Tailwind CSS.

## Tech Stack

- **Frontend:** React, Vite, Redux Toolkit, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT  
- **State Management:** Redux Toolkit + Context API  
- **API:** RESTful endpoints for gigs, bids, reviews, and users

## Project Structure

my-project/
├─ backend/ # Node + Express backend
├─ frontend/ # React + Vite frontend
├─ package.json
├─ README.md
└─ .gitignore

bash
Copy code

## Installation

1. Clone the repository:

```bash
git clone https://github.com/username/my-project.git
cd my-project
Install dependencies:

bash
Copy code
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
Run development servers:

bash
Copy code
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
Build frontend for production:

bash
Copy code
cd frontend
npm run build
Serve frontend via backend or deploy separately.
