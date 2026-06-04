package com.example.shop.service;

import com.example.shop.dto.PageResponse;
import com.example.shop.dto.contact.ContactRequest;
import com.example.shop.dto.contact.ContactResponse;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.model.Contact;
import com.example.shop.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {
    
    private final ContactRepository contactRepository;
    
    public ContactResponse submitContact(ContactRequest request) {
        Contact contact = Contact.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .isRead(false)
                .build();
                
        contact = contactRepository.save(contact);
        return mapToResponse(contact);
    }
    
    public PageResponse<ContactResponse> getAllContacts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Contact> contactPage = contactRepository.findAll(pageable);
        
        List<ContactResponse> content = contactPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
        return PageResponse.<ContactResponse>builder()
                .content(content)
                .pageNo(contactPage.getNumber())
                .pageSize(contactPage.getSize())
                .totalElements(contactPage.getTotalElements())
                .totalPages(contactPage.getTotalPages())
                .last(contactPage.isLast())
                .build();
    }
    
    public ContactResponse markAsRead(String id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
                
        contact.setRead(true);
        contact = contactRepository.save(contact);
        return mapToResponse(contact);
    }
    
    public void deleteContact(String id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found");
        }
        contactRepository.deleteById(id);
    }
    
    private ContactResponse mapToResponse(Contact contact) {
        return ContactResponse.builder()
                .id(contact.getId())
                .name(contact.getName())
                .email(contact.getEmail())
                .subject(contact.getSubject())
                .message(contact.getMessage())
                .isRead(contact.isRead())
                .createdAt(contact.getCreatedAt())
                .build();
    }
}
