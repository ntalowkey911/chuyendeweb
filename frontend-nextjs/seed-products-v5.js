const { MongoClient } = require('mongodb');

const uri = 'mongodb://admin:admin@ac-rut55fp-shard-00-00.e6j1cx9.mongodb.net:27017,ac-rut55fp-shard-00-01.e6j1cx9.mongodb.net:27017,ac-rut55fp-shard-00-02.e6j1cx9.mongodb.net:27017/shopdb?replicaSet=atlas-e3e5wk-shard-0&ssl=true&authSource=admin';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('shopdb');
    const productsCollection = db.collection('products');

    const className = "com.example.shop.model.Product";
    const now = new Date();

    const U = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

    // THESE IDS ARE VERIFIED TO WORK AND REPRESENT THE CATEGORY WELL
    const FALLBACKS = {
      burger: U("1568901346375-23c9450c58cd"),
      chicken: U("1626645738196-c2a7c87a8f58"),
      pizza: U("1565299624946-b28f40a0ae38"),
      combo: U("1576402187878-974f70c890a5"),
      fries: U("1528735602780-2552fd46c7af"),
      salad: U("1546069901-ba9599a7e63c"),
      dessert: U("1571877227200-a0d98ea607e9"), // Tiramisu
      drink: U("1558618666-fcd25c85cd64"),     // Boba
      coffee: U("1509042239860-f550ce710b93")  // Black Coffee
    };

    function getFallback(key) {
      if (key.includes("burger") || key.includes("hotdog") || key.includes("tacos")) return FALLBACKS.burger;
      if (key.includes("ga") || key.includes("xuc-xich")) return FALLBACKS.chicken;
      if (key.includes("pizza")) return FALLBACKS.pizza;
      if (key.includes("combo")) return FALLBACKS.combo;
      if (key.includes("khoai")) return FALLBACKS.fries;
      if (key.includes("salad") || key.includes("sup") || key.includes("pho-mai-que")) return FALLBACKS.salad;
      if (key.includes("kem") || key.includes("banh") || key.includes("tiramisu") || key.includes("panna") || key.includes("sua-chua") || key.includes("muffin") || key.includes("chocolate") || key.includes("trai-cay")) return FALLBACKS.dessert;
      if (key.includes("ca-phe")) return FALLBACKS.coffee;
      return FALLBACKS.drink; // Any other drink
    }

    const imagePool = {
      "burger-bo-pho-mai":    U("1568901346375-23c9450c58cd"),
      "burger-ga-gion":       U("1550547660-deab4e9b2549"),
      "burger-tom-bien":      U("1553909489-cd47e0907980"),
      "burger-bbq":           U("1561758033-d89a9ad46e98"),
      "burger-double":        U("1594212596891-42f63e4c5a84"),
      "ga-ran-1":             U("1626645738196-c2a7c87a8f58"),
      "ga-ran-3":             U("1598103442097-8b74394b95c8"),
      "ga-sot-cay":           U("1562967916-eb82221dfb92"),
      "hotdog-classic":       U("1612392062631-94440e4f5c6e"),
      "hotdog-pho-mai":       U("1620812396459-2a51f3b5b5ff"),
      "pizza-xuc-xich":       U("1565299624946-b28f40a0ae38"),
      "pizza-hai-san":        U("1574071318508-1cdbab80d002"),
      "pizza-bbq-ga":         U("1513104890138-7c749659a591"),
      "tacos-bo":             U("1565180638630-f8d4c99a3670"),
      "combo-1":              U("1576402187878-974f70c890a5"),
      "combo-2":              U("1551782045-a54f05f16718"),
      "combo-3":              U("1590947132387-155cc02f3212"),
      "combo-4":              U("1639565191760-3c0d6e5c1e35"),
      "combo":                U("1607013251379-e6eecfffe234"),
      "khoai-s":              U("1573080496219-bb964701c075"),
      "khoai-l":              U("1518013431117-eb1465fa5afa"),
      "khoai-lac-pho-mai":    U("1528735602780-2552fd46c7af"),
      "pho-mai-que":          U("1619881590738-a111b14e7420"),
      "ga-vien":              U("1527477396000-e27163b481c2"),
      "xuc-xich-chien-bo":    U("1602030638422-ef7f3b03c9e8"),
      "salad-dau-giam":       U("1512621776951-a57ef161c900"),
      "salad-ca-ngu":         U("1546069901-ba9599a7e63c"),
      "sup-cua":              U("1547592166-23ac45744acd"),
      "sup-bi-do":            U("1476718406336-10de82c7bd7b"),
      "kem-vanilla":          U("1551024601-bec78aea704b"),
      "kem-chocolate":        U("1563805042-7684c019e1cb"),
      "banh-tart-trung":      U("1621743478914-cc8a86d7e7b5"),
      "tiramisu":             U("1571877227200-a0d98ea607e9"),
      "banh-flan":            U("1488477181228-c84f4d8bd10d"),
      "panna-cotta":          U("1488900128323-21503983591a"),
      "sua-chua":             U("1488477304112-4517feb6d3ad"),
      "trai-cay":             U("1568702846914-96b305d2aaeb"),
      "muffin":               U("1607958996333-cb83e2a02c37"),
      "chocolate-lava":       U("1553279768-865429fa0078"),
      "tra-sua-tran-chau":    U("1558618666-fcd25c85cd64"),
      "tra-sua-matcha":       U("1556679343-c9306919b71f"),
      "tra-dao-cam-sa":       U("1551024709-8f23befc1977"),
      "tra-vai":              U("1499638673689-79a0b0e8f4b9"),
      "tra-gung-chanh":       U("1571934811516-5e573e7d8a0c"),
      "coca-cola":            U("1622483767028-3f5a6e525a3e"),
      "pepsi":                U("1629203851122-3726a4b2bcd7"),
      "sprite":               U("1624517452488-04d4a4b61e8b"),
      "nuoc-suoi":            U("1548839140-29a749e1cf4d"),
      "ca-phe-den":           U("1509042239860-f550ce710b93"),
      "ca-phe-sua":           U("1534778101976-62847782c2dd"),
      "nuoc-cam-ep":          U("1621506289937-a8e7df9d7d78"),
    };

    const CATEGORIES = {
      BEST_SELLER: { id: 1, name: "Best Sellers",       slug: "best-sellers" },
      COMBO:       { id: 2, name: "Combo / Khuyến Mãi", slug: "combo-khuyen-mai" },
      MON_CHINH:   { id: 3, name: "Món Chính",           slug: "mon-chinh" },
      MON_MOI:     { id: 4, name: "Món Mới",             slug: "mon-moi" },
      AN_KEM:      { id: 5, name: "Món Ăn Kèm",          slug: "mon-an-kem" },
      TRANG_MIENG: { id: 6, name: "Tráng Miệng",         slug: "trang-mieng" },
      DO_UONG:     { id: 7, name: "Đồ Uống",             slug: "do-uong" },
    };

    function makeProductInfo({
      key, name, description, price, originalPrice,
      category, tags = [], isNew = false, isBestSeller = false,
      stock = 100, rating = 4.5, reviewCount = 0,
    }) {
      const img = imagePool[key] ?? getFallback(key);
      return {
        _class: className,
        name,
        description,
        price,
        imageUrl: img, 
        imageUrls: [img],
        category: category.slug,
        stock,
        soldCount: reviewCount * 10,
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now,
        tags,
        isNew,
        isBestSeller,
        rating,
        originalPrice: originalPrice ?? price,
        key
      };
    }

    const allProductInfos = [
      makeProductInfo({ key:"burger-bo-pho-mai", name:"Burger Bò Phô Mai", description:"Burger bò Angus 180g, phô mai cheddar tan chảy, rau xà lách tươi.", price:85000, originalPrice:95000, category:CATEGORIES.BEST_SELLER, isBestSeller:true, rating:4.8, reviewCount:320, tags:["burger","bò","phô mai"] }),
      makeProductInfo({ key:"ga-ran-1",          name:"Gà Rán Giòn (2 miếng)", description:"Gà tươi ướp gia vị đặc trưng, chiên giòn vàng ươm.", price:75000, originalPrice:85000, category:CATEGORIES.BEST_SELLER, isBestSeller:true, rating:4.7, reviewCount:280, tags:["gà rán","giòn"] }),
      makeProductInfo({ key:"khoai-lac-pho-mai", name:"Khoai Tây Lắc Phô Mai", description:"Khoai tây chiên giòn lắc bột phô mai cheddar thơm béo.", price:35000, originalPrice:40000, category:CATEGORIES.BEST_SELLER, isBestSeller:true, rating:4.6, reviewCount:210, tags:["khoai tây","phô mai"] }),
      makeProductInfo({ key:"tra-sua-tran-chau", name:"Trà Sữa Trân Châu",    description:"Trà sữa Đài Loan, trân châu đen dẻo, đường 50%.", price:45000, originalPrice:50000, category:CATEGORIES.BEST_SELLER, isBestSeller:true, rating:4.7, reviewCount:195, tags:["trà sữa","trân châu"] }),
      makeProductInfo({ key:"combo-1",           name:"Combo Gia Đình (4 người)", description:"4 Burger + 4 Khoai Vừa + 4 Nước Ngọt.", price:320000, originalPrice:380000, category:CATEGORIES.BEST_SELLER, isBestSeller:true, rating:4.9, reviewCount:175, tags:["combo","gia đình"] }),
      makeProductInfo({ key:"kem-chocolate",     name:"Kem Chocolate Xoắn",   description:"Kem tươi vị chocolate đậm đà, phủ sốt fudge nóng.", price:30000, originalPrice:35000, category:CATEGORIES.BEST_SELLER, isBestSeller:true, rating:4.5, reviewCount:155, tags:["kem","tráng miệng"] }),
      makeProductInfo({ key:"burger-bbq",        name:"Burger BBQ Smoke",     description:"Burger bò xông khói BBQ, hành tây caramel, sốt mayo smoky.", price:90000, originalPrice:100000, category:CATEGORIES.BEST_SELLER, isBestSeller:true, rating:4.6, reviewCount:143, tags:["burger","bbq"] }),
      makeProductInfo({ key:"ga-sot-cay",        name:"Gà Sốt Cay Hàn Quốc", description:"Gà tươi tẩm sốt gochujang cay ngọt phong cách Hàn Quốc.", price:80000, originalPrice:90000, category:CATEGORIES.BEST_SELLER, isBestSeller:true, rating:4.8, reviewCount:130, tags:["gà","cay","hàn quốc"] }),
      makeProductInfo({ key:"combo-2", name:"Combo Đôi",               description:"2 Burger tùy chọn + 2 Khoai Nhỏ + 2 Nước Ngọt.", price:175000, originalPrice:210000, category:CATEGORIES.COMBO, tags:["combo","đôi"] }),
      makeProductInfo({ key:"combo-3", name:"Combo Pizza & Wings",     description:"1 Pizza 25cm + 6 Cánh Gà Sốt Cay + 2 Pepsi.", price:220000, originalPrice:270000, category:CATEGORIES.COMBO, tags:["combo","pizza","gà"] }),
      makeProductInfo({ key:"combo-4", name:"Combo Bữa Trưa (1 người)", description:"1 Burger Gà + 1 Khoai Nhỏ + 1 Trà Đào.", price:95000, originalPrice:120000, category:CATEGORIES.COMBO, tags:["combo","bữa trưa"] }),
      makeProductInfo({ key:"combo",   name:"Combo Student Deal",      description:"1 Burger Bò Phô Mai + 1 Khoai Vừa + 1 Nước Suối — dành cho học sinh/sinh viên.", price:85000, originalPrice:110000, category:CATEGORIES.COMBO, tags:["combo","sinh viên","khuyến mãi"] }),
      makeProductInfo({ key:"pizza-xuc-xich", name:"Combo Pizza Xúc Xích Đặc Biệt", description:"1 Pizza Xúc Xích 30cm + 2 Lon Pepsi.", price:185000, originalPrice:225000, category:CATEGORIES.COMBO, tags:["combo","pizza","xúc xích"] }),
      makeProductInfo({ key:"burger-bo-pho-mai", name:"Burger Bò Phô Mai Classic", description:"Burger bò Angus 180g, phô mai cheddar, rau xà lách, cà chua.", price:85000, originalPrice:95000, category:CATEGORIES.MON_CHINH, tags:["burger","bò"] }),
      makeProductInfo({ key:"burger-ga-gion",    name:"Burger Gà Giòn",            description:"Gà ức chiên giòn, sốt mayo đặc biệt, dưa leo muối chua.", price:79000, originalPrice:89000, category:CATEGORIES.MON_CHINH, tags:["burger","gà"] }),
      makeProductInfo({ key:"burger-tom-bien",   name:"Burger Tôm Biển",           description:"Miếng tôm panko 120g, sốt tartar, rau bắp cải tươi.", price:92000, originalPrice:105000, category:CATEGORIES.MON_CHINH, tags:["burger","tôm","hải sản"] }),
      makeProductInfo({ key:"burger-bbq",        name:"Burger BBQ Smoke",          description:"Bò xông khói BBQ, hành tây caramel, sốt smoky mayo.", price:90000, originalPrice:100000, category:CATEGORIES.MON_CHINH, tags:["burger","bbq"] }),
      makeProductInfo({ key:"burger-double",     name:"Double Burger Deluxe",      description:"2 lớp bò Angus 120g, 2 lớp phô mai, sốt secret recipe.", price:115000, originalPrice:130000, category:CATEGORIES.MON_CHINH, tags:["burger","double","deluxe"] }),
      makeProductInfo({ key:"ga-ran-1",          name:"Gà Rán Giòn (2 miếng)",    description:"Gà ướp gia vị đặc trưng, chiên giòn vàng, không ngấm dầu.", price:75000, originalPrice:85000, category:CATEGORIES.MON_CHINH, tags:["gà rán"] }),
      makeProductInfo({ key:"ga-ran-3",          name:"Gà Rán Giòn (3 miếng)",    description:"Phần gà rán 3 miếng, lý tưởng cho bữa no.", price:99000, originalPrice:115000, category:CATEGORIES.MON_CHINH, tags:["gà rán"] }),
      makeProductInfo({ key:"ga-sot-cay",        name:"Gà Sốt Cay Hàn Quốc",     description:"Gà tẩm sốt gochujang cay ngọt, phủ mè rang.", price:80000, originalPrice:90000, category:CATEGORIES.MON_CHINH, tags:["gà","cay","hàn quốc"] }),
      makeProductInfo({ key:"hotdog-classic",    name:"Hotdog Classic",            description:"Xúc xích bò dài 20cm, bánh mì mềm, mù tạt & ketchup.", price:59000, originalPrice:69000, category:CATEGORIES.MON_CHINH, tags:["hotdog","xúc xích"] }),
      makeProductInfo({ key:"hotdog-pho-mai",    name:"Hotdog Phô Mai Kéo",       description:"Xúc xích bò + phô mai mozzarella kéo, ớt jalapeño.", price:69000, originalPrice:79000, category:CATEGORIES.MON_CHINH, tags:["hotdog","phô mai"] }),
      makeProductInfo({ key:"pizza-xuc-xich",  name:"Pizza Xúc Xích Đặc Biệt",  description:"Đế mỏng kiểu Ý, xúc xích pepperoni, phô mai mozzarella 3 lớp.", price:145000, originalPrice:165000, category:CATEGORIES.MON_MOI, isNew:true, tags:["pizza","xúc xích","mới"] }),
      makeProductInfo({ key:"pizza-hai-san",   name:"Pizza Hải Sản Đà Lạt",     description:"Tôm, mực, bạch tuộc tươi, nấm đông cô, sốt bechamel.", price:165000, originalPrice:185000, category:CATEGORIES.MON_MOI, isNew:true, tags:["pizza","hải sản","mới"] }),
      makeProductInfo({ key:"pizza-bbq-ga",    name:"Pizza BBQ Gà Xông Khói",   description:"Gà xông khói, hành tây, ớt chuông vàng, sốt BBQ đặc biệt.", price:155000, originalPrice:175000, category:CATEGORIES.MON_MOI, isNew:true, tags:["pizza","gà","bbq","mới"] }),
      makeProductInfo({ key:"tacos-bo",        name:"Tacos Bò Nướng",           description:"Bánh tacos giòn, thịt bò nướng gia vị Tex-Mex, salsa tươi, kem chua.", price:79000, originalPrice:89000, category:CATEGORIES.MON_MOI, isNew:true, tags:["tacos","bò","mới"] }),
      makeProductInfo({ key:"burger-double",   name:"Double Burger Deluxe",     description:"Phiên bản mới — 2 lớp bò 120g, sốt truffle mayo, phô mai gruyère.", price:115000, originalPrice:135000, category:CATEGORIES.MON_MOI, isNew:true, tags:["burger","double","mới"] }),
      makeProductInfo({ key:"ga-sot-cay",      name:"Gà Sốt Cay Thái Lan",     description:"Công thức mới — gà tươi sốt sweet chili Thái, nước cốt dừa.", price:82000, originalPrice:92000, category:CATEGORIES.MON_MOI, isNew:true, tags:["gà","cay","thái","mới"] }),
      makeProductInfo({ key:"khoai-s",           name:"Khoai Tây Chiên Nhỏ",      description:"Khoai tây cắt sợi mỏng, chiên vàng giòn, muối hồng Himalaya.", price:25000, originalPrice:29000, category:CATEGORIES.AN_KEM, tags:["khoai tây","ăn kèm"] }),
      makeProductInfo({ key:"khoai-l",           name:"Khoai Tây Chiên Lớn",      description:"Phần khoai tây lớn, chiên giòn, đủ no cho 2 người chia.", price:35000, originalPrice:39000, category:CATEGORIES.AN_KEM, tags:["khoai tây","ăn kèm"] }),
      makeProductInfo({ key:"khoai-lac-pho-mai", name:"Khoai Lắc Phô Mai",        description:"Khoai chiên giòn + bột phô mai cheddar lắc đều, thơm béo.", price:35000, originalPrice:40000, category:CATEGORIES.AN_KEM, tags:["khoai tây","phô mai","ăn kèm"] }),
      makeProductInfo({ key:"pho-mai-que",       name:"Phô Mai Que Chiên",        description:"Phô mai mozzarella bọc breadcrumb, chiên vàng, sốt marinara.", price:45000, originalPrice:50000, category:CATEGORIES.AN_KEM, tags:["phô mai","chiên","ăn kèm"] }),
      makeProductInfo({ key:"ga-vien",           name:"Gà Viên Chiên (6 viên)",   description:"Gà xay nhuyễn, viên tròn, chiên giòn, chấm sốt tương cà hoặc BBQ.", price:49000, originalPrice:55000, category:CATEGORIES.AN_KEM, tags:["gà","chiên","ăn kèm"] }),
      makeProductInfo({ key:"xuc-xich-chien-bo", name:"Xúc Xích Chiên Bơ",       description:"Xúc xích bò chiên bơ thơm lừng, kèm tương ớt.", price:39000, originalPrice:45000, category:CATEGORIES.AN_KEM, tags:["xúc xích","bơ","ăn kèm"] }),
      makeProductInfo({ key:"salad-dau-giam",    name:"Salad Dầu Giấm Kiểu Ý",   description:"Rau xanh tươi, cà chua bi, oliu, phô mai parmesan bào, sốt dầu giấm.", price:55000, originalPrice:62000, category:CATEGORIES.AN_KEM, tags:["salad","rau","ăn kèm"] }),
      makeProductInfo({ key:"salad-ca-ngu",      name:"Salad Cá Ngừ Caesar",      description:"Cá ngừ đóng hộp, rau romaine, crouton giòn, sốt Caesar đặc truyền.", price:59000, originalPrice:68000, category:CATEGORIES.AN_KEM, tags:["salad","cá ngừ","caesar","ăn kèm"] }),
      makeProductInfo({ key:"sup-cua",           name:"Súp Cua Đặc Biệt",         description:"Súp cua thịt cua tươi, trứng gà, nấm đông cô, nước dùng đậm đà.", price:55000, originalPrice:62000, category:CATEGORIES.AN_KEM, tags:["súp","cua","ăn kèm"] }),
      makeProductInfo({ key:"sup-bi-do",         name:"Súp Bí Đỏ Kem",           description:"Bí đỏ nghiền mịn, kem tươi, hạt hướng dương rang, thơm nhẹ.", price:49000, originalPrice:55000, category:CATEGORIES.AN_KEM, tags:["súp","bí đỏ","ăn kèm"] }),
      makeProductInfo({ key:"kem-vanilla",     name:"Kem Vanilla Xoắn",         description:"Kem tươi vị vanilla Madagascar, nón waffle giòn.", price:28000, originalPrice:32000, category:CATEGORIES.TRANG_MIENG, tags:["kem","tráng miệng"] }),
      makeProductInfo({ key:"kem-chocolate",   name:"Kem Chocolate Đậm",        description:"Kem chocolate Bỉ 70% cacao, phủ sốt fudge nóng.", price:30000, originalPrice:35000, category:CATEGORIES.TRANG_MIENG, tags:["kem","chocolate","tráng miệng"] }),
      makeProductInfo({ key:"banh-tart-trung", name:"Bánh Tart Trứng",          description:"Bánh tart trứng kiểu Hong Kong, vỏ giòn, nhân trứng mịn mềm.", price:22000, originalPrice:25000, category:CATEGORIES.TRANG_MIENG, tags:["bánh","tráng miệng"] }),
      makeProductInfo({ key:"tiramisu",        name:"Tiramisu Ý",               description:"Tiramisu truyền thống: mascarpone, cà phê espresso, bột cacao.", price:52000, originalPrice:59000, category:CATEGORIES.TRANG_MIENG, tags:["tiramisu","ý","tráng miệng"] }),
      makeProductInfo({ key:"banh-flan",       name:"Bánh Flan Caramel",        description:"Bánh flan mềm mịn kiểu Pháp, sốt caramel đắng nhẹ.", price:25000, originalPrice:29000, category:CATEGORIES.TRANG_MIENG, tags:["flan","caramel","tráng miệng"] }),
      makeProductInfo({ key:"panna-cotta",     name:"Panna Cotta Dâu",          description:"Panna cotta kem tươi Ý, sốt dâu tươi, lá bạc hà trang trí.", price:45000, originalPrice:52000, category:CATEGORIES.TRANG_MIENG, tags:["panna cotta","tráng miệng"] }),
      makeProductInfo({ key:"sua-chua",        name:"Sữa Chua Dẻo Phủ Granola", description:"Sữa chua Hy Lạp dẻo, granola hạt, mật ong nguyên chất.", price:35000, originalPrice:40000, category:CATEGORIES.TRANG_MIENG, tags:["sữa chua","granola","tráng miệng"] }),
      makeProductInfo({ key:"trai-cay",        name:"Hoa Quả Tươi Theo Mùa",   description:"Đĩa hoa quả tươi cắt sẵn: dưa hấu, dưa lưới, nho, dâu.", price:42000, originalPrice:48000, category:CATEGORIES.TRANG_MIENG, tags:["trái cây","tươi","tráng miệng"] }),
      makeProductInfo({ key:"muffin",          name:"Muffin Blueberry",         description:"Muffin blueberry Mỹ, mềm xốp, nở phồng, vị chua nhẹ.", price:30000, originalPrice:35000, category:CATEGORIES.TRANG_MIENG, tags:["muffin","blueberry","tráng miệng"] }),
      makeProductInfo({ key:"chocolate-lava",  name:"Chocolate Lava Cake",      description:"Bánh chocolate nóng, lòng chảy khi cắt, kèm kem vanilla.", price:58000, originalPrice:68000, category:CATEGORIES.TRANG_MIENG, tags:["chocolate","lava","tráng miệng"] }),
      makeProductInfo({ key:"tra-sua-tran-chau", name:"Trà Sữa Trân Châu Đen",   description:"Trà Assam, sữa tươi, trân châu đen nấu mềm, đường 50%.", price:45000, originalPrice:50000, category:CATEGORIES.DO_UONG, tags:["trà sữa","trân châu"] }),
      makeProductInfo({ key:"tra-sua-matcha",    name:"Trà Sữa Matcha Uji",      description:"Bột matcha Nhật Uji grade A, sữa tươi, trân châu trắng.", price:49000, originalPrice:55000, category:CATEGORIES.DO_UONG, tags:["trà sữa","matcha"] }),
      makeProductInfo({ key:"tra-dao-cam-sa",    name:"Trà Đào Cam Sả",          description:"Trà xanh pha lạnh, đào tươi, cam vắt, sả thơm.", price:42000, originalPrice:48000, category:CATEGORIES.DO_UONG, tags:["trà đào","cam","sả"] }),
      makeProductInfo({ key:"tra-vai",           name:"Trà Vải Thanh Nhiệt",     description:"Trà trắng, vải đỏ ngâm, đá bào, thanh mát.", price:42000, originalPrice:48000, category:CATEGORIES.DO_UONG, tags:["trà vải","thanh nhiệt"] }),
      makeProductInfo({ key:"tra-gung-chanh",    name:"Trà Gừng Mật Ong Chanh",  description:"Trà gừng ấm, mật ong nguyên chất, chanh tươi — tốt cho hệ miễn dịch.", price:39000, originalPrice:45000, category:CATEGORIES.DO_UONG, tags:["trà gừng","mật ong","chanh"] }),
      makeProductInfo({ key:"coca-cola",         name:"Coca-Cola Lon 330ml",      description:"Coca-Cola nhập khẩu lon 330ml, uống lạnh 4°C.", price:20000, originalPrice:22000, category:CATEGORIES.DO_UONG, tags:["coca-cola","nước ngọt"] }),
      makeProductInfo({ key:"pepsi",             name:"Pepsi Lon 330ml",          description:"Pepsi lon 330ml lạnh.", price:20000, originalPrice:22000, category:CATEGORIES.DO_UONG, tags:["pepsi","nước ngọt"] }),
      makeProductInfo({ key:"sprite",            name:"Sprite Lon 330ml",         description:"Sprite chanh soda, thanh mát.", price:20000, originalPrice:22000, category:CATEGORIES.DO_UONG, tags:["sprite","soda"] }),
      makeProductInfo({ key:"nuoc-suoi",         name:"Nước Suối Lavie 500ml",    description:"Nước khoáng thiên nhiên Lavie 500ml.", price:10000, originalPrice:12000, category:CATEGORIES.DO_UONG, tags:["nước suối"] }),
      makeProductInfo({ key:"ca-phe-den",        name:"Cà Phê Đen Đá",           description:"Robusta Đắk Lắk rang xay tươi, pha phin, đá đập nhuyễn.", price:29000, originalPrice:35000, category:CATEGORIES.DO_UONG, tags:["cà phê","đen"] }),
      makeProductInfo({ key:"ca-phe-sua",        name:"Cà Phê Sữa Đá",           description:"Cà phê đen pha phin + sữa đặc Ông Thọ, đá đập.", price:32000, originalPrice:38000, category:CATEGORIES.DO_UONG, tags:["cà phê","sữa đặc"] }),
      makeProductInfo({ key:"nuoc-cam-ep",       name:"Nước Cam Ép Tươi",         description:"Cam Valencia ép tươi nguyên chất 350ml, không thêm đường.", price:35000, originalPrice:40000, category:CATEGORIES.DO_UONG, tags:["nước cam","tươi"] }),
    ];

    console.log("Checking image URLs...");
    const validatedProducts = [];
    const urlCache = new Map();

    for (const p of allProductInfos) {
      let finalUrl = p.imageUrl;
      
      if (!urlCache.has(finalUrl)) {
        try {
          const res = await fetch(finalUrl, { method: 'HEAD' });
          if (!res.ok) {
            console.log("Broken:", finalUrl, "Fallback to intelligent category match...");
            finalUrl = getFallback(p.key);
          }
        } catch (e) {
           console.log("Error checking:", finalUrl, "Fallback to intelligent category match...");
           finalUrl = getFallback(p.key);
        }
        urlCache.set(p.imageUrl, finalUrl);
      } else {
        finalUrl = urlCache.get(p.imageUrl);
      }
      
      delete p.key; // remove temp key
      p.imageUrl = finalUrl;
      p.imageUrls = [finalUrl];
      validatedProducts.push(p);
    }

    await productsCollection.deleteMany({});
    const result = await productsCollection.insertMany(validatedProducts);
    console.log("✅ Đã insert " + result.insertedCount + " products");

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
