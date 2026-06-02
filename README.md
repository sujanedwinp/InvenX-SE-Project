# InvenX (Internal Inventory Management System)

InvenX is an Internal Inventory Management System designed to streamline inventory tracking and management. This project is built using the MERN stack (MongoDB, Express, React, Node.js).

## Tech Stack

- **Frontend**: React (Vite), TailwindCSS (if applicable), Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)

## Features

- User Authentication (Login/Register)
- Inventory Management (CRUD operations)
- Secure API endpoints protected by JWT

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sujanedwinp/InvenX-SE-Project
cd InvenX
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/invenx
JWT_SECRET=your_super_secret_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

## Project Structure

- `backend/`: Contains the Node.js/Express API, models, controllers, and routes.
- `frontend/`: Contains the React application created with Vite.

## Scripts

### Backend
- `npm run dev`: Runs the server with Nodemon.
- `npm start`: Runs the server in production mode.
- `npm run user:create`: Helper script to create an initial user.

### Frontend
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
