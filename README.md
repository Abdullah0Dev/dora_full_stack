# Dora - Full Stack Expo Application

  <br />
    <a href="https://www.linkedin.com/in/abdullah-future/" target="_blank">
      <img  src="https://i.ibb.co/sJY8XmX/Your-paragraph-text.png" alt="Project Banner">
    </a>
  <br />

## Description

Dora is a full stack application built using Expo, TailwindCSS, Expo Image Picker, Node.js, JWT authentication, MongoDB, Express.js, body-parser, cors, bcrypt, and Firebase. The application allows users to sign up and sign in using JWT authentication. Once signed in, users can access the home page where they can view top posts from different users, as well as a trending video section with animation. Users can bookmark posts and access them on the bookmark page. They can also create posts using Expo Image Picker, which utilizes Firebase for image and video hosting. 

## Features

- **User Authentication**: Secure sign-up and sign-in functionality using JWT authentication.
- **Protected Routes**: Users cannot access the homepage without signing in.
- **Homepage**: View top posts from different users and a trending video section with animation.
- **Bookmarking**: Users can bookmark posts and access them on the bookmark page.
- **Create Post**: Users can create posts using Expo Image Picker, with automatic upload to Firebase.
- **Profile Page**: View user's profile with information such as the number of posts, profile picture, and user's name.

## Technologies Used

### Client

- **Expo**: Framework and platform for universal React applications.
- **TailwindCSS**: A utility-first CSS framework for rapid UI development.
- **Expo Image Picker**: Allows users to pick images and videos.
- **React Native**: A framework for building native applications using React.

### Server

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **JWT**: JSON Web Token for user authentication.
- **MongoDB**: A NoSQL database for storing application data.
- **Express.js**: Web application framework for Node.js.
- **body-parser**: Node.js body parsing middleware.
- **Cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **bcrypt**: A password-hashing function.
- **Firebase**: Cloud-based platform for image and video hosting.

## Getting Started

To get a local copy up and running follow these simple steps:

1. Clone the repository: 
    ```sh
    git clone https://github.com/Abdullah0Dev/dora_full_stack.git
    ```
2. Install NPM packages for both client and server:
    ```sh
    cd client
    npm install
    cd ../server
    npm install
    ```
3. Create a `.env` file in the server directory and add the following variables:
    ```env
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    PORT=4000
    ```

## Usage

1. Start the server:
    ```sh
    cd server
    npm start
    ```
2. Start the Expo client:
    ```sh
    cd client
    expo start
    ```
3. Open your Expo app on your device and scan the QR code to view the application.
 
## Contact

Abdullah0Dev - [abdullahdev001@gmail.com] - [Abdullah0Dev]

Project Link: [Dora](https://github.com/Abdullah0Dev/dora_full_stack)

---
 
