# MovieApp - Full Stack Movie Application

A complete movie application with user authentication, search functionality, favorites, and watchlist features.

## Features

- User authentication (register, login)
- Browse trending movies
- Search for movies
- View movie details
- Add movies to favorites
- Add movies to watchlist
- User profile management
- Responsive design

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- React Toastify for notifications

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- TMDB API integration

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB installed locally or MongoDB Atlas account
- TMDB API key

### Backend Setup
1. Navigate to the backend directory:
   \`\`\`
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file in the backend directory with the following variables:
   \`\`\`
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   TMDB_API_KEY=your_tmdb_api_key
   \`\`\`

4. Start the backend server:
   \`\`\`
   npm run dev
   \`\`\`

### Frontend Setup
1. Navigate to the frontend directory:
   \`\`\`
   cd frontend
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file in the frontend directory:
   \`\`\`
   REACT_APP_API_URL=http://localhost:5000/api
   \`\`\`

4. Start the frontend development server:
   \`\`\`
   npm start
   \`\`\`

## Deployment

### Backend
- Deploy to Render or Heroku

### Frontend
- Deploy to Netlify

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Movies
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/search?query=` - Search movies
- `GET /api/movies/details/:id` - Get movie details
- `GET /api/movies/genres` - Get movie genres
- `GET /api/movies/genre/:id` - Get movies by genre

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/favorites` - Get user favorites
- `GET /api/users/watchlist` - Get user watchlist

### Favorites
- `POST /api/movies/favorites/:id` - Add movie to favorites
- `DELETE /api/movies/favorites/:id` - Remove movie from favorites

### Watchlist
- `POST /api/movies/watchlist/:id` - Add movie to watchlist
- `DELETE /api/movies/watchlist/:id` - Remove movie from watchlist
