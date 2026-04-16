import { initializeApp } from "firebase/app";
// ОБОВ'ЯЗКОВО ДОДАЄМО ЦІ ДВА ІМПОРТИ:
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhYNV-O5z_zUku8iVgm1bxAOhUNuvSgdo",
  authDomain: "lab06rmd.firebaseapp.com",
  projectId: "lab06rmd",
  storageBucket: "lab06rmd.firebasestorage.app",
  messagingSenderId: "1086749547061",
  appId: "1:1086749547061:web:6c72471a3f8632f070af7c",
  measurementId: "G-TQTMHNEEW3"
};

// Ініціалізуємо додаток
const app = initializeApp(firebaseConfig);

// СТВОРЮЄМО ТА ЕКСПОРТУЄМО auth та db (саме цього не вистачало!)
export const auth = getAuth(app);
export const db = getFirestore(app);