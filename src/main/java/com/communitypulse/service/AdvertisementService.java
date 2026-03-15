package com.communitypulse.service;

import com.communitypulse.dto.request.CreateAdvertisementRequest;
import com.communitypulse.entity.Advertisement;
import com.communitypulse.entity.User;
import com.communitypulse.exception.ResourceNotFoundException;
import com.communitypulse.repository.AdvertisementRepository;
import com.communitypulse.repository.CommunityRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Manages advertisements with skill-based matching.
 * Matches ads to users based on their skills field against ad's targetSkills.
 */
@Service
@Slf4j
public class AdvertisementService {

    private final AdvertisementRepository advertisementRepository;
    private final CommunityRepository communityRepository;
    private final UserService userService;

    public AdvertisementService(AdvertisementRepository advertisementRepository,
                                CommunityRepository communityRepository,
                                UserService userService) {
        this.advertisementRepository = advertisementRepository;
        this.communityRepository = communityRepository;
        this.userService = userService;
    }

    /**
     * Creates a new advertisement.
     */
    @Transactional
    public Advertisement createAdvertisement(CreateAdvertisementRequest request) {
        communityRepository.findById(request.getCommunityId())
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", request.getCommunityId()));

        Advertisement ad = Advertisement.builder()
                .communityId(request.getCommunityId())
                .title(request.getTitle())
                .description(request.getDescription())
                .targetSkills(request.getTargetSkills())
                .companyName(request.getCompanyName())
                .contactEmail(request.getContactEmail())
                .adType(request.getAdType())
                .expiresAt(request.getExpiresAt())
                .build();

        Advertisement saved = advertisementRepository.save(ad);
        log.info("Advertisement '{}' created for community {}", saved.getTitle(), request.getCommunityId());
        return saved;
    }

    /**
     * Lists active ads for a community.
     */
    public List<Advertisement> getAdsByCommunity(Long communityId) {
        communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));
        return advertisementRepository.findByCommunityIdAndIsActiveTrue(communityId);
    }

    /**
     * Gets ads relevant to the current user based on skill matching.
     * Calculates a relevance score and returns sorted results.
     */
    public List<Advertisement> getRelevantAds(String username) {
        User user = userService.getUserByUsername(username);
        String userSkills = user.getSkills();

        if (userSkills == null || userSkills.isBlank()) {
            return advertisementRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        }

        Set<String> userSkillSet = Arrays.stream(userSkills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        List<Advertisement> allAds = advertisementRepository.findByIsActiveTrue();

        // Sort by relevance score (number of matching skills)
        allAds.sort((a, b) -> {
            int scoreA = calculateRelevanceScore(a.getTargetSkills(), userSkillSet);
            int scoreB = calculateRelevanceScore(b.getTargetSkills(), userSkillSet);
            return Integer.compare(scoreB, scoreA);
        });

        return allAds;
    }

    /**
     * Updates an existing advertisement.
     */
    @Transactional
    public Advertisement updateAdvertisement(Long id, CreateAdvertisementRequest request) {
        Advertisement ad = advertisementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Advertisement", "id", id));

        ad.setTitle(request.getTitle());
        ad.setDescription(request.getDescription());
        ad.setTargetSkills(request.getTargetSkills());
        ad.setCompanyName(request.getCompanyName());
        ad.setContactEmail(request.getContactEmail());
        ad.setAdType(request.getAdType());
        if (request.getExpiresAt() != null) {
            ad.setExpiresAt(request.getExpiresAt());
        }

        return advertisementRepository.save(ad);
    }

    /**
     * Deactivates (soft deletes) an advertisement.
     */
    @Transactional
    public void deactivateAdvertisement(Long id) {
        Advertisement ad = advertisementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Advertisement", "id", id));
        ad.setActive(false);
        advertisementRepository.save(ad);
        log.info("Advertisement '{}' deactivated", ad.getTitle());
    }

    private int calculateRelevanceScore(String adSkills, Set<String> userSkillSet) {
        if (adSkills == null || adSkills.isBlank()) return 0;

        Set<String> adSkillSet = Arrays.stream(adSkills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        int matches = 0;
        for (String skill : adSkillSet) {
            if (userSkillSet.contains(skill)) {
                matches++;
            }
        }
        return matches;
    }
}
