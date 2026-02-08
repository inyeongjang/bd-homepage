package com.bd.homepage.domain.activity.dto;

import com.bd.homepage.domain.activity.entity.ActivityCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActivityItemRequest {
    private Integer year;
    private ActivityCategory category;
    private String title;
    private String href;
    private String image;
    private String iconKey;
    private String iconUrl;
    private Integer orderIndex;
    private Boolean isActive;
}
