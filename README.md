# Authentication System (Node.js, Express, SQLite)

## Overview
This project is a simple authentication system using **Node.js, Express, and SQLite**. It includes user registration, login with JWT authentication, and role-based access control for users and admins.

## Features
- **User Registration**: Secure password hashing with bcrypt.
- **User Login**: Generates JWT tokens for authentication.
- **Role-Based Access**: Supports `user` and `admin` roles.
- **API Endpoints**:
  - `/api/auth/register` – Register a new user.
  - `/api/auth/login` – Authenticate and receive a JWT token.
  - `/api/diseases` – Fetch disease-related data.
  - `/api/herbs` – Fetch herb-related data.
  - `/api/fruits` – Fetch fruit-related data.
  - `/api/hospitals` – Fetch hospital information.

## Technologies Used
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Token), bcrypt
- **Frontend**: HTML, CSS, JavaScript (Fetch API for API calls)

## Installation & Setup
### Prerequisites
- Install [Node.js](https://nodejs.org/)
- Install SQLite3 (optional, as the project will auto-create the database file)

### Steps to Run the Project
1. **Clone the Repository**:
   ```sh
   git clone https://github.com/yourusername/auth-system.git
   cd auth-system
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```env
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

4. Start the Server:
   ```sh
   npm start
   ```
   The API will be available at `http://localhost:5000`.

5. **Run Frontend (HTML Pages)**:
   - Open `register.html` and `login.html` in a browser.
   - Ensure the API server is running.

## API Endpoints
| Method | Endpoint            | Description       |
|--------|---------------------|-------------------|
| POST   | `/api/auth/register` | Register a user  |
| POST   | `/api/auth/login`    | User login       |
| GET    | `/api/diseases`      | Fetch diseases   |
| GET    | `/api/herbs`         | Fetch herbs      |
| GET    | `/api/fruits`        | Fetch fruits     |
| GET    | `/api/hospitals`     | Fetch hospitals  |

## Project Structure
```
/auth-system
│── models/        # Database connection & models
│── routes/        # API route handlers
│── public/        # Frontend files (HTML, CSS, JS)
│── server.js      # Main server file
│── .env           # Environment variables
│── package.json   # Dependencies & scripts
```

License
This project is licensed under the **MIT License**.

Contact
For any questions or issues, feel free to create an issue or reach out to this account.

