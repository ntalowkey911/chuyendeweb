const { MongoClient } = require('mongodb');

const uri = 'mongodb://admin:admin@ac-rut55fp-shard-00-00.e6j1cx9.mongodb.net:27017,ac-rut55fp-shard-00-01.e6j1cx9.mongodb.net:27017,ac-rut55fp-shard-00-02.e6j1cx9.mongodb.net:27017/shopdb?replicaSet=atlas-e3e5wk-shard-0&ssl=true&authSource=admin';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('shopdb');
    const url = 'https://bizweb.dktcdn.net/100/519/595/files/1-180559f8-1ce7-43b7-83ce-a37eac803791.jpg?v=1744966178923';
    
    await db.collection('products').updateOne(
        { name: 'Trà Sữa Trân Châu Đen' }, 
        { $set: { imageUrl: url, imageUrls: [url] } }
    );
    console.log('✅ Updated Trà Sữa Trân Châu Đen');

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
