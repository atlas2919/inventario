import { db } from "../firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const inventoryList = document.getElementById("inventory-list");

// Función para cargar los productos
async function loadProducts() {
    const querySnapshot = await getDocs(collection(db, "productos"));
    inventoryList.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const product = doc.data();

        // Mostrar solo si el campo "visible" es true
        if (product.visible === false) return;

        const stockText = product.stock === 0 ? `<p class="stock-warning">Sin stock</p>` : `<p>Stock: ${product.stock} unidades</p>`;

        inventoryList.innerHTML += `
            <div class="card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Precio Compra: $${product.purchasePrice.toFixed(2)}</p>
                <p>Precio Venta: $${product.salePrice.toFixed(2)}</p>
                ${stockText}
            </div>
        `;
    });
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
});

window.onload = loadProducts; // Cargar productos al cargar la página
