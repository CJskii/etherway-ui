// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// TODO: Review this before pushing to prod

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK2AHRvFtZfdWDyKNX8DB6rNBXWDAXfXg",
  authDomain: "etherway-519ff.firebaseapp.com",
  projectId: "etherway-519ff",
  storageBucket: "etherway-519ff.appspot.com",
  messagingSenderId: "751256544808",
  appId: "1:751256544808:web:5f73059d40f91b3926771d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
