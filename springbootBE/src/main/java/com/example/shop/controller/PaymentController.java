package com.example.shop.controller;

import com.example.shop.config.VNPayConfig;
import com.example.shop.model.Order;
import com.example.shop.model.OrderStatus;
import com.example.shop.repository.OrderRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepository;

    @GetMapping("/create")
    public ResponseEntity<?> createPayment(@RequestParam String orderId, HttpServletRequest request) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Order not found"));
        }
        Order order = orderOpt.get();

        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_OrderInfo = "Thanh toan don hang " + order.getOrderCode();
            String vnp_OrderType = "other";
            String vnp_TxnRef = String.valueOf(order.getOrderCode());
            String vnp_IpAddr = VNPayConfig.getIpAddress(request);
            String vnp_TmnCode = vnPayConfig.getTmnCode();

            long amount = order.getTotalAmount().longValue() * 100L; // VNPay uses cents (VND * 100)

            Map<String, String> vnp_Params = new TreeMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.put("vnp_OrderType", vnp_OrderType);
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            // Build query URL using standard VNPAY logic
            StringBuilder query = new StringBuilder();
            
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    // Build query (Encoded value)
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                    }
                }
            }
            
            String queryStr = query.toString();
            String vnp_SecureHash = VNPayConfig.hashAllFields(vnp_Params, vnPayConfig.getHashSecret());
            
            System.out.println("====== VNPAY DEBUG ======");
            System.out.println("vnp_HashSecret: " + vnPayConfig.getHashSecret());
            System.out.println("queryUrl: " + queryStr);
            System.out.println("vnp_SecureHash: " + vnp_SecureHash);
            System.out.println("=========================");
            
            String paymentUrl = vnPayConfig.getPayUrl() + "?" + queryStr + "&vnp_SecureHash=" + vnp_SecureHash;
            System.out.println("FINAL PAYMENT URL: " + paymentUrl);

            return ResponseEntity.ok(Map.of("status", "ok", "url", paymentUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create payment link: " + e.getMessage()));
        }
    }

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendBaseUrl;

    @GetMapping("/vnpay_return")
    public void paymentReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {
        String frontendUrl = frontendBaseUrl + "/payment/vnpay-return";
        try {
            String vnp_SecureHash = params.get("vnp_SecureHash");
            if (vnp_SecureHash == null) {
                response.sendRedirect(frontendUrl + "?status=error&message=" + URLEncoder.encode("Missing secure hash", StandardCharsets.UTF_8));
                return;
            }

            // Remove signature parameters from signature verification
            Map<String, String> vnp_Params = new HashMap<>(params);
            vnp_Params.remove("vnp_SecureHash");
            vnp_Params.remove("vnp_SecureHashType");

            // Sort keys
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            
            String calculatedHash = VNPayConfig.hashAllFields(vnp_Params, vnPayConfig.getHashSecret());
            if (!calculatedHash.equalsIgnoreCase(vnp_SecureHash)) {
                response.sendRedirect(frontendUrl + "?status=error&message=" + URLEncoder.encode("Signature verification failed", StandardCharsets.UTF_8));
                return;
            }

            String vnp_ResponseCode = params.get("vnp_ResponseCode");
            String vnp_TxnRef = params.get("vnp_TxnRef");
            if (vnp_TxnRef == null) {
                response.sendRedirect(frontendUrl + "?status=error&message=" + URLEncoder.encode("Missing transaction reference", StandardCharsets.UTF_8));
                return;
            }

            Long orderCode = Long.parseLong(vnp_TxnRef);
            Optional<Order> orderOpt = orderRepository.findByOrderCode(orderCode);
            if (orderOpt.isEmpty()) {
                response.sendRedirect(frontendUrl + "?status=error&message=" + URLEncoder.encode("Order not found", StandardCharsets.UTF_8));
                return;
            }
            Order order = orderOpt.get();

            if ("00".equals(vnp_ResponseCode)) {
                if (order.getStatus() == OrderStatus.PENDING) {
                    order.setStatus(OrderStatus.CONFIRMED);
                    orderRepository.save(order);
                }
                response.sendRedirect(frontendUrl + "?status=success");
            } else {
                response.sendRedirect(frontendUrl + "?status=error&message=" + URLEncoder.encode("Payment failed with response code: " + vnp_ResponseCode, StandardCharsets.UTF_8));
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(frontendUrl + "?status=error&message=" + URLEncoder.encode("Error verifying payment: " + e.getMessage(), StandardCharsets.UTF_8));
        }
    }
}
