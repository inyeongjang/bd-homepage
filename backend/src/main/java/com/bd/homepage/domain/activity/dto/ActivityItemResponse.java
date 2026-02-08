package com.bd.homepage.domain.activity.dto;

import com.bd.homepage.domain.activity.entity.ActivityCategory;
import com.bd.homepage.domain.activity.entity.ActivityItem;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ActivityItemResponse {
    private Long id;
    private Integer year;
    private ActivityCategory category;
    private String title;
    private String href;
    private String image;
    private String iconKey;
    private String iconUrl;
    private Integer orderIndex;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ActivityItemResponse from(ActivityItem entity) {
        return ActivityItemResponse.builder()
                .id(entity.getId())
                .year(entity.getYear())
                .category(entity.getCategory())
                .title(entity.getTitle())
                .href(entity.getHref())
                .image(entity.getImage())
                .iconKey(entity.getIconKey())
                .iconUrl(entity.getIconUrl())
                .orderIndex(entity.getOrderIndex())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
