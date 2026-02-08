package com.bd.homepage.domain.activity.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "activity_item")
public class ActivityItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "activity_year", nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ActivityCategory category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String href;   // 외부 링크

    @Column(length = 500)
    private String image;  // 이미지 URL/경로

    @Column(length = 50)
    private String iconKey; // 아이콘 키

    @Column(length = 500)
    private String iconUrl; // 커스텀 아이콘 이미지 URL

    @Column(nullable = false)
    @Builder.Default
    private Integer orderIndex = 0; // 정렬용

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true; // 노출 여부

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public void update(
            Integer year,
            ActivityCategory category,
            String title,
            String href,
            String image,
            String iconKey,
            String iconUrl,
            Integer orderIndex,
            Boolean isActive
    ) {
        this.year = year;
        this.category = category;
        this.title = title;
        this.href = href;
        this.image = image;
        this.iconKey = iconKey;
        this.iconUrl = iconUrl;
        this.orderIndex = orderIndex;
        this.isActive = isActive;
    }
}
