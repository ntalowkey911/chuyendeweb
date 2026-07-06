const fs = require('fs');

async function exportProducts() {
    try {
        console.log("Fetching products from backend API (http://localhost:8080/api/products)...");
        const response = await fetch("http://localhost:8080/api/products");
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        
        const filePath = "products_data.json";
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf8");
        
        console.log(`✅ Successfully exported ${products.length} products to ${filePath}`);
    } catch (error) {
        console.error("❌ Failed to export products:", error);
    }
}

exportProducts();
