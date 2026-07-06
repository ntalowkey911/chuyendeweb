const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

async function importProducts() {
    const uri = "mongodb://admin%40shop.com:admin123@ac-bmfzsfa-shard-00-00.hhcibrk.mongodb.net:27017,ac-bmfzsfa-shard-00-01.hhcibrk.mongodb.net:27017,ac-bmfzsfa-shard-00-02.hhcibrk.mongodb.net:27017/foodie-express?ssl=true&replicaSet=atlas-cr7m0s-shard-0&authSource=admin&appName=Cluster0";
    const client = new MongoClient(uri);

    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        const db = client.db("foodie-express");
        const productsCollection = db.collection("products");

        console.log("Reading products_data.json...");
        const data = fs.readFileSync("../products_data.json", "utf8");
        const products = JSON.parse(data);

        console.log(`Found ${products.length} products to update/insert.`);

        let updatedCount = 0;
        let insertedCount = 0;

        for (const product of products) {
            // Remove string id and convert it to ObjectId for _id
            const { id, ...productData } = product;
            
            // Clean up any other fields if needed, like converting dates
            if (productData.createdAt) productData.createdAt = new Date(productData.createdAt);
            if (productData.updatedAt) productData.updatedAt = new Date(productData.updatedAt);
            
            // Use ObjectId if it's a valid 24-char hex string
            let filter = {};
            if (id && id.length === 24) {
                filter = { _id: new ObjectId(id) };
            } else if (product.name) {
                // fallback to name matching
                filter = { name: product.name };
            }

            const result = await productsCollection.updateOne(
                filter,
                { $set: productData },
                { upsert: true }
            );

            if (result.matchedCount > 0) {
                updatedCount++;
            } else if (result.upsertedCount > 0) {
                insertedCount++;
            }
        }

        console.log(`✅ Success! Updated: ${updatedCount}, Inserted: ${insertedCount}`);
    } catch (error) {
        console.error("❌ Error importing products:", error);
    } finally {
        await client.close();
    }
}

importProducts();
