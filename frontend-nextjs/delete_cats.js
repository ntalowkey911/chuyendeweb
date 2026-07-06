const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://admin:admin123@ac-bmfzsfa-shard-00-00.hhcibrk.mongodb.net:27017,ac-bmfzsfa-shard-00-01.hhcibrk.mongodb.net:27017,ac-bmfzsfa-shard-00-02.hhcibrk.mongodb.net:27017/foodie-express?ssl=true&replicaSet=atlas-cr7m0s-shard-0&authSource=admin&appName=Cluster0';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('foodie-express');
    
    // The specific categories to delete
    const result = await db.collection('categories').deleteMany({
      _id: {
        $in: [
          new ObjectId('6a3de749c4d3733093ca0311'),
          new ObjectId('6a3de749c4d3733093ca0312'),
          new ObjectId('6a3de749c4d3733093ca0313'),
          new ObjectId('6a3de748c4d3733093ca0310')
        ]
      }
    });
    
    console.log('Deleted ' + result.deletedCount + ' old categories');
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
