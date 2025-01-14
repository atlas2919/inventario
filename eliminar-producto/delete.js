import { db } from "../../firebase-config.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.getElementById("product-list");
    const deleteModal = document.getElementById("delete-modal");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
    const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
    const closeModalBtn = document.getElementById("close-modal");

    let selectedProductId = null;

    // Función para mostrar los productos
    const showProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "productos"));
        productList.innerHTML = "";
        querySnapshot.forEach((docSnap) => {
            const product = docSnap.data();
            if (product.visible === false) return; // No mostrar productos marcados como invisibles

            const productCard = document.createElement("div");
            productCard.className = "card";

            const stockText = product.stock === 0 ? `<p class="stock-warning">Sin stock</p>` : `<p>Stock: ${product.stock} unidades</p>`;

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Precio de Compra: $${product.purchasePrice.toFixed(2)}</p>
                ${stockText}
                <button class="btn-delete">Eliminar</button>
            `;

            productCard.querySelector(".btn-delete").addEventListener("click", () => {
                selectedProductId = docSnap.id;
                deleteModal.style.display = "flex";
            });

            productList.appendChild(productCard);
        });
    };

    // Función para ocultar el producto (sin eliminarlo de la base de datos)
    const hideProduct = async () => {
        if (!selectedProductId) return;

        try {
            const productRef = doc(db, "productos", selectedProductId);
            await updateDoc(productRef, {
                visible: false // Actualizar el campo "visible" a false para ocultar el producto
            });
            alert("Producto ocultado correctamente.");
            deleteModal.style.display = "none"; // Cerrar modal
            showProducts(); // Actualizar la lista de productos
        } catch (error) {
            console.error("Error al ocultar el producto:", error);
            alert("Error al ocultar el producto. Intenta nuevamente.");
        }
    };

    // Botón de confirmar eliminación
    confirmDeleteBtn.addEventListener("click", hideProduct);

    // Botones de cerrar modal
    cancelDeleteBtn.addEventListener("click", () => {
        deleteModal.style.display = "none";
    });
    closeModalBtn.addEventListener("click", () => {
        deleteModal.style.display = "none";
    });

    // Mostrar productos al cargar la página
    showProducts();
});

document.addEventListener("DOMContentLoaded", () => {
    const addProductButton = document.querySelector(".btn-blue"); // Botón "Agregar Producto"

    if (addProductButton) {
        addProductButton.addEventListener("click", () => {
            window.location.href = "../home/index.html"; // Ruta a la página de agregar producto
        });
    }
});