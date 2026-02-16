package com.bd.homepage.domain.recruitment.controller;

import com.bd.homepage.domain.recruitment.dto.RecruitmentSettingsResponse;
import com.bd.homepage.domain.recruitment.service.RecruitmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recruit")
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    @GetMapping
    public RecruitmentSettingsResponse get() {
        return recruitmentService.get();
    }
}
