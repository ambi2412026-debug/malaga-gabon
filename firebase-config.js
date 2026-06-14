import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCC92Nol8vk_6qLMTi1ZLX9waieiSfvhMs",
  authDomain: "malaga-gabon.firebaseapp.com",
  projectId: "malaga-gabon",
  storageBucket: "malaga-gabon.firebasestorage.app",
  messagingSenderId: "370525390297",
  appId: "1:370525390297:web:aec7f96d5a5818a29cc5c8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
