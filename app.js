import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCtLalPGNO5VfRwN-Jc46s-TIoCLvWRtlc",
    authDomain: "inventario-page.firebaseapp.com",
    projectId: "inventario-page",
    storageBucket: "inventario-page.appspot.com",
    messagingSenderId: "246666275516",
    appId: "1:246666275516:web:22af44c7ee2ad315e1feb9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('login-form');
const rememberMeCheckbox = document.getElementById('remember-me');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = rememberMeCheckbox.checked;

    try {
        if (rememberMe) {
            await setPersistence(auth, browserLocalPersistence); // Persistencia local
        } else {
            await setPersistence(auth, browserSessionPersistence); // Persistencia de sesión
        }

        await signInWithEmailAndPassword(auth, email, password);
        console.log("Inicio de sesión exitoso.");
        window.location.href = "../home/index.html";
    } catch (error) {
        console.error("Error de inicio de sesión:", error.message);
        errorMessage.textContent = "Error: " + error.message;
    }
});