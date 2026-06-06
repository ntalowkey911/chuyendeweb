const { MongoClient } = require('mongodb');

const uri = 'mongodb://admin:admin@ac-rut55fp-shard-00-00.e6j1cx9.mongodb.net:27017,ac-rut55fp-shard-00-01.e6j1cx9.mongodb.net:27017,ac-rut55fp-shard-00-02.e6j1cx9.mongodb.net:27017/shopdb?replicaSet=atlas-e3e5wk-shard-0&ssl=true&authSource=admin';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('shopdb');
    const productsCollection = db.collection('products');

    const imageUpdates = {
      "Trà Sữa Trân Châu Đen": "https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=800&auto=format&fit=crop",
      "Trà Sữa Matcha Uji": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop",
      "Trà Đào Cam Sả": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop",
      "Trà Vải Thanh Nhiệt": "https://images.unsplash.com/photo-1558024220-b4afce668dd9?q=80&w=800&auto=format&fit=crop",
      "Trà Gừng Mật Ong Chanh": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop", // Reusing peach tea for ginger tea since no specific one provided
      "Coca-Cola Lon 330ml": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop",
      "Pepsi Lon 330ml": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?q=80&w=800&auto=format&fit=crop",
      "Sprite Lon 330ml": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=800&auto=format&fit=crop",
      "Nước Suối Lavie 500ml": "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=800&auto=format&fit=crop",
      "Cà Phê Đen Đá": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
      "Cà Phê Sữa Đá": "https://images.unsplash.com/photo-1551030173-122aabc4489c?q=80&w=800&auto=format&fit=crop",
      "Nước Cam Ép Tươi": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop"
    };

    let updatedCount = 0;
    for (const [productName, url] of Object.entries(imageUpdates)) {
      const result = await productsCollection.updateOne(
        { name: productName },
        { $set: { 
            imageUrl: url,
            imageUrls: [url] 
          } 
        }
      );
      if (result.modifiedCount > 0) updatedCount++;
    }

    console.log(`✅ Đã vá lỗi thành công hình ảnh cho ${updatedCount} món đồ uống!`);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
