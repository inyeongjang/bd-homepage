package com.bd.homepage.domain.faq.dto;

import lombok.Getter;

@Getter
public class FaqRequest {

    private String question;
    private String answer;
    private Integer orderIndex;
    private Boolean isActive;
}
