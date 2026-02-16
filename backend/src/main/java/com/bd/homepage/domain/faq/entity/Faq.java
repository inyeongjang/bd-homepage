package com.bd.homepage.domain.faq.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "faq")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Faq {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(length = 300, nullable = false)
    private String question;

    @Column(columnDefinition = "text", nullable = false)
    private String answer;

    @Column(nullable = false)
    @Builder.Default
    private Integer orderIndex = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public void update(String question, String answer, Integer orderIndex, Boolean isActive) {
        this.question = question;
        this.answer = answer;
        this.orderIndex = orderIndex;
        this.isActive = isActive;
    }
}
