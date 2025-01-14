import { db } from "../firebase-config.js";
import { collection, getDocs, getDoc, doc, updateDoc, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

import { protectRoute } from "../auth.js"; // Importar la función de autenticación
protectRoute(); // Verificar autenticación antes de cargar la página

document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.getElementById("product-list");
    const modal = document.getElementById("sell-modal");
    const closeModalBtn = document.querySelector(".close-btn");
    const sellForm = document.getElementById("sell-form");
    const homeBtn = document.getElementById("home-btn"); // Botón de "Home"
    const historyBtn = document.getElementById("sales-history-btn"); // Botón de historial
    let selectedProductId = null;

    // Función para mostrar productos
    const showProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "productos"));
        productList.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const product = doc.data();

            // Mostrar solo productos con "visible: true"
            if (product.visible === false) return;

            const productCard = document.createElement("div");
            productCard.className = "card";

            // Verificar si el producto tiene stock
            const stockInfo = product.stock === 0
                ? `<p class="stock-warning">Sin stock</p>`
                : `<p>Stock: ${product.stock} unidades</p>`;

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Precio Compra: $${product.purchasePrice.toFixed(2)}</p>
                <p>Fecha de Compra: ${product.purchaseDate ? new Date(product.purchaseDate.seconds * 1000).toLocaleDateString("es-EC") : "Sin fecha"}</p>
                ${stockInfo}
            `;

            if (product.stock > 0) {
                productCard.addEventListener("click", () => {
                    selectedProductId = doc.id;
                    document.getElementById("sell-price").value = product.salePrice.toFixed(2);
                    document.getElementById("sell-quantity").value = 1;
                    document.getElementById("sell-date").value = new Date().toLocaleString("es-EC", {
                        timeZone: "America/Guayaquil"
                    });
                    modal.style.display = "flex";
                });
            }

            productList.appendChild(productCard);
        });
    };

    // Botón de Home
    homeBtn.addEventListener("click", () => {
        window.location.href = "../home/index.html";
    });

    // Botón de historial
    historyBtn.addEventListener("click", () => {
        window.location.href = "./historial/index.html";
    });

    // Cerrar modal
    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Cerrar modal con la tecla "Escape"
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.style.display === "flex") {
            modal.style.display = "none";
        }
    });

    // Registrar venta
    sellForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const sellQuantity = parseInt(document.getElementById("sell-quantity").value);
        const sellPrice = parseFloat(document.getElementById("sell-price").value);
        const sellDate = new Date(); // Objeto de fecha para usar Timestamp

        if (!selectedProductId) return;

        try {
            const productDocRef = doc(db, "productos", selectedProductId);
            const productSnap = await getDoc(productDocRef);
            if (!productSnap.exists()) {
                alert("El producto seleccionado no existe.");
                return;
            }

            const currentStock = productSnap.data().stock;

            if (sellQuantity > currentStock) {
                alert("No hay suficiente stock.");
                return;
            }

            // Descontar del stock
            await updateDoc(productDocRef, {
                stock: currentStock - sellQuantity,
            });

            // Registrar la venta en una nueva colección "registroVentas"
            await addDoc(collection(db, "registroVentas"), {
                productoId: selectedProductId,
                nombre: productSnap.data().name,
                cantidadVendida: sellQuantity,
                precioVenta: sellPrice,
                fechaVenta: sellDate.toLocaleString("es-EC"),
                fechaVentaTimestamp: Timestamp.fromDate(sellDate) // Timestamp para comparación
            });

            alert(`Venta registrada: ${sellQuantity} unidades a $${sellPrice.toFixed(2)} c/u.`);
            modal.style.display = "none"; // Cierra la ventana emergente
            showProducts(); // Actualiza la lista de productos
        } catch (error) {
            console.error("Error al registrar la venta:", error);
            alert("Error al registrar la venta. Intenta de nuevo.");
        }
    });

    // Mostrar productos al cargar la página
    showProducts();
});
