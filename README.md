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
│__ backend/
│   │── server.js                   # Express.js server__
│   │── firebase-config.js         # Firebase authentication configuration__
│
│── frontend/
│   │── src/
│   │   │── App.js                 # Main React component
│   │   │── firebase-config.js      # Firebase authentication integration
│   │   │── LoginPage.js            # Login page implementation
│   │── package.json               # React dependencies
│
│── tests/
│   │── chromedriver.exe
│   │── test_case_1.py        
│   │── test_case_2.py
│   │── test_case_3.py 
│   │── test_case_4.py
│   │── test_case_5.py
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

- **[Deniz Hayri Özay]** - Full-stack development & testing
- **[Osman Baktır]** - Full-stack development & testing
- **[Ege Safi]** - Full-stack development & testing
- **[Gizem Gökçe Işık]** - Full-stack development & testing

## License

This project is for educational purposes and follows the guidelines set by the CS458 course at Bilkent University.

---
