import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// Función para proteger la ruta
function protectRoute() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            console.log("No hay usuario autenticado. Redirigiendo al inicio de sesión.");
            window.location.href = "../index.html"; // Redirige al login si no hay usuario autenticado
        } else {
            console.log("Usuario autenticado:", user.email);
        }
    });
}

export { protectRoute };
