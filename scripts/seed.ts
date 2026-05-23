import mongoose from 'mongoose';
import Category from '../models/Category';
import Product from '../models/Product';
import 'dotenv/config';

const categoriesData = [
  { name: 'Combo Siêu Tiết Kiệm', slug: 'combo-sieu-tiet-kiem', image: 'https://images.unsplash.com/photo-1594212691516-749e7ca8565a?w=500&q=80' },
  { name: 'Món Chính', slug: 'mon-chinh', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80' },
  { name: 'Món Ăn Kèm', slug: 'mon-an-kem', image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&q=80' },
  { name: 'Đồ Uống', slug: 'do-uong', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80' },
  { name: 'Tráng Miệng', slug: 'trang-mieng', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80' },
];

const productsData = [
  // 1. Combo Siêu Tiết Kiệm
  { name: 'Combo 1 Người (Gà + Nước + Khoai)', slug: 'combo-1-nguoi', price: 95000, categorySlug: 'combo-sieu-tiet-kiem', images: ['https://images.unsplash.com/photo-1594212691516-749e7ca8565a?w=500&q=80'] },
  { name: 'Combo Trưa Vui Vẻ (Burger + Nước)', slug: 'combo-trua-vui-ve', price: 75000, categorySlug: 'combo-sieu-tiet-kiem', images: ['https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=500&q=80'] },
  { name: 'Combo Cặp Đôi (2 Pizza Mini + 2 Nước)', slug: 'combo-cap-doi', price: 155000, categorySlug: 'combo-sieu-tiet-kiem', images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80'] },
  { name: 'Combo Tụ Tập (5 Gà + 2 Khoai + 4 Nước)', slug: 'combo-tu-tap', price: 299000, discountPrice: 259000, categorySlug: 'combo-sieu-tiet-kiem', images: ['https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80'] },
  { name: 'Combo Nhí (Tặng Kèm Đồ Chơi)', slug: 'combo-nhi', price: 65000, categorySlug: 'combo-sieu-tiet-kiem', images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80'] },

  // 2. Món Chính
  { name: 'Gà Giòn Trứ Danh (3 Miếng)', slug: 'ga-gion-tru-danh', price: 90000, categorySlug: 'mon-chinh', images: ['https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80'] },
  { name: 'Burger Bò Phô Mai Thượng Hạng', slug: 'burger-bo-pho-mai', price: 65000, categorySlug: 'mon-chinh', images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'] },
  { name: 'Mì Ý Sốt Cà Chua Bò Băm', slug: 'mi-y-sot-ca-chua', price: 75000, categorySlug: 'mon-chinh', images: ['https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80'] },
  { name: 'Cơm Gà Xối Mỡ Đùi Góc Tư', slug: 'com-ga-xoi-mo', price: 55000, categorySlug: 'mon-chinh', images: ['https://images.unsplash.com/photo-1626082895617-2c6b45bb9603?w=500&q=80'] },
  { name: 'Pizza Hải Sản Sốt Pesto (Size M)', slug: 'pizza-hai-san', price: 145000, discountPrice: 125000, categorySlug: 'mon-chinh', images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80'] },
  { name: 'Tacos Gà Cay Mexico', slug: 'tacos-ga-cay', price: 50000, categorySlug: 'mon-chinh', images: ['https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&q=80'] },
  { name: 'Burger Gà Giòn Nấm', slug: 'burger-ga-gion-nam', price: 60000, categorySlug: 'mon-chinh', images: ['https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?w=500&q=80'] },

  // 3. Món Ăn Kèm
  { name: 'Khoai Tây Chiên (Size M)', slug: 'khoai-tay-chien', price: 30000, categorySlug: 'mon-an-kem', images: ['https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&q=80'] },
  { name: 'Phô Mai Que (4 Thanh)', slug: 'pho-mai-que', price: 45000, categorySlug: 'mon-an-kem', images: ['https://images.unsplash.com/photo-1531749668029-21b0dc372f87?w=500&q=80'] }, // Placeholder for cheese sticks
  { name: 'Gà Viên Lắc Phô Mai', slug: 'ga-vien-lac', price: 40000, categorySlug: 'mon-an-kem', images: ['https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80'] },
  { name: 'Salad Bắp Cải Giải Ngấy', slug: 'salad-bap-cai', price: 25000, categorySlug: 'mon-an-kem', images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80'] },
  { name: 'Hành Tây Chiên Giòn (Onion Rings)', slug: 'hanh-tay-chien', price: 35000, categorySlug: 'mon-an-kem', images: ['https://images.unsplash.com/photo-1639024470125-96bd14b2d41b?w=500&q=80'] },

  // 4. Đồ Uống
  { name: 'Coca Cola (Size L)', slug: 'coca-cola-l', price: 25000, categorySlug: 'do-uong', images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80'] },
  { name: 'Trà Đào Cam Sả', slug: 'tra-dao-cam-sa', price: 45000, categorySlug: 'do-uong', images: ['https://images.unsplash.com/photo-1625740822008-e45abf4e01d5?w=500&q=80'] },
  { name: 'Trà Sữa Trân Châu Đường Đen', slug: 'tra-sua-tran-chau', price: 40000, categorySlug: 'do-uong', images: ['https://images.unsplash.com/photo-1558857563-b37102e95e29?w=500&q=80'] },
  { name: 'Nước Ép Dưa Hấu Mát Lạnh', slug: 'nuoc-ep-dua-hau', price: 35000, categorySlug: 'do-uong', images: ['https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80'] },
  { name: 'Matcha Đá Xay', slug: 'matcha-da-xay', price: 50000, categorySlug: 'do-uong', images: ['https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500&q=80'] },
  { name: '7Up / Sprite (Size M)', slug: '7up-sprite', price: 20000, categorySlug: 'do-uong', images: ['https://images.unsplash.com/photo-1625631980838-89c09199d793?w=500&q=80'] },

  // 5. Tráng Miệng
  { name: 'Kem Tươi Mứt Dâu', slug: 'kem-tuoi-mut-dau', price: 25000, categorySlug: 'trang-mieng', images: ['https://images.unsplash.com/photo-1558642891-54be180ea339?w=500&q=80'] },
  { name: 'Bánh Tart Trứng Nướng (2 Cái)', slug: 'banh-tart-trung', price: 35000, categorySlug: 'trang-mieng', images: ['https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=500&q=80'] },
  { name: 'Bánh Su Kem Phủ Choco', slug: 'banh-su-kem', price: 30000, categorySlug: 'trang-mieng', images: ['https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&q=80'] },
  { name: 'Pudding Xoài Mềm Mịn', slug: 'pudding-xoai', price: 20000, categorySlug: 'trang-mieng', images: ['https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=500&q=80'] },
  { name: 'Macaron Hỗn Hợp (3 Cái)', slug: 'macaron-hon-hop', price: 45000, categorySlug: 'trang-mieng', images: ['https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&q=80'] },
];

async function seedDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('Vui lòng thêm MONGODB_URI vào file .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối DB. Bắt đầu xoá dữ liệu cũ...');
    
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Đang tạo dữ liệu danh mục mới...');
    const insertedCategories = await Category.insertMany(categoriesData);

    // Tạo map category slug => _id
    const categoryMap: Record<string, string> = {};
    for (const cat of insertedCategories) {
      categoryMap[cat.slug] = cat._id.toString();
    }

    console.log('Đang tạo dữ liệu sản phẩm mới...');
    const productsToInsert = productsData.map(p => ({
      name: p.name,
      slug: p.slug,
      price: p.price,
      discountPrice: p.discountPrice || null,
      description: `Sản phẩm ${p.name} chuẩn vị thơm ngon, lựa chọn hoàn hảo dành cho bạn.`,
      category: categoryMap[p.categorySlug],
      images: p.images,
      isAvailable: true,
      rating: Math.floor(Math.random() * (50 - 45 + 1) + 45) / 10 // 4.5 -> 5.0
    }));

    await Product.insertMany(productsToInsert);

    console.log(`Đã tạo thành công ${insertedCategories.length} danh mục và ${productsToInsert.length} sản phẩm!`);
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed data:', error);
    process.exit(1);
  }
}

seedDatabase();
