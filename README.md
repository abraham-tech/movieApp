# Let's create the README file for the user's Movie App project.

readme_content = """
# Movie App - Backend API

## Overview
This is a simple Express.js-based backend API for a movie application. The API serves data to the frontend and handles common operations like fetching, adding, updating, and deleting movie data. The app is built with Node.js, Express.js, and integrates environment variables for configuration.

## Requirements
- Node.js
- npm or yarn
- MongoDB (or other configured database)

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd movie-app-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:

   Create a `.env` file in the root of the project and configure the following environment variables:

    ```env
    PORT=3000
    APP_IS_RUNNING="Server is running on port"
    NOT_FOUND_STATUS_CODE=404
    MESSAGE="message"
    RESOURSE_NOT_FOUND="Resource not found"
    ```

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

- Base URL: `/api`

### Example Endpoints:
- `GET /api/movies` - Get a list of all movies.
- `POST /api/movies` - Add a new movie.
- `PUT /api/movies/:id` - Update a movie.
- `DELETE /api/movies/:id` - Delete a movie.

## CORS Configuration
The app allows requests from `http://localhost:4200`, which can be modified as per the frontend host.

```javascript
app.use("/api", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  next();
});
