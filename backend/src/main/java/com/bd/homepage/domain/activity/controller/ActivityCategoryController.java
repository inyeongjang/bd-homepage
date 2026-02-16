package com.bd.homepage.domain.activity.controller;

import com.bd.homepage.domain.activity.dto.ActivityCategoryResponse;
import com.bd.homepage.domain.activity.entity.ActivityCategory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activity-categories")
public class ActivityCategoryController {

    @GetMapping
    public List<ActivityCategoryResponse> list() {
        ActivityCategory[] values = ActivityCategory.values();
        return List.of(values).stream()
                .map(ActivityCategoryController::toResponse)
                .toList();
    }

    private static ActivityCategoryResponse toResponse(ActivityCategory category) {
        String key = category.name();
        return ActivityCategoryResponse.builder()
                .key(key)
                .label(labelFor(category))
                .iconKey(iconKeyFor(category))
                .orderIndex(category.ordinal())
                .build();
    }

    private static String labelFor(ActivityCategory category) {
        return switch (category) {
            case STUDY -> "Study";
            case RESEARCH_PROJECT -> "Research & Project";
            case SEMINAR_NETWORKING -> "Seminar & Networking";
        };
    }

    private static String iconKeyFor(ActivityCategory category) {
        return switch (category) {
            case STUDY -> "graduation-cap";
            case RESEARCH_PROJECT -> "microscope";
            case SEMINAR_NETWORKING -> "users";
        };
    }
}
