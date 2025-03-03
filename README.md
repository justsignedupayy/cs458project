# CS 458 Project Part 1 
This project involves  the implementation of a web-based login page that supports authentication via email and password, as well as third-party authentication using Firebase Authentication. Additionally, Selenium-based test automation has been implemented for validating the login functionalities.

## Features Implemented

User Login Form

Accepts email and password

Provides appropriate error messages for invalid credentials

Third-party Authentication

Login with Google

 Frontend: React.js

 Backend: Express.js

 Authentication: Firebase Authentication

 Test Automation: Selenium WebDriver

# Project Structure

CS458-Project/
│── backend/
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


# Installation and Setup

## Prerequisites

Ensure you have the following installed:

Node.js

npm or yarn

Python 3.x

Selenium WebDriver

Chrome WebDriver

## Backend Setup

Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Start the backend server:

node server.js

## Frontend Setup

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the frontend server:

npm start



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### ⁠ npm start ⁠

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### ⁠ npm test ⁠

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### ⁠ npm run build ⁠

Builds the app for production to the ⁠ build ⁠ folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### ⁠ npm run eject ⁠

*Note: this is a one-way operation. Once you ⁠ eject ⁠, you can't go back!*

If you aren't satisfied with the build tool and configuration choices, you can ⁠ eject ⁠ at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except ⁠ eject ⁠ will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use ⁠ eject ⁠. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### ⁠ npm run build ⁠ fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
