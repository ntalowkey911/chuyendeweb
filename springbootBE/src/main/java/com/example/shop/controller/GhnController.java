package com.example.shop.controller;

import com.example.shop.service.GhnService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ghn")
@RequiredArgsConstructor
public class GhnController {

    private final GhnService ghnService;

    @GetMapping("/provinces")
    public Object getProvinces() {
        return ghnService.getProvinces();
    }

    @GetMapping("/districts")
    public Object getDistricts(@RequestParam int province_id) {
        return ghnService.getDistricts(province_id);
    }

    @GetMapping("/wards")
    public Object getWards(@RequestParam int district_id) {
        return ghnService.getWards(district_id);
    }

    @PostMapping("/fee")
    public Object calculateFee(@RequestBody Map<String, Object> request) {
        Number toDistrictIdNum = (Number) request.getOrDefault("to_district_id", request.get("toDistrictId"));
        if (toDistrictIdNum == null) {
            throw new IllegalArgumentException("to_district_id is required");
        }
        int toDistrictId = toDistrictIdNum.intValue();

        String toWardCode = (String) request.getOrDefault("to_ward_code", request.get("toWardCode"));
        if (toWardCode == null) {
            throw new IllegalArgumentException("to_ward_code is required");
        }

        Number weightNum = (Number) request.getOrDefault("weight", 800);
        Number lengthNum = (Number) request.getOrDefault("length", 20);
        Number widthNum  = (Number) request.getOrDefault("width", 15);
        Number heightNum = (Number) request.getOrDefault("height", 25);

        return ghnService.calculateFee(toDistrictId, toWardCode, weightNum.intValue(), lengthNum.intValue(), widthNum.intValue(), heightNum.intValue());
    }
}
