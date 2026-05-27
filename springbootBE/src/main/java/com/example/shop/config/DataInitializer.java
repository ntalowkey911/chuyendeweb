package com.example.shop.config;

import com.example.shop.model.Product;
import com.example.shop.model.ProductStatus;
import com.example.shop.model.Role;
import com.example.shop.model.User;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;
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
            productRepository.deleteAll();
            productRepository.saveAll(List.of(
                    product("Mít sấy giòn", "Múi mít chín vàng sấy giòn tự nhiên, thơm nhẹ và giữ vị ngọt đặc trưng.", "trai-cay-va-rau-cu-say", 89000, 120, now,
                            "https://images.unsplash.com/photo-1615485925873-7ecbbe90f4a3?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=640&q=70"),
                    product("Chuối sấy dẻo", "Chuối chín cây cắt lát, sấy dẻo vừa phải, phù hợp ăn nhẹ mỗi ngày.", "trai-cay-va-rau-cu-say", 65000, 150, now,
                            "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=640&q=70"),
                    product("Xoài sấy chua ngọt", "Xoài cắt lát dày, vị chua ngọt cân bằng, màu vàng đẹp mắt.", "trai-cay-va-rau-cu-say", 79000, 130, now,
                            "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=640&q=70"),
                    product("Khoai lang sấy giòn", "Khoai lang tím và vàng được sấy lát mỏng, giòn thơm, ít dầu.", "trai-cay-va-rau-cu-say", 72000, 110, now,
                            "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=70"),
                    product("Hồng treo gió", "Hồng treo gió dẻo ngọt tự nhiên, mềm bên trong và thơm dịu.", "trai-cay-va-rau-cu-say", 165000, 80, now,
                            "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1603048297610-3d9e93f36bcb?auto=format&fit=crop&w=640&q=70"),
                    product("Combo mix trái cây sấy", "Hộp mix mít, xoài, chuối và khoai lang sấy, tiện dùng làm quà hoặc ăn vặt.", "trai-cay-va-rau-cu-say", 149000, 70, now,
                            "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=640&q=70"),

                    product("Hạt điều rang muối", "Hạt điều loại lớn, rang chín đều, vị béo bùi tự nhiên.", "cac-loai-hat-va-dau", 135000, 140, now,
                            "https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=640&q=70"),
                    product("Hạt sen sấy", "Hạt sen sấy giòn nhẹ, thích hợp dùng ăn vặt hoặc nấu chè.", "cac-loai-hat-va-dau", 98000, 90, now,
                            "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1603048719539-9ecb59e4c243?auto=format&fit=crop&w=640&q=70"),
                    product("Hạnh nhân nguyên hạt", "Hạnh nhân giàu dinh dưỡng, rang mộc, hương vị thanh và béo.", "cac-loai-hat-va-dau", 155000, 95, now,
                            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1590086782792-42dd2350140d?auto=format&fit=crop&w=640&q=70"),
                    product("Đậu phộng tỏi ớt", "Đậu phộng rang giòn phủ tỏi ớt, vị đậm đà dùng ăn chơi hoặc ăn kèm.", "cac-loai-hat-va-dau", 48000, 160, now,
                            "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1599909533540-6f3d3f0f0b8a?auto=format&fit=crop&w=640&q=70"),
                    product("Đỗ xanh cà vỏ", "Đỗ xanh khô sạch, hạt đều, dùng nấu chè, xôi hoặc làm bánh.", "cac-loai-hat-va-dau", 42000, 170, now,
                            "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=640&q=70"),
                    product("Hạt chia nhập khẩu", "Hạt chia đen giàu chất xơ, phù hợp pha nước, ăn kèm sữa chua hoặc yến mạch.", "cac-loai-hat-va-dau", 119000, 100, now,
                            "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=640&q=70"),

                    product("Gạo thơm đặc sản", "Gạo hạt dài, nấu dẻo vừa, phù hợp bữa cơm gia đình hằng ngày.", "luong-thuc-va-tinh-bot", 210000, 75, now,
                            "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=640&q=70"),
                    product("Miến khô dong", "Miến dong sợi dai, trong, ít bở khi nấu canh hoặc trộn.", "luong-thuc-va-tinh-bot", 58000, 125, now,
                            "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=640&q=70"),
                    product("Nui ống cao cấp", "Nui ống làm từ lúa mì, dễ chế biến cho món xào, súp hoặc salad.", "luong-thuc-va-tinh-bot", 46000, 135, now,
                            "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=640&q=70"),
                    product("Bún phở khô", "Sợi bún phở khô trắng, mềm sau khi trụng, tiện trữ trong bếp.", "luong-thuc-va-tinh-bot", 51000, 145, now,
                            "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=640&q=70"),
                    product("Mì ăn liền thùng", "Thùng mì ăn liền tiện lợi cho gia đình hoặc văn phòng.", "luong-thuc-va-tinh-bot", 132000, 90, now,
                            "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=640&q=70"),
                    product("Yến mạch cán dẹt", "Yến mạch nguyên cám cán dẹt, dùng nấu cháo, overnight oats hoặc làm bánh.", "luong-thuc-va-tinh-bot", 93000, 118, now,
                            "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1571748982800-fa51082c2224?auto=format&fit=crop&w=640&q=70"),

                    product("Nấm hương khô", "Tai nấm dày, thơm đậm, thích hợp nấu canh, xào hoặc hầm.", "nam-va-rong-bien", 112000, 88, now,
                            "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1603048719539-9ecb59e4c243?auto=format&fit=crop&w=640&q=70"),
                    product("Mộc nhĩ khô", "Mộc nhĩ sạch, nở tốt sau khi ngâm, phù hợp làm chả giò và món xào.", "nam-va-rong-bien", 68000, 112, now,
                            "https://images.unsplash.com/photo-1604908176997-431e4a8f29d6?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=640&q=70"),
                    product("Rong biển khô", "Rong biển sấy khô tiện dùng nấu canh, cuộn cơm hoặc ăn vặt.", "nam-va-rong-bien", 76000, 140, now,
                            "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=640&q=70",
                            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=640&q=70")
            ));
        }
    }

    private boolean shouldReseedProducts() {
        if (productRepository.count() == 0) {
            return true;
        }
        return productRepository.findAll().stream().anyMatch(product ->
                "electronics".equalsIgnoreCase(product.getCategory()) ||
                "accessories".equalsIgnoreCase(product.getCategory())
        );
    }

    private Product product(
            String name,
            String description,
            String category,
            int price,
            int stock,
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
                .brand("Nông sản sấy & pantry")
                .stock(stock)
                .status(ProductStatus.ACTIVE)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }
}
