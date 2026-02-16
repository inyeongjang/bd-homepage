package com.bd.homepage.domain.faq.dto;

import com.bd.homepage.domain.faq.entity.Faq;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class FaqResponse {

    private UUID id;
    private String question;
    private String answer;
    private Integer orderIndex;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static FaqResponse from(Faq faq) {
        return FaqResponse.builder()
                .id(faq.getId())
                .question(faq.getQuestion())
                .answer(faq.getAnswer())
                .orderIndex(faq.getOrderIndex())
                .isActive(faq.getIsActive())
                .createdAt(faq.getCreatedAt())
                .updatedAt(faq.getUpdatedAt())
                .build();
    }
}
