
# Newsletter API

This project is a simple Newsletter API built with Express.js, featuring rate limiting and Swagger documentation. The API allows users to sign up for a newsletter, check if an email is subscribed, and unsubscribe. The subscribers are stored in a JSON file. This API is used in my tutorials, courses, and projects on [pixelrocket.store](https://www.pixelrocket.store).

## Features

- **Rate Limiting:** Prevents abuse by limiting the number of requests per IP address.
- **Swagger Documentation:** Provides a user-friendly interface to interact with the API.
- **JSON File Storage:** Subscriber data is stored in a JSON file for simplicity.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Vercel CLI for deployment (optional).

### Installation

1. Clone the repository:
   git clone https://github.com/PixelRocket-Shop/tutorials-api-newsletter.git
   \
   cd newsletter-api
   

2. Install dependencies:
   npm install
   

### Running the API Locally

1. Start the server:
   node src/app.js
   

2. The API will be running at http://localhost:3000.

3. Access the Swagger documentation at http://localhost:3000/api-docs.

### API Endpoints

#### Sign Up for Newsletter

- **URL:** /newsletter
- **Method:** POST
- **Request Body:**
  json
  {
    "email": "user@example.com"
  }
  
- **Responses:**
  - 200 OK: Successfully signed up.
  - 400 Bad Request: Email already subscribed.

#### Unsubscribe from Newsletter

- **URL:** /newsletter/{email}
- **Method:** DELETE
- **Parameters:**
  - email (string): The email to unsubscribe.
- **Responses:**
  - 200 OK: Successfully unsubscribed.
  - 404 Not Found: Email not found.

#### Check if Email is Subscribed

- **URL:** /newsletter/{email}
- **Method:** GET
- **Parameters:**
  - email (string): The email to check.
- **Responses:**
  - 200 OK: Email is subscribed.
  - 404 Not Found: Email not subscribed.


### License
This project is licensed under the MIT License.
