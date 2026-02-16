package com.bd.homepage.domain.activity.repository;

import com.bd.homepage.domain.activity.entity.ActivityCategory;
import com.bd.homepage.domain.activity.entity.ActivityItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityItemRepository extends JpaRepository<ActivityItem, Long> {

    List<ActivityItem> findByYearAndCategoryOrderByOrderIndexAsc(Integer year, ActivityCategory category);

    List<ActivityItem> findByYearOrderByOrderIndexAsc(Integer year);

    List<ActivityItem> findAllByOrderByOrderIndexAsc();
}
