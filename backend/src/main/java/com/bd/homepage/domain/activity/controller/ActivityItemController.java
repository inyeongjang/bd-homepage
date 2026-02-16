package com.bd.homepage.domain.activity.controller;

import com.bd.homepage.domain.activity.dto.ActivityItemResponse;
import com.bd.homepage.domain.activity.service.ActivityItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/activities")
public class ActivityItemController {

    private final ActivityItemService activityItemService;

    @GetMapping
    public List<ActivityItemResponse> list(@RequestParam(required = false) Integer year) {
        if (year != null) {
            return activityItemService.listByYear(year);
        }
        return activityItemService.listAll();
    }
}
