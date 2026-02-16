package com.bd.homepage.domain.faq.controller;

import com.bd.homepage.domain.faq.dto.FaqRequest;
import com.bd.homepage.domain.faq.dto.FaqResponse;
import com.bd.homepage.domain.faq.service.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/faqs")
@PreAuthorize("hasRole('ADMIN')")
public class FaqAdminController {

    private final FaqService faqService;

    @GetMapping
    public List<FaqResponse> list() {
        return faqService.list();
    }

    @PostMapping
    public FaqResponse create(@RequestBody FaqRequest request) {
        return faqService.create(request);
    }

    @PutMapping("/{id}")
    public FaqResponse update(@PathVariable UUID id, @RequestBody FaqRequest request) {
        return faqService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        faqService.delete(id);
    }
}
