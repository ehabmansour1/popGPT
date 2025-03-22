import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCW8KOmXLUSV_uaZ6xuWMKfR51ZNKYuH5o",
  authDomain: "pop-gpt.firebaseapp.com",
  projectId: "pop-gpt",
  storageBucket: "pop-gpt.firebasestorage.app",
  messagingSenderId: "338666883147",
  appId: "1:338666883147:web:7c0e03851f55efbcb8a5ce",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
