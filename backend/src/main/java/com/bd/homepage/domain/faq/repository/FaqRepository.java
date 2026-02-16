package com.bd.homepage.domain.faq.repository;

import com.bd.homepage.domain.faq.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FaqRepository extends JpaRepository<Faq, UUID> {

    List<Faq> findAllByOrderByOrderIndexAsc();
}
