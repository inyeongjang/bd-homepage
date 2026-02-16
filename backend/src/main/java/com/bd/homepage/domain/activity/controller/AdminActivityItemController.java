package com.bd.homepage.domain.activity.controller;

import com.bd.homepage.domain.activity.dto.ActivityItemRequest;
import com.bd.homepage.domain.activity.dto.ActivityItemResponse;
import com.bd.homepage.domain.activity.entity.ActivityCategory;
import com.bd.homepage.domain.activity.service.ActivityItemService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminActivityItemController {

    private final ActivityItemService activityItemService;

    public AdminActivityItemController(ActivityItemService activityItemService) {
        this.activityItemService = activityItemService;
    }

    @GetMapping("/activity-items")
    public List<ActivityItemResponse> list(
            @RequestParam Integer year,
            @RequestParam ActivityCategory category
    ) {
        return activityItemService.list(year, category);
    }

    @PostMapping("/activity-items")
    public ActivityItemResponse create(@RequestBody ActivityItemRequest req) {
        return activityItemService.create(req);
    }

    @PutMapping("/activity-items/{id}")
    public ActivityItemResponse update(@PathVariable Long id, @RequestBody ActivityItemRequest req) {
        return activityItemService.update(id, req);
    }

    @DeleteMapping("/activity-items/{id}")
    public void delete(@PathVariable Long id) {
        activityItemService.delete(id);
    }
}
