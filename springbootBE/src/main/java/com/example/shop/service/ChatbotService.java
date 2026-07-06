package com.example.shop.service;

import com.example.shop.model.Product;
import com.example.shop.repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.example.shop.model.ChatHistory;
import com.example.shop.repository.ChatHistoryRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotService {

    private final ProductRepository productRepository;
    private final ChatHistoryRepository chatHistoryRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public List<ChatHistory> getChatHistory(String userId) {
        return chatHistoryRepository.findByUserIdOrderByCreatedAtAsc(userId);
    }

    public String chatWithGemini(String userId, String userMessage) {
        try {
            List<Product> chickenProducts = productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrBrandContainingIgnoreCase(
                    "gà", "gà", "gà", "gà"
            );

            List<Product> topProducts = chickenProducts.stream().limit(15).toList();

            String productsInfo = topProducts.stream()
                    .map(p -> String.format("- ID: %s | Tên: %s | Giá: %s VNĐ | Mô tả: %s", 
                            p.getId(), p.getName(), p.getPrice(), p.getDescription() != null ? p.getDescription() : "Không có"))
                    .collect(Collectors.joining("\n"));

            // Tạo prompt
            String prompt = String.format(
                    "Bạn là một trợ lý AI tư vấn món ăn của một trang web thương mại điện tử bán đồ ăn nhanh. Dưới đây là danh sách các món ăn hiện có trong thực đơn (được lấy từ cơ sở dữ liệu):\n%s\n\nNgười dùng hỏi: \"%s\"\n\n" +
                    "Hãy tư vấn cho người dùng một cách thân thiện, tự nhiên, và tuân thủ các quy tắc sau:\n" +
                    "1. YÊU CẦU ĐỊNH DẠNG BẮT BUỘC: Khi liệt kê món ăn, bạn phải trình bày thành một danh sách (bullet points), mỗi món 1 dòng riêng biệt. Tên món ăn phải được chèn link URL theo đúng cú pháp Markdown để trỏ về trang chi tiết sản phẩm: [Tên món ăn](/product/ID_CỦA_MÓN).\n" +
                    "2. Tuyệt đối TRÁNH gọi trùng lặp món ăn. Mỗi món chỉ liệt kê 1 lần.\n" +
                    "3. Nếu không có đủ món phù hợp, có thể đề xuất ít hơn, không nhất thiết phải luôn đề xuất 5 món.\n" +
                    "4. Nếu người dùng chọn MÓN CAY, hãy tinh tế đề xuất thêm đồ uống giải khát (nước ngọt) và nhắc nhở họ về các VOUCHER khuyến mãi nếu họ mua theo combo lớn.\n\n" +
                    "Ví dụ mẫu:\n* [Gà Rán Giòn](/product/65a1234...) - Giá: 75.000 VNĐ - Lời giới thiệu hấp dẫn...",
                    productsInfo, userMessage
            );

            // Log kiểm tra xem Spring Boot có lấy đúng key không (chỉ in 5 ký tự đầu để bảo mật)
            String maskedKey = (geminiApiKey != null && geminiApiKey.length() > 5) 
                    ? geminiApiKey.substring(0, 5) + "..." : "EMPTY_OR_SHORT";
            log.info("Đang gọi Gemini API với Key bắt đầu bằng: {}", maskedKey);

            // Gọi API Gemini (Đưa key trở lại URL vì API của Google yêu cầu key nằm ở query parameter)
            String requestUrlString = geminiApiUrl.trim() + "?key=" + geminiApiKey.trim();
            java.net.URI requestUri = java.net.URI.create(requestUrlString);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", new Object[]{textPart});

            Map<String, Object> requestBodyMap = new HashMap<>();
            requestBodyMap.put("contents", new Object[]{parts});

            String requestBody = objectMapper.writeValueAsString(requestBodyMap);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(requestUri, entity, String.class);

            // Parse kết quả trả về từ Gemini
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode textNode = rootNode.path("candidates").get(0)
                    .path("content").path("parts").get(0).path("text");
            
            String replyText = textNode.asText();

            // Lưu lịch sử nếu người dùng đã đăng nhập
            if (userId != null && !userId.trim().isEmpty()) {
                ChatHistory history = ChatHistory.builder()
                        .userId(userId)
                        .userMessage(userMessage)
                        .botReply(replyText)
                        .build();
                chatHistoryRepository.save(history);
            }

            return replyText;

        } catch (Exception e) {
            log.error("Error communicating with Gemini API", e);
            return "Xin lỗi, tôi đang gặp sự cố khi kết nối tới hệ thống tư vấn AI. Vui lòng thử lại sau.";
        }
    }
}
