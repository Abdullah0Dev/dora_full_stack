// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdn-kLZ7r-XJXltBVY3iXOFtKyhN8CQbg",
  authDomain: "dora-media.firebaseapp.com",
  projectId: "dora-media",
  storageBucket: "dora-media.appspot.com",
  messagingSenderId: "407095315023",
  appId: "1:407095315023:web:a6c274e8fbb4f2da96783a",
  measurementId: "G-23VF5Y7YK5",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export { firebase };

// rules_version = '2';

// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if
//           request.time < timestamp.date(2024, 5, 24);
//     }
//   }
// }
