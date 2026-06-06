const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://admin:admin@cdweb.e6j1cx9.mongodb.net/shopdb?retryWrites=true&w=majority&appName=cdweb';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('shopdb');
    const articles = db.collection('articles');
    
    await articles.deleteMany({});
    
    const docs = [
      {
        _class: 'com.example.shop.model.Article',
        title: 'FastBite Khai Trương Chi Nhánh Mới Tại TP.HCM',
        slug: 'fastbite-khai-truong-chi-nhanh-moi',
        summary: 'Tưng bừng khai trương chi nhánh thứ 10 tại trung tâm TP.HCM với hàng ngàn ưu đãi hấp dẫn.',
        content: '<p>Chào mừng bạn đến với chi nhánh mới nhất của FastBite tại TP.HCM! Trong tuần lễ khai trương, chúng tôi mang đến những chương trình khuyến mãi chưa từng có. Tặng ngay 1 phần gà chiên giòn cho mỗi hoá đơn trên 200K.</p><p>Đừng bỏ lỡ cơ hội thưởng thức những món ăn nhanh tuyệt hảo trong không gian hiện đại và ấm cúng!</p>',
        imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop',
        author: 'Admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _class: 'com.example.shop.model.Article',
        title: 'Bí Quyết Làm Nên Chiếc Burger Bò Hoàn Hảo',
        slug: 'bi-quyet-lam-burger-bo',
        summary: 'Khám phá công thức độc quyền đằng sau món Burger Bò trứ danh của FastBite.',
        content: '<p>Một chiếc burger hoàn hảo bắt đầu từ những nguyên liệu tươi ngon nhất. Tại FastBite, chúng tôi sử dụng 100% thịt bò nhập khẩu, nướng trên ngọn lửa hồng để giữ trọn vị ngọt tự nhiên.</p><p>Kết hợp cùng phô mai Cheddar tan chảy và lớp vỏ bánh mềm mịn được nướng mỗi sáng, Burger Bò của chúng tôi chắc chắn sẽ làm bạn say đắm ngay từ miếng cắn đầu tiên.</p>',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop',
        author: 'Đầu bếp trưởng',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _class: 'com.example.shop.model.Article',
        title: 'Top 5 Món Ăn Bán Chạy Nhất Tháng Qua',
        slug: 'top-5-mon-an-ban-chay',
        summary: 'Cùng điểm lại những món ăn được khách hàng yêu thích nhất trong tháng vừa qua tại hệ thống FastBite.',
        content: '<p>Tháng này, Burger Gà Giòn tiếp tục giữ vững ngôi vương! Cùng với đó là sự vươn lên ngoạn mục của Gà Rán Sốt Cay và Pizza Hải Sản.</p><ul><li>1. Burger Gà Giòn</li><li>2. Gà Rán Sốt Cay (Combo 3 miếng)</li><li>3. Pizza Hải Sản (Cỡ Lớn)</li><li>4. Khoai Tây Chiên Phô Mai</li><li>5. Trà Sữa Trân Châu Đường Đen</li></ul><p>Bạn đã thử qua tất cả chưa? Hãy đặt hàng ngay hôm nay!</p>',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop',
        author: 'Admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const result = await articles.insertMany(docs);
    console.log(result.insertedCount + ' documents were inserted');
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
