import { db } from "../firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

import { protectRoute } from "../auth.js"; // Importar la función de autenticación
protectRoute(); // Verificar autenticación antes de cargar la página

const form = document.getElementById("add-product-form");

// Manejo del formulario
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar el envío predeterminado del formulario

    const purchaseDateInput = document.getElementById("purchase-date").value; // Obtener fecha "YYYY-MM-DD"
    const purchaseDate = purchaseDateInput ? getLocalMidnight(purchaseDateInput) : null; // Ajuste a medianoche local

    const productData = {
        name: document.getElementById("product-name").value.trim(),
        image: document.getElementById("product-image").value.trim(),
        purchasePrice: getValidatedDecimal(document.getElementById("purchase-price").value),
        salePrice: getValidatedDecimal(document.getElementById("sale-price").value),
        stock: getValidatedInteger(document.getElementById("stock").value),
        // Fecha ajustada correctamente
        purchaseDate: purchaseDate
    };

    console.log("Datos del producto a enviar:", productData); // Verifica los datos antes de enviar

    try {
        await addDoc(collection(db, "productos"), productData); // Guardar en Firestore
        showToast("✅ Producto agregado con éxito", "success");
        setTimeout(() => {
            window.location.href = "../home/index.html"; // Redirige después de mostrar el mensaje
        }, 1000);
    } catch (error) {
        console.error("Error al agregar producto:", error);
        showToast("❌ Error al agregar producto: " + error.message, "error");
    }
});

// Función para convertir la fecha "YYYY-MM-DD" a medianoche local
function getLocalMidnight(dateInput) {
    const date = new Date(dateInput + "T00:00:00"); // Convertir a fecha con medianoche local
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajuste para compensar diferencia de UTC
    return date;
}

// Función para validar y convertir valores decimales
function getValidatedDecimal(value) {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0.00 : parseFloat(parsedValue.toFixed(2));
}

// Función para validar y convertir el stock a entero
function getValidatedInteger(value) {
    const parsedValue = parseInt(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
}

// Función para mostrar mensajes de éxito o error
function showToast(message, type) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.padding = "1rem";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "1000";
    toast.style.color = "white";
    toast.style.fontWeight = "bold";
    toast.style.backgroundColor = type === "success" ? "#4caf50" : "#f44336"; // Verde para éxito, rojo para error
    document.body.appendChild(toast);

    setTimeout(() => {
        document.body.removeChild(toast); // Quita el mensaje después de 3 segundos
    }, 2000);
}
