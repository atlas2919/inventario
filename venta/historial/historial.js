import { db } from "../../firebase-config.js";
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const filterBtn = document.getElementById("filter-btn");
    const dateInput = document.getElementById("filter-date");
    const salesHistoryContainer = document.getElementById("sales-history-container");
    const backBtn = document.getElementById("back-btn");

    // Función para mostrar ventas agrupadas por producto
    const showSalesByDate = async (selectedDate) => {
        const startOfDay = Timestamp.fromDate(new Date(`${selectedDate} 00:00:00`));
        const endOfDay = Timestamp.fromDate(new Date(`${selectedDate} 23:59:59`));

        const q = query(
            collection(db, "registroVentas"),
            where("fechaVentaTimestamp", ">=", startOfDay),
            where("fechaVentaTimestamp", "<=", endOfDay)
        );

        const querySnapshot = await getDocs(q);
        salesHistoryContainer.innerHTML = ""; // Limpiar el contenedor

        if (querySnapshot.empty) {
            salesHistoryContainer.innerHTML = "<p>No se encontraron ventas para esta fecha.</p>";
            return;
        }

        // Agrupar ventas por `productoId`
        const groupedSales = {};
        for (const docSnap of querySnapshot.docs) {
            const sale = docSnap.data();
            if (!groupedSales[sale.productoId]) {
                groupedSales[sale.productoId] = [];
            }
            groupedSales[sale.productoId].push(sale);
        }

        // Mostrar cada grupo de ventas
        for (const productId in groupedSales) {
            const productDoc = await getDoc(doc(db, "productos", productId));
            const product = productDoc.exists() ? productDoc.data() : { name: "Producto eliminado", image: "default-image.png" };

            // Sección del producto
            const productSection = document.createElement("div");
            productSection.className = "product-section";
            productSection.innerHTML = `
                <div class="product-header">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h3>${product.name}</h3>
                </div>
            `;

            // Crear una lista de ventas del producto
            const salesList = document.createElement("div");
            salesList.className = "sales-list";

            groupedSales[productId].forEach((sale) => {
                const saleItem = document.createElement("div");
                saleItem.className = "sale-item";
                saleItem.innerHTML = `
                    <p><strong>Cantidad Vendida:</strong> ${sale.cantidadVendida}</p>
                    <p><strong>Precio Venta:</strong> $${sale.precioVenta.toFixed(2)}</p>
                    <p><strong>Fecha de Venta:</strong> ${new Date(sale.fechaVentaTimestamp.seconds * 1000).toLocaleString("es-EC")}</p>
                `;
                salesList.appendChild(saleItem);
            });

            productSection.appendChild(salesList);
            salesHistoryContainer.appendChild(productSection);
        }
    };

    // Evento al hacer clic en "Filtrar"
    filterBtn.addEventListener("click", () => {
        const selectedDate = dateInput.value; // Formato YYYY-MM-DD
        if (selectedDate) {
            showSalesByDate(selectedDate);
        }
    });

    // Botón de regresar
    backBtn.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
});
