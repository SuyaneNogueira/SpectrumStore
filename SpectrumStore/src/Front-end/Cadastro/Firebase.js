import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5wZHBtVj-pn0eq8gJW2dobBRhKR4Iaro",
  authDomain: "spectrum-7f226.firebaseapp.com",
  projectId: "spectrum-7f226",
  storageBucket: "spectrum-7f226.firebasestorage.app",
  messagingSenderId: "440897626415",
  appId: "1:440897626415:web:20b2b4d59f004c2aadc1da"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa autenticação
const auth = getAuth(app);

// Provedor do Google
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
