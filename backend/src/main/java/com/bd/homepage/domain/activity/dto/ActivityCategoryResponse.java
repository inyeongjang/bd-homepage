package com.bd.homepage.domain.activity.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ActivityCategoryResponse {
    private String key;
    private String label;
    private String iconKey;
    private Integer orderIndex;
}
