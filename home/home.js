import { auth, db } from "../firebase-config.js"; // Importa `auth` y `db`
import { signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

import { protectRoute } from "../auth.js"; // Importar la función de autenticación
protectRoute(); // Verificar autenticación antes de cargar la página

const inventoryList = document.getElementById("inventory-list");

// Función para cargar los productos
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        inventoryList.innerHTML = "";
        if (querySnapshot.empty) {
            inventoryList.innerHTML = "<p>No se encontraron productos en el inventario.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const product = doc.data();

            // Mostrar solo si el campo "visible" es true
            if (product.visible === false) return;

            console.log(product);

            const stockText = product.stock === 0
                ? `<p class="stock-warning">Sin stock</p>`
                : `<p>Stock: ${product.stock} unidades</p>`;

            inventoryList.innerHTML += `
                <div class="card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p><strong>Precio Compra:</strong> $${product.purchasePrice.toFixed(2)}</p>
                    <p><strong>Precio Venta:</strong> $${product.salePrice.toFixed(2)}</p>
                    <p>Fecha de Compra: ${product.purchaseDate ? new Date(product.purchaseDate.seconds * 1000).toLocaleDateString("es-EC") : "Sin fecha"}</p>                    
                    ${stockText}
                </div>
            `;
        });
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        inventoryList.innerHTML = "<p>Error al cargar los productos. Intenta recargar la página.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const addProductButton = document.querySelector(".btn-green"); // Botón "Agregar Producto"
    const sellProductButton = document.querySelector(".btn-blue"); // Botón "Venta"
    const deleteProductButton = document.querySelector(".btn-red"); // Botón "Eliminar Producto"

    // Redirigir a "Agregar Producto"
    if (addProductButton) {
        addProductButton.addEventListener("click", () => {
            window.location.href = "../add-product/index.html"; // Ruta a la página de agregar producto
        });
    }

    // Redirigir a "Venta"
    if (sellProductButton) {
        sellProductButton.addEventListener("click", () => {
            window.location.href = "../venta/index.html"; // Ruta a la página de ventas
        });
    }

    // Redirigir a "Eliminar Producto"
    if (deleteProductButton) {
        deleteProductButton.addEventListener("click", () => {
            window.location.href = "../eliminar-producto/index.html"; // Ruta a la página de eliminar producto
        });
    }

    // Crear y agregar el botón de cerrar sesión
    const logoutContainer = document.createElement("div");
    logoutContainer.classList.add("logout-container");
    document.body.appendChild(logoutContainer);

    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Cerrar sesión";
    logoutButton.classList.add("btn-red");
    logoutButton.style.margin = "2rem auto"; // Centrado horizontal
    logoutButton.style.display = "block";

    // Agregar el botón al contenedor
    logoutContainer.appendChild(logoutButton);

    logoutButton.addEventListener("click", async () => {
        try {
            await signOut(auth);
            console.log("Sesión cerrada con éxito");
            window.location.href = "../index.html"; // Redirigir al inicio de sesión
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    });
});

window.onload = loadProducts; // Cargar productos al cargar la página
