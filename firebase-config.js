import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCtLalPGNO5VfRwN-Jc46s-TIoCLvWRtlc",
    authDomain: "inventario-page.firebaseapp.com",
    projectId: "inventario-page",
    storageBucket: "inventario-page.appspot.com",
    messagingSenderId: "246666275516",
    appId: "1:246666275516:web:22af44c7ee2ad315e1feb9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
