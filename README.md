# CS458 Project Part 1 - Login Page Implementation and Test Automation

## Project Overview

This project involves implementing a web-based login page that supports authentication via email/phone and password, as well as third-party authentication using Google. Additionally, Selenium-based test automation has been implemented for validating the login functionalities.

## Features Implemented

- **User Login Form**
  - Accepts email/phone number and password
  - Provides appropriate error messages for invalid credentials
- **Third-party Authentication**
  - Login with Google
- **Frontend**: React.js
- **Backend**: Express.js
- **Authentication**: Firebase Authentication
- **Test Automation**: Selenium WebDriver

## Project Structure

```
CS458-Project/
│── backend/
│   │── server.js                 # Express.js server
│   │── firebase-config.js         # Firebase authentication configuration
│
│── frontend/
│   │── src/
│   │   │── App.js                 # Main React component
│   │   │── firebase-config.js      # Firebase authentication integration
│   │   │── LoginPage.js            # Login page implementation
│   │── package.json               # React dependencies
│
│── tests/
│   │── selenium-tests/
│   │   │── login_tests.py         # Selenium test scripts
│   │── requirements.txt           # Dependencies for test automation
│
│── UML-Diagrams/
│   │── activity-diagram.png       # Activity diagram for login process
│   │── state-diagram.png          # State diagram for login state transitions
│   │── use-case-diagram.png       # Use-case diagram for authentication
│   │── sequence-diagram.png       # Sequence diagram for login flow
│   │── class-diagram.png          # Class diagram for project structure
│
│── README.md                      # Project documentation
```

## Installation and Setup

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm or yarn
- Python 3.x
- Selenium WebDriver
- Chrome WebDriver

### Backend Setup

1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   node server.js
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm start
   ```

### Running Selenium Tests

1. Install required Python dependencies:
   ```sh
   pip install -r tests/requirements.txt
   ```
2. Run test cases:
   ```sh
   python tests/selenium-tests/login_tests.py
   ```

## Test Cases

The following test cases were implemented:

1. Valid email/phone number and correct password
2. Invalid email/phone number
3. Invalid password
4. Login with Google authentication
5. Attempt to submit without entering credentials

## Test Automation

- Selenium WebDriver was used for automating the login functionality tests.
- Chrome WebDriver was used as the browser driver.
- The test scripts validate correct login behavior and error handling.

## Contribution

- **[Your Name]** - Full-stack development & testing

## License

This project is for educational purposes and follows the guidelines set by the CS458 course at Bilkent University.

---

For any issues or inquiries, contact **[Your Email]**.
