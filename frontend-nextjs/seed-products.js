const { MongoClient } = require('mongodb');

const uri = 'mongodb://admin:admin@ac-rut55fp-shard-00-00.e6j1cx9.mongodb.net:27017,ac-rut55fp-shard-00-01.e6j1cx9.mongodb.net:27017,ac-rut55fp-shard-00-02.e6j1cx9.mongodb.net:27017/shopdb?replicaSet=atlas-e3e5wk-shard-0&ssl=true&authSource=admin';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('shopdb');
    const productsCollection = db.collection('products');

    const now = new Date();

    // ─────────────────────────────────────────────────────────────────
    // IMAGE HELPERS
    // ─────────────────────────────────────────────────────────────────
    const FOODISH = (cat, n) => `https://foodish-api.com/images/${cat}/${n}.jpg`;
    const PICSUM  = (seed)   => `https://picsum.photos/seed/${seed}/800/800`;

    const imagePool = {
      "burger-bo-pho-mai":      FOODISH("burger", 1),
      "burger-ga-gion":         FOODISH("burger", 2),
      "burger-tom-bien":        FOODISH("burger", 3),
      "burger-bbq":             FOODISH("burger", 4),
      "burger-double":          FOODISH("burger", 5),
      "burger-mushroom":        FOODISH("burger", 6),
      "ga-ran-1":               FOODISH("burger", 7),
      "ga-ran-3":               FOODISH("burger", 8),
      "ga-sot-cay":             FOODISH("burger", 9),
      "hotdog":                 FOODISH("burger", 10),
      "pizza-xuc-xich":         FOODISH("pizza",  1),
      "pizza-hai-san":          FOODISH("pizza",  2),
      "pizza-4-pho-mai":        FOODISH("pizza",  3),
      "pizza-ga-bbq":           FOODISH("pizza",  4),
      "khoai-s":                FOODISH("pasta",  1),
      "khoai-l":                FOODISH("pasta",  2),
      "khoai-lac-pho-mai":      FOODISH("pasta",  3),
      "pho-mai-que":            FOODISH("pasta",  4),
      "onion-rings":            FOODISH("pasta",  5),
      "ga-vien":                FOODISH("burger", 11),
      "xuc-xich-chien-bo":      FOODISH("burger", 12),
      "salad-dau-giam":         FOODISH("rice",   1),
      "salad-ca-ngu":           FOODISH("rice",   2),
      "sup-cua":                FOODISH("biryani",1),
      "combo-burger-1":         FOODISH("burger", 13),
      "combo-burger-2":         FOODISH("burger", 14),
      "combo-ga-ran":           FOODISH("burger", 15),
      "combo-pizza":            FOODISH("pizza",  5),
      "combo-gia-dinh":         FOODISH("burger", 16),
      "kem-vanilla":            FOODISH("dessert", 1),
      "kem-chocolate":          FOODISH("dessert", 2),
      "banh-tart-trung":        FOODISH("dessert", 3),
      "tiramisu":               FOODISH("dessert", 4),
      "banh-flan":              FOODISH("dessert", 5),
      "chocolate-lava":         FOODISH("dessert", 6),
      "muffin":                 FOODISH("dessert", 7),
      "cheesecake":             FOODISH("dessert", 8),
      "tra-sua-tran-chau":      PICSUM("bubble-tea"),
      "tra-sua-matcha":         PICSUM("matcha-drink"),
      "tra-dao-cam-sa":         PICSUM("peach-tea"),
      "tra-vai":                PICSUM("fruit-tea"),
      "coca-cola":              PICSUM("coca-cola-can"),
      "pepsi":                  PICSUM("pepsi-can"),
      "ca-phe-den":             PICSUM("black-coffee"),
      "ca-phe-sua":             PICSUM("milk-coffee"),
      "sinh-to-xoai":           PICSUM("mango-smoothie"),
      "nuoc-ep-cam":            PICSUM("orange-juice"),
    };

    const rawProducts = [
      // 1. BEST SELLERS (6 sp)
      { name:"Burger Bò Phô Mai Đặc Biệt", slug:"burger-bo-pho-mai", description:"Burger bò Angus 180g, phô mai cheddar tan chảy, rau xà lách tươi, sốt đặc biệt FastBite.", price:85000, originalPrice:99000, image:imagePool["burger-bo-pho-mai"], categoryIds:[1,3], tags:["best-seller","burger"], rating:4.9, sold:3120, stock:100, isActive:true, createdAt:now },
      { name:"Gà Rán Giòn Cay", slug:"ga-ran-gion-cay", description:"Đùi gà tẩm ướp 24h, chiên giòn tan, phủ sốt cay đặc trưng kiểu Hàn.", price:65000, originalPrice:75000, image:imagePool["ga-sot-cay"], categoryIds:[1,3], tags:["best-seller","ga-ran"], rating:4.8, sold:2890, stock:120, isActive:true, createdAt:now },
      { name:"Combo Burger + Khoai + Nước", slug:"combo-burger-nuoc-khoai", description:"Burger bò kinh điển + khoai tây vừa + lon nước tùy chọn. Tiết kiệm 20%.", price:119000, originalPrice:149000, image:imagePool["combo-burger-1"], categoryIds:[1,2], tags:["best-seller","combo"], rating:4.8, sold:2650, stock:80, isActive:true, createdAt:now },
      { name:"Trà Sữa Trân Châu Đen", slug:"tra-sua-tran-chau-den", description:"Trà sữa sữa tươi nguyên chất, trân châu đen nấu mỗi giờ, chỉnh được độ ngọt và đá.", price:45000, originalPrice:55000, image:imagePool["tra-sua-tran-chau"], categoryIds:[1,7], tags:["best-seller","do-uong"], rating:4.7, sold:2400, stock:200, isActive:true, createdAt:now },
      { name:"Pizza Xúc Xích Phô Mai", slug:"pizza-xuc-xich", description:"Đế bánh mỏng giòn, xúc xích Ý thái lát, phô mai mozzarella kéo sợi, sốt cà chua thơm.", price:125000, originalPrice:145000, image:imagePool["pizza-xuc-xich"], categoryIds:[1,3], tags:["best-seller","pizza"], rating:4.7, sold:2100, stock:60, isActive:true, createdAt:now },
      { name:"Chocolate Lava Cake", slug:"chocolate-lava-cake", description:"Bánh socola nóng, nhân chảy tràn ngay khi cắt, ăn kèm kem vanilla.", price:55000, originalPrice:65000, image:imagePool["chocolate-lava"], categoryIds:[1,6], tags:["best-seller","trang-miem"], rating:4.9, sold:1980, stock:50, isActive:true, createdAt:now },

      // 2. COMBO / KHUYẾN MÃI (6 sp)
      { name:"Combo Burger Đôi", slug:"combo-burger-doi", description:"2 burger bò phô mai + 2 phần khoai L + 2 lon nước. Dành cho cặp đôi, tiết kiệm 25%.", price:199000, originalPrice:265000, image:imagePool["combo-burger-2"], categoryIds:[2], tags:["combo","deal"], rating:4.7, sold:1540, stock:70, isActive:true, createdAt:now },
      { name:"Combo Gà Rán Gia Đình", slug:"combo-ga-ran-gia-dinh", description:"8 miếng gà rán + 4 phần khoai L + 4 nước có ga. Lý tưởng cho 4 người.", price:389000, originalPrice:480000, image:imagePool["combo-gia-dinh"], categoryIds:[2], tags:["combo","gia-dinh"], rating:4.8, sold:1320, stock:50, isActive:true, createdAt:now },
      { name:"Combo Gà Rán Đơn", slug:"combo-ga-ran-don", description:"2 miếng gà rán giòn + khoai S + 1 nước tùy chọn. Nhanh, no, tiết kiệm.", price:109000, originalPrice:135000, image:imagePool["combo-ga-ran"], categoryIds:[2], tags:["combo"], rating:4.6, sold:1100, stock:90, isActive:true, createdAt:now },
      { name:"Combo Pizza Đôi", slug:"combo-pizza-doi", description:"2 pizza cỡ M tùy vị + 2 lon nước. Ăn tối lý tưởng cho 2 người.", price:219000, originalPrice:280000, image:imagePool["combo-pizza"], categoryIds:[2], tags:["combo","pizza"], rating:4.7, sold:980, stock:40, isActive:true, createdAt:now },
      { name:"Combo Sáng Nhanh", slug:"combo-sang-nhanh", description:"Hotdog nướng + cà phê sữa đá. Bắt đầu ngày năng lượng, giao hàng ưu tiên sáng.", price:79000, originalPrice:99000, image:imagePool["hotdog"], categoryIds:[2], tags:["combo","sang"], rating:4.5, sold:870, stock:100, isActive:true, createdAt:now },
      { name:"Combo Trà Sữa + Tráng Miệng", slug:"combo-tra-sua-trang-miem", description:"1 trà sữa size L tùy vị + 1 bánh tart trứng. Combo ngọt ngào cực đỉnh.", price:89000, originalPrice:115000, image:imagePool["banh-tart-trung"], categoryIds:[2], tags:["combo","tra-sua"], rating:4.6, sold:760, stock:80, isActive:true, createdAt:now },

      // 3. MÓN CHÍNH (10 sp)
      { name:"Burger Gà Giòn Classic", slug:"burger-ga-gion-classic", description:"Ức gà tẩm breadcrumb chiên giòn, xà lách, cà chua, sốt mayo tự làm.", price:72000, originalPrice:85000, image:imagePool["burger-ga-gion"], categoryIds:[3], tags:["burger","ga"], rating:4.6, sold:1800, stock:110, isActive:true, createdAt:now },
      { name:"Burger Tôm Biển", slug:"burger-tom-bien", description:"Chả tôm chiên giòn, phô mai cheddar, sốt tartar biển, rau mầm tươi.", price:89000, originalPrice:105000, image:imagePool["burger-tom-bien"], categoryIds:[3], tags:["burger","tom"], rating:4.5, sold:1200, stock:80, isActive:true, createdAt:now },
      { name:"Burger BBQ Khói", slug:"burger-bbq-khoi", description:"Thịt bò xông khói BBQ, hành tây caramel, sốt smoky, dưa chuột muối.", price:92000, originalPrice:110000, image:imagePool["burger-bbq"], categoryIds:[3], tags:["burger","bbq"], rating:4.7, sold:1450, stock:90, isActive:true, createdAt:now },
      { name:"Burger Double Beef", slug:"burger-double-beef", description:"Hai lớp thịt bò Wagyu 150g mỗi lớp, phô mai double, sốt bí mật FastBite.", price:135000, originalPrice:159000, image:imagePool["burger-double"], categoryIds:[3], tags:["burger","premium"], rating:4.8, sold:900, stock:60, isActive:true, createdAt:now },
      { name:"Burger Nấm Nướng (Chay)", slug:"burger-nam-nuong", description:"Nấm portobello nướng than, phô mai Swiss, sốt pesto, bánh brioche mềm — lựa chọn chay ngon.", price:78000, originalPrice:92000, image:imagePool["burger-mushroom"], categoryIds:[3], tags:["burger","chay"], rating:4.4, sold:620, stock:70, isActive:true, createdAt:now },
      { name:"Gà Rán Vị Tỏi Bơ", slug:"ga-ran-toi-bo", description:"3 miếng gà rán tẩm bơ tỏi thơm lừng, da giòn tan, thịt mọng nước.", price:79000, originalPrice:93000, image:imagePool["ga-ran-1"], categoryIds:[3], tags:["ga-ran"], rating:4.7, sold:1650, stock:100, isActive:true, createdAt:now },
      { name:"Gà Rán Phô Mai Kéo Sợi", slug:"ga-ran-pho-mai-keo-soi", description:"Gà rán nhân phô mai mozzarella kéo sợi, chiên vàng đều, thơm giòn hấp dẫn.", price:85000, originalPrice:99000, image:imagePool["ga-ran-3"], categoryIds:[3], tags:["ga-ran","pho-mai"], rating:4.6, sold:1400, stock:95, isActive:true, createdAt:now },
      { name:"Pizza Hải Sản Nhiệt Đới", slug:"pizza-hai-san", description:"Tôm, mực, điệp trên nền sốt kem tươi, phô mai mozzarella, rắc parmesan.", price:145000, originalPrice:170000, image:imagePool["pizza-hai-san"], categoryIds:[3], tags:["pizza","hai-san"], rating:4.6, sold:780, stock:45, isActive:true, createdAt:now },
      { name:"Pizza 4 Phô Mai", slug:"pizza-4-pho-mai", description:"Mozzarella, Cheddar, Gouda, Parmesan — bốn loại phô mai hòa quyện trên đế mỏng.", price:149000, originalPrice:175000, image:imagePool["pizza-4-pho-mai"], categoryIds:[3], tags:["pizza","pho-mai"], rating:4.7, sold:920, stock:40, isActive:true, createdAt:now },
      { name:"Hotdog Nướng Bơ", slug:"hotdog-nuong-bo", description:"Xúc xích Đức dài 18cm nướng bơ, bánh mì mềm, dưa chuột muối, sốt mù tạt & ketchup.", price:55000, originalPrice:65000, image:imagePool["hotdog"], categoryIds:[3], tags:["hotdog"], rating:4.4, sold:870, stock:120, isActive:true, createdAt:now },

      // 4. MÓN MỚI (6 sp)
      { name:"Pizza Gà BBQ Mới", slug:"pizza-ga-bbq-moi", description:"Ức gà xé BBQ, hành tây tím, tiêu đỏ trên đế pizza giòn — vừa ra lò!", price:139000, originalPrice:155000, image:imagePool["pizza-ga-bbq"], categoryIds:[4], tags:["pizza","moi","bbq"], rating:4.5, sold:310, stock:55, isActive:true, isNew:true, launchedAt:new Date("2025-07-01"), createdAt:now },
      { name:"Burger Sriracha Xoài", slug:"burger-sriracha-xoai", description:"Kết hợp sốt sriracha cay và xoài nhiệt đới tươi — hương vị mới mùa hè.", price:95000, originalPrice:115000, image:imagePool["burger-bo-pho-mai"], categoryIds:[4], tags:["burger","moi"], rating:4.4, sold:280, stock:75, isActive:true, isNew:true, launchedAt:new Date("2025-07-05"), createdAt:now },
      { name:"Sinh Tố Xoài Nhiệt Đới", slug:"sinh-to-xoai-nhiet-doi", description:"Xoài chín xay nhuyễn, sữa chua Hy Lạp, mật ong, đá bào — mát lạnh ngọt lành.", price:49000, originalPrice:59000, image:imagePool["sinh-to-xoai"], categoryIds:[4,7], tags:["do-uong","moi"], rating:4.6, sold:420, stock:150, isActive:true, isNew:true, launchedAt:new Date("2025-07-03"), createdAt:now },
      { name:"Cheesecake Dâu Tây", slug:"cheesecake-dau-tay", description:"Cheesecake New York mướt mịn, compote dâu tây tươi, đế bánh quy giòn tan.", price:62000, originalPrice:72000, image:imagePool["cheesecake"], categoryIds:[4,6], tags:["trang-miem","moi"], rating:4.7, sold:390, stock:45, isActive:true, isNew:true, launchedAt:new Date("2025-07-06"), createdAt:now },
      { name:"Onion Rings Phô Mai", slug:"onion-rings-pho-mai", description:"Vòng hành tây chiên giòn lớp bột xù, nhúng sốt phô mai béo ngậy — món kèm siêu hot.", price:42000, originalPrice:52000, image:imagePool["onion-rings"], categoryIds:[4,5], tags:["mon-kem","moi"], rating:4.5, sold:350, stock:110, isActive:true, isNew:true, launchedAt:new Date("2025-07-02"), createdAt:now },
      { name:"Cà Phê Caramel Muối Đá", slug:"ca-phe-caramel-muoi-da", description:"Espresso đậm pha caramel muối tan chảy, đổ trên đá viên — trending TikTok.", price:52000, originalPrice:62000, image:imagePool["ca-phe-den"], categoryIds:[4,7], tags:["do-uong","moi","ca-phe"], rating:4.8, sold:510, stock:180, isActive:true, isNew:true, launchedAt:new Date("2025-06-30"), createdAt:now },

      // 5. MÓN ĂN KÈM (8 sp)
      { name:"Khoai Tây Chiên Size S", slug:"khoai-tay-chien-s", description:"Khoai tây que vàng giòn, rắc muối biển Himalaya, ăn kèm ketchup.", price:25000, originalPrice:30000, image:imagePool["khoai-s"], categoryIds:[5], tags:["khoai-tay"], rating:4.5, sold:4200, stock:300, isActive:true, createdAt:now },
      { name:"Khoai Tây Chiên Size L", slug:"khoai-tay-chien-l", description:"Phần khoai lớn đã đủ no, chiên 2 lần để đạt độ giòn tối đa.", price:39000, originalPrice:46000, image:imagePool["khoai-l"], categoryIds:[5], tags:["khoai-tay"], rating:4.6, sold:3800, stock:280, isActive:true, createdAt:now },
      { name:"Khoai Lắc Phô Mai", slug:"khoai-lac-pho-mai", description:"Khoai tây chiên lắc đều bột phô mai Mỹ vàng sẫm — không thể dừng tay.", price:45000, originalPrice:55000, image:imagePool["khoai-lac-pho-mai"], categoryIds:[5], tags:["khoai-tay","pho-mai"], rating:4.8, sold:2900, stock:250, isActive:true, createdAt:now },
      { name:"Phô Mai Que Chiên", slug:"pho-mai-que-chien", description:"4 que phô mai mozzarella chiên xù, kéo sợi không dứt, chấm sốt marinara.", price:49000, originalPrice:58000, image:imagePool["pho-mai-que"], categoryIds:[5], tags:["pho-mai"], rating:4.7, sold:2100, stock:200, isActive:true, createdAt:now },
      { name:"Gà Viên Sốt Cay Mật Ong", slug:"ga-vien-sot-cay-mat-ong", description:"6 viên gà xay chiên giòn, phủ sốt cay mật ong Hàn Quốc ngọt cay hài hòa.", price:55000, originalPrice:65000, image:imagePool["ga-vien"], categoryIds:[5], tags:["ga","cay"], rating:4.7, sold:1900, stock:170, isActive:true, createdAt:now },
      { name:"Xúc Xích Chiên Bơ Tỏi", slug:"xuc-xich-chien-bo-toi", description:"Xúc xích Đức chiên vàng với bơ tỏi thơm, ăn kèm mù tạt nguyên hạt.", price:45000, originalPrice:55000, image:imagePool["xuc-xich-chien-bo"], categoryIds:[5], tags:["xuc-xich"], rating:4.5, sold:1200, stock:140, isActive:true, createdAt:now },
      { name:"Salad Caesar", slug:"salad-caesar", description:"Xà lách romaine, crouton giòn, parmesan bào, sốt Caesar truyền thống Ý.", price:55000, originalPrice:65000, image:imagePool["salad-dau-giam"], categoryIds:[5], tags:["salad"], rating:4.4, sold:780, stock:90, isActive:true, createdAt:now },
      { name:"Salad Cá Ngừ Bơ", slug:"salad-ca-ngu-bo", description:"Cá ngừ ngâm dầu ô liu, bơ chín mướt, cà chua bi, sốt chanh dây tươi.", price:65000, originalPrice:78000, image:imagePool["salad-ca-ngu"], categoryIds:[5], tags:["salad","ca-ngu"], rating:4.6, sold:640, stock:80, isActive:true, createdAt:now },

      // 6. TRÁNG MIỆNG (7 sp)
      { name:"Kem Vanilla Que", slug:"kem-vanilla-que", description:"Kem vani Mỹ mịn màng, ngọt thanh, cây kem que cổ điển mọi thế hệ yêu thích.", price:25000, originalPrice:30000, image:imagePool["kem-vanilla"], categoryIds:[6], tags:["kem"], rating:4.6, sold:2800, stock:200, isActive:true, createdAt:now },
      { name:"Kem Socola Đắng", slug:"kem-socola-dang", description:"Kem socola Belgium 70% cacao đậm đà, ít ngọt — dành cho người yêu socola thật thụ.", price:29000, originalPrice:35000, image:imagePool["kem-chocolate"], categoryIds:[6], tags:["kem","socola"], rating:4.5, sold:2200, stock:180, isActive:true, createdAt:now },
      { name:"Bánh Tart Trứng Bồ Đào Nha", slug:"banh-tart-trung", description:"Vỏ bánh ngàn lớp giòn xốp, nhân trứng custard thơm, mặt vàng cháy đặc trưng.", price:35000, originalPrice:42000, image:imagePool["banh-tart-trung"], categoryIds:[6], tags:["banh-ngot"], rating:4.8, sold:3100, stock:120, isActive:true, createdAt:now },
      { name:"Tiramisu Cup", slug:"tiramisu-cup", description:"Tiramisu Ý truyền thống: mascarpone béo mịn, lớp cacao đắng, nhúng espresso.", price:55000, originalPrice:65000, image:imagePool["tiramisu"], categoryIds:[6], tags:["banh-ngot","ca-phe"], rating:4.7, sold:1500, stock:70, isActive:true, createdAt:now },
      { name:"Bánh Flan Cà Phê", slug:"banh-flan-ca-phe", description:"Flan mịn mướt vị cà phê đen, lớp caramel đắng nhẹ — tráng miệng quốc dân.", price:35000, originalPrice:42000, image:imagePool["banh-flan"], categoryIds:[6], tags:["banh-ngot","ca-phe"], rating:4.7, sold:1800, stock:100, isActive:true, createdAt:now },
      { name:"Muffin Việt Quất", slug:"muffin-viet-quat", description:"Muffin nướng tươi mỗi ngày, nhân việt quất Mỹ mọng nước, phủ đường crumble.", price:39000, originalPrice:48000, image:imagePool["muffin"], categoryIds:[6], tags:["banh-ngot"], rating:4.5, sold:1100, stock:90, isActive:true, createdAt:now },
      { name:"Cheesecake New York", slug:"cheesecake-new-york", description:"Cheesecake đế bánh quy, nhân cream cheese không nướng, lạnh mịn tan trong miệng.", price:62000, originalPrice:75000, image:imagePool["cheesecake"], categoryIds:[6], tags:["banh-ngot","cheesecake"], rating:4.8, sold:920, stock:55, isActive:true, createdAt:now },

      // 7. ĐỒ UỐNG (7 sp)
      { name:"Trà Sữa Matcha Đá Xay", slug:"tra-sua-matcha-da-xay", description:"Matcha Nhật Bản grade A, sữa tươi, đá xay mịn — thơm mát cực đỉnh.", price:49000, originalPrice:60000, image:imagePool["tra-sua-matcha"], categoryIds:[7], tags:["tra-sua","matcha"], rating:4.7, sold:1700, stock:180, isActive:true, createdAt:now },
      { name:"Trà Đào Cam Sả", slug:"tra-dao-cam-sa", description:"Đào mọng, cam tươi, sả thơm — trà hoa quả tươi mát không thể cưỡng.", price:45000, originalPrice:55000, image:imagePool["tra-dao-cam-sa"], categoryIds:[7], tags:["tra"], rating:4.8, sold:2200, stock:200, isActive:true, createdAt:now },
      { name:"Trà Vải Nhãn", slug:"tra-vai-nhan", description:"Vải thiều, nhãn lồng hầm đường phèn, trà xanh nhẹ — ngọt dịu hoàn toàn tự nhiên.", price:45000, originalPrice:55000, image:imagePool["tra-vai"], categoryIds:[7], tags:["tra"], rating:4.6, sold:1600, stock:170, isActive:true, createdAt:now },
      { name:"Coca-Cola Lon", slug:"coca-cola-lon", description:"Lon Coca-Cola 330ml lạnh sảng khoái — đồng hành cùng mọi bữa ăn FastBite.", price:20000, originalPrice:22000, image:imagePool["coca-cola"], categoryIds:[7], tags:["nuoc-ngot"], rating:4.5, sold:5500, stock:500, isActive:true, createdAt:now },
      { name:"Pepsi Lon", slug:"pepsi-lon", description:"Lon Pepsi 330ml mát lạnh, ngọt nhẹ — lựa chọn thay thế hoàn hảo.", price:20000, originalPrice:22000, image:imagePool["pepsi"], categoryIds:[7], tags:["nuoc-ngot"], rating:4.4, sold:4800, stock:500, isActive:true, createdAt:now },
      { name:"Cà Phê Sữa Đá", slug:"ca-phe-sua-da", description:"Cà phê phin nhỏ giọt chậm, pha sữa đặc Ông Thọ, đổ lên đá viên to.", price:35000, originalPrice:42000, image:imagePool["ca-phe-sua"], categoryIds:[7], tags:["ca-phe"], rating:4.9, sold:3200, stock:250, isActive:true, createdAt:now },
      { name:"Nước Ép Cam Tươi", slug:"nuoc-ep-cam-tuoi", description:"4-5 quả cam Valencia ép tươi ngay lúc order, không đường, nguyên chất 100%.", price:45000, originalPrice:55000, image:imagePool["nuoc-ep-cam"], categoryIds:[7], tags:["nuoc-ep"], rating:4.7, sold:1400, stock:160, isActive:true, createdAt:now }
    ];

    const catSlugMap = {
      1: "best-sellers", 2: "combo-khuyen-mai", 3: "mon-chinh",
      4: "mon-moi", 5: "mon-an-kem", 6: "trang-mieng", 7: "do-uong"
    };

    const products = rawProducts.map(p => {
      const categorySlug = catSlugMap[p.categoryIds[0]] || "mon-chinh";
      return {
        _class: 'com.example.shop.model.Product',
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        imageUrl: p.image,
        imageUrls: [p.image],
        category: categorySlug,
        stock: p.stock,
        soldCount: p.sold,
        status: p.isActive ? "ACTIVE" : "INACTIVE",
        createdAt: p.createdAt,
        updatedAt: p.createdAt
      };
    });

    await productsCollection.deleteMany({});
    const result = await productsCollection.insertMany(products);
    console.log("✅ Inserted " + result.insertedCount + " products");

    const catMap = {
      1:"Best Sellers", 2:"Combo / Khuyến Mãi", 3:"Món Chính",
      4:"Món Mới", 5:"Món Ăn Kèm", 6:"Tráng Miệng", 7:"Đồ Uống"
    };
    
    Object.entries(catMap).forEach(([id, name]) => {
      const count = products.filter(p => p.categoryIds.includes(Number(id))).length;
      console.log("  Cat " + id + " — " + name + ": " + count + " sản phẩm");
    });
    console.log("\n📦 Tổng: " + products.length + " sản phẩm");

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
