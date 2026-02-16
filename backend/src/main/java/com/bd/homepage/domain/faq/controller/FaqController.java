package com.bd.homepage.domain.faq.controller;

import com.bd.homepage.domain.faq.dto.FaqResponse;
import com.bd.homepage.domain.faq.service.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/faqs")
public class FaqController {

    private final FaqService faqService;

    @GetMapping
    public List<FaqResponse> list() {
        return faqService.list();
    }
}
