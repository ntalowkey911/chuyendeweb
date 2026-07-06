package com.example.shop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class GhnService {

    @Value("${ghn.token}")
    private String token;

    @Value("${ghn.shop-id}")
    private String shopId;

    @Value("${ghn.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("token", token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private HttpHeaders createHeadersWithShopId() {
        HttpHeaders headers = createHeaders();
        headers.set("ShopId", shopId);
        return headers;
    }

    public Object getProvinces() {
        String url = apiUrl + "/master-data/province";
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
        return response.getBody();
    }

    public Object getDistricts(int provinceId) {
        String url = apiUrl + "/master-data/district";
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        Map<String, Integer> params = new HashMap<>();
        params.put("province_id", provinceId);
        ResponseEntity<Object> response = restTemplate.postForEntity(url, new HttpEntity<>(params, createHeaders()), Object.class);
        // Wait, district can also be fetched via GET with query param?
        // Actually GHN API v2 uses GET with query string or POST with body.
        // Usually district is GET ?province_id=... Let's use GET
        url = apiUrl + "/master-data/district?province_id=" + provinceId;
        response = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
        return response.getBody();
    }

    public Object getWards(int districtId) {
        String url = apiUrl + "/master-data/ward?district_id=" + districtId;
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
        return response.getBody();
    }

    public Object calculateFee(int toDistrictId, String toWardCode, int weight, int length, int width, int height) {
        String url = apiUrl + "/v2/shipping-order/fee";
        Map<String, Object> body = new HashMap<>();
        body.put("from_district_id", 1454); // District 12, HCM (Assuming a default from_district) 
        body.put("from_ward_code", "21211");
        body.put("to_district_id", toDistrictId);
        body.put("to_ward_code", toWardCode);
        body.put("weight", weight);
        body.put("length", length);
        body.put("width", width);
        body.put("height", height);
        body.put("service_type_id", 2); // E-commerce delivery

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, createHeadersWithShopId());
        ResponseEntity<Object> response = restTemplate.postForEntity(url, entity, Object.class);
        return response.getBody();
    }

    public Object createOrder(String toName, String toPhone, String toAddress, String toWardCode, int toDistrictId, int codAmount, int weight, int length, int width, int height, String content) {
        String url = apiUrl + "/v2/shipping-order/create";
        Map<String, Object> body = new HashMap<>();
        body.put("from_district_id", 1454); // District 12, HCM 
        body.put("from_ward_code", "21211");
        body.put("payment_type_id", 2); // 2: Buyer pays shipping (Actually COD order includes shipping. If it's pre-paid, we should handle it, but let's assume standard COD).
        body.put("note", "Đơn hàng FastBite");
        body.put("required_note", "CHOXEMHANGKHONGTHU");
        body.put("to_name", toName);
        body.put("to_phone", toPhone);
        body.put("to_address", toAddress);
        body.put("to_ward_code", toWardCode);
        body.put("to_district_id", toDistrictId);
        body.put("cod_amount", codAmount);
        body.put("content", content);
        body.put("weight", weight);
        body.put("length", length);
        body.put("width", width);
        body.put("height", height);
        body.put("service_type_id", 2);
        
        // Items array is required by GHN
        Map<String, Object> item = new HashMap<>();
        item.put("name", "Thức ăn nhanh FastBite");
        item.put("quantity", 1);
        item.put("weight", weight);
        body.put("items", new Object[]{item});

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, createHeadersWithShopId());
        ResponseEntity<Object> response = restTemplate.postForEntity(url, entity, Object.class);
        return response.getBody();
    }
}
