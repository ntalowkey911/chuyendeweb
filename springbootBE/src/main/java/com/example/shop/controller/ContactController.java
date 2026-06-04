package com.example.shop.controller;

import com.example.shop.dto.contact.ContactRequest;
import com.example.shop.dto.contact.ContactResponse;
import com.example.shop.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {
    
    private final ContactService contactService;
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse submitContact(@Valid @RequestBody ContactRequest request) {
        return contactService.submitContact(request);
    }
}
