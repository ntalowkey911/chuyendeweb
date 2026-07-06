package com.example.shop.controller;

import com.example.shop.dto.ChatbotRequest;
import com.example.shop.dto.ChatbotResponse;
import com.example.shop.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.example.shop.model.ChatHistory;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/chat")
    public ResponseEntity<ChatbotResponse> chat(@RequestBody ChatbotRequest request) {
        String reply = chatbotService.chatWithGemini(request.getUserId(), request.getMessage());
        return ResponseEntity.ok(ChatbotResponse.builder().reply(reply).build());
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ChatHistory>> getHistory(@PathVariable String userId) {
        return ResponseEntity.ok(chatbotService.getChatHistory(userId));
    }
}
