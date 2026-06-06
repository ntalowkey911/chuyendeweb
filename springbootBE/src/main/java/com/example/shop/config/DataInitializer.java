package com.example.shop.config;

import com.example.shop.model.Product;
import com.example.shop.model.ProductStatus;
import com.example.shop.model.Promotion;
import com.example.shop.model.DiscountType;
import com.example.shop.model.Role;
import com.example.shop.model.User;
import com.example.shop.model.Category;
import com.example.shop.repository.CategoryRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.PromotionRepository;
import com.example.shop.repository.UserRepository;
import com.example.shop.repository.ArticleRepository;
import com.example.shop.model.Article;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PromotionRepository promotionRepository;
    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@shop.com")) {
            userRepository.save(User.builder()
                    .fullName("Shop Admin")
                    .email("admin@shop.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("0900000001")
                    .address("TP.HCM")
                    .role(Role.ADMIN)
                    .createdAt(Instant.now())
                    .build());
        }

        if (shouldReseedProducts()) {
            Instant now = Instant.now();
            
            // Seed Categories
            categoryRepository.deleteAll();
            categoryRepository.saveAll(List.of(
                    Category.builder().name("Combo / Khuyến Mãi").slug("combo-khuyen-mai").description("Những combo ăn no nê siêu tiết kiệm.").createdAt(now).updatedAt(now).build(),
                    Category.builder().name("Best Sellers").slug("best-sellers").description("Những món bán chạy nhất của FastBite.").createdAt(now).updatedAt(now).build(),
                    Category.builder().name("Món Mới").slug("mon-moi").description("Những món ăn mới ra mắt.").createdAt(now).updatedAt(now).build(),
                    Category.builder().name("Món Chính").slug("mon-chinh").description("Gà rán, Burger, Hotdog cực ngon.").createdAt(now).updatedAt(now).build(),
                    Category.builder().name("Món Ăn Kèm").slug("mon-an-kem").description("Khoai tây chiên, phô mai que và salad.").createdAt(now).updatedAt(now).build(),
                    Category.builder().name("Đồ Uống").slug("do-uong").description("Trà sữa, nước ngọt, giải khát mát lạnh.").createdAt(now).updatedAt(now).build(),
                    Category.builder().name("Tráng Miệng").slug("trang-mieng").description("Kem và bánh tart tuyệt đỉnh.").createdAt(now).updatedAt(now).build()
            ));

            productRepository.deleteAll();
            productRepository.saveAll(List.of(
product("Burger Bò Phô Mai", "Burger bò nướng chuẩn vị, phô mai Cheddar.", "mon-chinh", 65000, 100, 45, now, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop&auto=format"),
product("Burger Gà Giòn", "Gà chiên giòn rụm kẹp xà lách tươi.", "mon-chinh", 55000, 80, 20, now, "https://images.unsplash.com/photo-1606755962773-d324e9a13086?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1606755962773-d324e9a13086?w=800&h=800&fit=crop&auto=format"),
product("Burger Tôm Biển", "Nhân tôm băm nguyên chất chiên xù.", "mon-chinh", 69000, 50, 15, now, "https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=800&h=800&fit=crop&auto=format"),
product("Burger Nướng BBQ", "Thịt bò nướng phủ sốt BBQ đậm đà.", "mon-chinh", 75000, 60, 30, now, "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=800&fit=crop&auto=format"),
product("Gà Rán (1 Miếng)", "Đùi gà chiên giòn truyền thống.", "mon-chinh", 35000, 200, 150, now, "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&h=800&fit=crop&auto=format"),
product("Gà Rán (3 Miếng)", "Combo 3 miếng gà giòn rụm.", "mon-chinh", 99000, 100, 80, now, "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&h=800&fit=crop&auto=format"),
product("Gà Sốt Cay Hàn Quốc", "Gà phủ sốt cay ngọt vị Hàn.", "mon-chinh", 45000, 120, 90, now, "https://images.unsplash.com/photo-1614398751058-eb2e0bf63e53?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1614398751058-eb2e0bf63e53?w=800&h=800&fit=crop&auto=format"),
product("Pizza Xúc Xích (Size M)", "Pizza đế mỏng nướng củi cùng xúc xích bò.", "mon-chinh", 119000, 40, 25, now, "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop&auto=format"),
product("Pizza Hải Sản (Size M)", "Pizza ngập tràn tôm, mực và phô mai.", "mon-chinh", 139000, 30, 10, now, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=800&fit=crop&auto=format"),
product("Hotdog Mỹ Tráng Phô Mai", "Xúc xích Đức kẹp bánh mì mềm.", "mon-chinh", 45000, 80, 60, now, "https://images.unsplash.com/photo-1619740455993-9d622fc58912?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1619740455993-9d622fc58912?w=800&h=800&fit=crop&auto=format"),
product("Khoai Tây Chiên (Size S)", "Khoai tây chiên muối kiểu Mỹ.", "mon-an-kem", 20000, 300, 200, now, "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=800&fit=crop&auto=format"),
product("Khoai Tây Chiên (Size L)", "Khoai tây chiên cỡ lớn chia sẻ.", "mon-an-kem", 35000, 200, 150, now, "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&h=800&fit=crop&auto=format"),
product("Khoai Tây Lắc Phô Mai", "Khoai chiên rắc bột phô mai béo ngậy.", "mon-an-kem", 39000, 150, 100, now, "https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&h=800&fit=crop&auto=format"),
product("Phô Mai Que (5 Thanh)", "Phô mai Mozzarella kéo sợi.", "mon-an-kem", 45000, 100, 80, now, "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=800&h=800&fit=crop&auto=format"),
product("Gà Viên Chiên (10 Viên)", "Thịt gà viên chiên giòn ăn kèm tương ớt.", "mon-an-kem", 40000, 120, 95, now, "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&h=800&fit=crop&auto=format"),
product("Xúc Xích Chiên Bơ", "Xúc xích khía tỉa hoa chiên bơ tỏi.", "mon-an-kem", 25000, 150, 70, now, "https://images.unsplash.com/photo-1585325701165-ec06c01f5d12?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1585325701165-ec06c01f5d12?w=800&h=800&fit=crop&auto=format"),
product("Salad Rau Trộn Dầu Giấm", "Xà lách, cà chua bi thanh mát.", "mon-an-kem", 30000, 80, 40, now, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=800&fit=crop&auto=format"),
product("Salad Cá Ngừ", "Salad trộn cá ngừ ngâm dầu béo ngậy.", "mon-an-kem", 45000, 60, 25, now, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop&auto=format"),
product("Súp Cua Măng Tây", "Súp cua nóng hổi khai vị.", "mon-an-kem", 35000, 50, 30, now, "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=800&fit=crop&auto=format"),
product("Súp Bí Đỏ Kem Tươi", "Súp bí đỏ sánh mịn ăn kèm bánh mì nướng.", "mon-an-kem", 30000, 40, 15, now, "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&h=800&fit=crop&auto=format"),
product("Trà Sữa Trân Châu Đen", "Hồng trà sữa cùng trân châu dai giòn.", "do-uong", 35000, 250, 210, now, "https://images.unsplash.com/photo-1558857563-b371033873b8?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1558857563-b371033873b8?w=800&h=800&fit=crop&auto=format"),
product("Trà Sữa Matcha", "Trà sữa vị trà xanh Nhật Bản.", "do-uong", 40000, 150, 90, now, "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&h=800&fit=crop&auto=format"),
product("Trà Đào Cam Sả", "Trà trái cây giải nhiệt mùa hè.", "do-uong", 39000, 200, 180, now, "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop&auto=format"),
product("Trà Vải Nhiệt Đới", "Hồng trà ủ lạnh cùng trái vải ngâm.", "do-uong", 39000, 180, 140, now, "https://images.unsplash.com/photo-1571006682768-e22ed870ba3a?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1571006682768-e22ed870ba3a?w=800&h=800&fit=crop&auto=format"),
product("Coca Cola Lon", "Nước ngọt có ga sảng khoái.", "do-uong", 15000, 500, 400, now, "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&h=800&fit=crop&auto=format"),
product("Pepsi Lon", "Nước ngọt có ga ướp lạnh.", "do-uong", 15000, 500, 350, now, "https://images.unsplash.com/photo-1568901839119-631418a3910d?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1568901839119-631418a3910d?w=800&h=800&fit=crop&auto=format"),
product("Sprite Lon", "Nước chanh có ga.", "do-uong", 15000, 300, 200, now, "https://images.unsplash.com/photo-1543253687-c931c8e01820?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1543253687-c931c8e01820?w=800&h=800&fit=crop&auto=format"),
product("Nước Suối Dasani", "Nước tinh khiết 500ml.", "do-uong", 10000, 200, 50, now, "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop&auto=format"),
product("Cà Phê Đen Đá", "Cà phê pha phin truyền thống.", "do-uong", 20000, 100, 80, now, "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&h=800&fit=crop&auto=format"),
product("Cà Phê Sữa Đá", "Cà phê sữa đặc đậm đà.", "do-uong", 25000, 120, 100, now, "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=800&fit=crop&auto=format"),
product("Kem Tươi Vanilla", "Kem ốc quế vị truyền thống.", "trang-mieng", 10000, 150, 120, now, "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800&h=800&fit=crop&auto=format"),
product("Kem Tươi Chocolate", "Kem ốc quế vị socola đắng nhẹ.", "trang-mieng", 12000, 120, 90, now, "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=800&h=800&fit=crop&auto=format"),
product("Bánh Tart Trứng", "Bánh nướng ngàn lớp nhân kem trứng.", "trang-mieng", 25000, 100, 85, now, "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop&auto=format"),
product("Bánh Tiramisu", "Bánh xốp cà phê phong cách Ý.", "trang-mieng", 45000, 50, 40, now, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=800&fit=crop&auto=format"),
product("Bánh Flan Caramel", "Bánh flan mềm mịn phủ đường cháy.", "trang-mieng", 20000, 80, 70, now, "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=800&h=800&fit=crop&auto=format"),
product("Panna Cotta Dâu", "Panna cotta núng nính phủ mứt dâu.", "trang-mieng", 35000, 60, 30, now, "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800&h=800&fit=crop&auto=format"),
product("Sữa Chua Hạt Đác", "Sữa chua nhà làm lên men tự nhiên.", "trang-mieng", 25000, 70, 45, now, "https://images.unsplash.com/photo-1571167366136-d0a07a24d0bf?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1571167366136-d0a07a24d0bf?w=800&h=800&fit=crop&auto=format"),
product("Trái Cây Theo Mùa", "Đĩa trái cây gọt sẵn tươi mát.", "trang-mieng", 30000, 40, 20, now, "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&h=800&fit=crop&auto=format"),
product("Bánh Muffin Nho", "Bánh nướng xốp nhỏ thêm nho khô.", "trang-mieng", 22000, 60, 25, now, "https://images.unsplash.com/photo-1558303657-45f8e1e2b67a?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1558303657-45f8e1e2b67a?w=800&h=800&fit=crop&auto=format"),
product("Bánh Chocolate Lava", "Bánh socola chảy nhân nóng hổi.", "trang-mieng", 55000, 40, 15, now, "https://images.unsplash.com/photo-1617953141905-b27fb1f69fb2?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1617953141905-b27fb1f69fb2?w=800&h=800&fit=crop&auto=format"),
product("Combo Sinh Viên 1", "1 Burger Gà + 1 Nước ngọt.", "combo-khuyen-mai", 59000, 100, 80, now, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format"),
product("Combo Sinh Viên 2", "1 Cơm gà + 1 Trà sữa.", "combo-khuyen-mai", 69000, 100, 75, now, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format"),
product("Combo Tình Yêu", "2 Burger Bò + 2 Nước + 1 Khoai L.", "combo-khuyen-mai", 149000, 50, 40, now, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format"),
product("Combo Gia Đình", "4 Miếng gà + 1 Pizza M + 4 Nước.", "combo-khuyen-mai", 299000, 30, 20, now, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format"),
product("Combo Vui Vẻ", "1 Gà rán + 1 Khoai S + 1 Kem.", "combo-khuyen-mai", 65000, 80, 60, now, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format"),
product("Combo Ăn Vặt", "1 Phô mai que + 1 Xúc xích + 2 Trà đào.", "combo-khuyen-mai", 110000, 60, 45, now, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format"),
product("Combo Xem Phim", "2 Gà viên + 1 Khoai L + 2 Nước.", "combo-khuyen-mai", 130000, 50, 35, now, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format"),
product("Combo Bữa Trưa", "1 Burger Tôm + 1 Salad + 1 Nước.", "combo-khuyen-mai", 99000, 70, 50, now, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format"),
product("Combo Chống Đói", "2 Miếng gà rán + 1 Bánh Tart.", "combo-khuyen-mai", 85000, 90, 60, now, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format"),
product("Combo Trà Chiều", "2 Trà sữa + 1 Tiramisu + 1 Bánh Flan.", "combo-khuyen-mai", 120000, 40, 25, now, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format", "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop&auto=format")
            ));
        }

        if (promotionRepository.count() == 0) {
            promotionRepository.saveAll(List.of(
                    Promotion.builder()
                            .code("WELCOME10")
                            .description("Giảm 10% cho đơn hàng bất kỳ")
                            .discountType(DiscountType.PERCENTAGE)
                            .discountValue(BigDecimal.valueOf(10))
                            .isActive(true)
                            .usedCount(0)
                            .createdAt(Instant.now())
                            .build(),
                    Promotion.builder()
                            .code("FREESHIP50")
                            .description("Giảm 50k cho đơn từ 500k")
                            .discountType(DiscountType.FIXED_AMOUNT)
                            .discountValue(BigDecimal.valueOf(50000))
                            .minOrderValue(BigDecimal.valueOf(500000))
                            .isActive(true)
                            .usedCount(0)
                            .createdAt(Instant.now())
                            .build(),
                    Promotion.builder()
                            .code("SUMMER20")
                            .description("Giảm 20% tối đa 100k")
                            .discountType(DiscountType.PERCENTAGE)
                            .discountValue(BigDecimal.valueOf(20))
                            .maxDiscount(BigDecimal.valueOf(100000))
                            .isActive(true)
                            .usedCount(0)
                            .createdAt(Instant.now())
                            .build(),
                    Promotion.builder()
                            .code("FLASH500")
                            .description("Giảm 500k (Chỉ 5 lượt)")
                            .discountType(DiscountType.FIXED_AMOUNT)
                            .discountValue(BigDecimal.valueOf(500000))
                            .usageLimit(5)
                            .isActive(true)
                            .usedCount(0)
                            .createdAt(Instant.now())
                            .build()
            ));
        }
        if (articleRepository.count() == 0 || true) { // Always reseed for now to ensure it runs
            // Seed Articles
            Instant now = Instant.now();
            articleRepository.deleteAll();
            articleRepository.saveAll(List.of(
                    Article.builder()
                            .title("FastBite Khai Trương Chi Nhánh Mới Tại TP.HCM")
                            .slug("fastbite-khai-truong-chi-nhanh-moi")
                            .summary("Tưng bừng khai trương chi nhánh thứ 10 tại trung tâm TP.HCM với hàng ngàn ưu đãi hấp dẫn.")
                            .content("<p>Chào mừng bạn đến với chi nhánh mới nhất của FastBite tại TP.HCM! Trong tuần lễ khai trương, chúng tôi mang đến những chương trình khuyến mãi chưa từng có. Tặng ngay 1 phần gà chiên giòn cho mỗi hoá đơn trên 200K.</p><p>Đừng bỏ lỡ cơ hội thưởng thức những món ăn nhanh tuyệt hảo trong không gian hiện đại và ấm cúng!</p>")
                            .imageUrl("https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop")
                            .author("Admin")
                            .isActive(true)
                            .createdAt(now)
                            .updatedAt(now)
                            .build(),
                    Article.builder()
                            .title("Bí Quyết Làm Nên Chiếc Burger Bò Hoàn Hảo")
                            .slug("bi-quyet-lam-burger-bo")
                            .summary("Khám phá công thức độc quyền đằng sau món Burger Bò trứ danh của FastBite.")
                            .content("<p>Một chiếc burger hoàn hảo bắt đầu từ những nguyên liệu tươi ngon nhất. Tại FastBite, chúng tôi sử dụng 100% thịt bò nhập khẩu, nướng trên ngọn lửa hồng để giữ trọn vị ngọt tự nhiên.</p><p>Kết hợp cùng phô mai Cheddar tan chảy và lớp vỏ bánh mềm mịn được nướng mỗi sáng, Burger Bò của chúng tôi chắc chắn sẽ làm bạn say đắm ngay từ miếng cắn đầu tiên.</p>")
                            .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop")
                            .author("Đầu bếp trưởng")
                            .isActive(true)
                            .createdAt(now)
                            .updatedAt(now)
                            .build(),
                    Article.builder()
                            .title("Top 5 Món Ăn Bán Chạy Nhất Tháng Qua")
                            .slug("top-5-mon-an-ban-chay")
                            .summary("Cùng điểm lại những món ăn được khách hàng yêu thích nhất trong tháng vừa qua tại hệ thống FastBite.")
                            .content("<p>Tháng này, Burger Gà Giòn tiếp tục giữ vững ngôi vương! Cùng với đó là sự vươn lên ngoạn mục của Gà Rán Sốt Cay và Pizza Hải Sản.</p><ul><li>1. Burger Gà Giòn</li><li>2. Gà Rán Sốt Cay (Combo 3 miếng)</li><li>3. Pizza Hải Sản (Cỡ Lớn)</li><li>4. Khoai Tây Chiên Phô Mai</li><li>5. Trà Sữa Trân Châu Đường Đen</li></ul><p>Bạn đã thử qua tất cả chưa? Hãy đặt hàng ngay hôm nay!</p>")
                            .imageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop")
                            .author("Admin")
                            .isActive(true)
                            .createdAt(now)
                            .updatedAt(now)
                            .build()
            ));
        }
    }

    private boolean shouldReseedProducts() {
        return false; // Disabled reseed so we don't overwrite manual MongoDB script updates
    }

    private Product product(
            String name,
            String description,
            String category,
            int price,
            int stock,
            int soldCount,
            Instant now,
            String primaryImage,
            String secondaryImage
    ) {
        return Product.builder()
                .name(name)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .imageUrl(primaryImage)
                .imageUrls(List.of(primaryImage, secondaryImage))
                .category(category)
                .brand("FastBite")
                .stock(stock)
                .soldCount(soldCount)
                .status(ProductStatus.ACTIVE)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }
}
