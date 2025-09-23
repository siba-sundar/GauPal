# GauPal Authentication Service

This project provides an authentication service using Firebase for user signup, login, profile management, and logout functionalities. The service is built using Express.js and Firebase Admin SDK.

## Features

- User Signup
- User Login
- User Logout
- Get User Profile
- Update User Profile

## Setup

### Prerequisites

- Node.js
- Firebase Admin SDK
- Firebase Project

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/GauPal.git
   cd GauPal
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up Firebase Admin SDK:

   - Obtain your Firebase service account key file from the Firebase Console.
   - Save the key file in the project directory and name it `serviceAccountKey.json`.

4. Create a `.env` file in the project root and add your Firebase project configuration:
   ```env
   FIREBASE_DATABASE_URL= your-database-url
   ```

## Usage

### Running the Server

Start the server using the following command:

```sh
npm start
```

The server will run on `http://localhost:5001` unless mentioned.

### API Endpoints for Authentication

#### Public Routes

- **POST gaupal/auth/signup**: User signup
- **POST gaupal/auth/login**: User login

#### Protected Routes

- **POST gaupal/auth/logout**: User logout (requires token)
- **GET gaupal/auth/profile**: Get user profile (requires token)
- **PUT gaupal/auth/profile**: Update user profile (requires token)

### Example Requests

#### Signup

```sh
curl -X POST http://localhost:5001/gaupal/auth/signup -H "Content-Type: application/json" -d '{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "1234567890",
  "userType": "user",
  "address": "123 Main St"
}'
```

#### Login

```sh
curl -X POST http://localhost:3000gaupal/auth/login -H "Content-Type: application/json" -d '{
  "email": "user@example.com",
  "password": "password123",
  "idToken": "your-id-token"
}'
```

## License

This project is licensed under the MIT License.
