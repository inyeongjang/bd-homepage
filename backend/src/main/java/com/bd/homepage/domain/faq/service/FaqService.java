package com.bd.homepage.domain.faq.service;

import com.bd.homepage.domain.faq.dto.FaqRequest;
import com.bd.homepage.domain.faq.dto.FaqResponse;
import com.bd.homepage.domain.faq.entity.Faq;
import com.bd.homepage.domain.faq.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class FaqService {

    private final FaqRepository faqRepository;

    @Transactional(readOnly = true)
    public List<FaqResponse> list() {
        return faqRepository.findAllByOrderByOrderIndexAsc()
                .stream()
                .map(FaqResponse::from)
                .toList();
    }

    public FaqResponse create(FaqRequest request) {
        Faq faq = faqRepository.save(
                Faq.builder()
                        .question(request.getQuestion())
                        .answer(request.getAnswer())
                        .orderIndex(request.getOrderIndex())
                        .isActive(request.getIsActive())
                        .build()
        );
        return FaqResponse.from(faq);
    }

    public FaqResponse update(UUID id, FaqRequest request) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("FAQ not found"));

        faq.update(
                request.getQuestion(),
                request.getAnswer(),
                request.getOrderIndex(),
                request.getIsActive()
        );

        return FaqResponse.from(faq);
    }

    public void delete(UUID id) {
        faqRepository.deleteById(id);
    }
}
