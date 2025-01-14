// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// Configuración de Firebase
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
const auth = getAuth(app);

// Manejar el formulario de inicio de sesión
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "../home/index.html";  // Redirige a la página principal de inventario
    } catch (error) {
        errorMessage.textContent = "Error: " + error.message;
    }
});