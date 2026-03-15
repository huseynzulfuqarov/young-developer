package com.communitypulse.service;

import com.communitypulse.dto.request.CreateCommunityRequest;
import com.communitypulse.dto.response.CommunityResponse;
import com.communitypulse.dto.response.UserResponse;
import com.communitypulse.entity.Community;
import com.communitypulse.entity.CommunityMembership;
import com.communitypulse.entity.User;
import com.communitypulse.enums.MemberStatus;
import com.communitypulse.exception.BadRequestException;
import com.communitypulse.exception.ResourceNotFoundException;
import com.communitypulse.repository.CommunityMembershipRepository;
import com.communitypulse.repository.CommunityRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for community management: create, join, leave, list members.
 */
@Service
@Slf4j
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityMembershipRepository membershipRepository;
    private final UserService userService;

    public CommunityService(CommunityRepository communityRepository,
                            CommunityMembershipRepository membershipRepository,
                            UserService userService) {
        this.communityRepository = communityRepository;
        this.membershipRepository = membershipRepository;
        this.userService = userService;
    }

    /**
     * Creates a new community and automatically adds the creator as a CHAMPION member.
     *
     * @param request  the community creation data
     * @param username the creator's username
     * @return CommunityResponse DTO
     */
    @Transactional
    public CommunityResponse createCommunity(CreateCommunityRequest request, String username) {
        if (communityRepository.existsByName(request.getName())) {
            throw new BadRequestException("Community name already exists: " + request.getName());
        }

        User owner = userService.getUserByUsername(username);

        Community community = Community.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .ownerUserId(owner.getId())
                .logoUrl(request.getLogoUrl())
                .build();

        Community saved = communityRepository.save(community);

        // Auto-join the creator as a member
        CommunityMembership membership = CommunityMembership.builder()
                .userId(owner.getId())
                .communityId(saved.getId())
                .status(MemberStatus.CHAMPION)
                .build();
        membershipRepository.save(membership);

        log.info("Community created: '{}' by user '{}'", saved.getName(), username);

        return toCommunityResponse(saved);
    }

    /**
     * Returns all active communities.
     */
    public List<CommunityResponse> getAllCommunities() {
        return communityRepository.findByIsActiveTrue().stream()
                .map(this::toCommunityResponse)
                .collect(Collectors.toList());
    }

    /**
     * Returns a community by its ID.
     */
    public CommunityResponse getCommunityById(Long id) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", id));
        return toCommunityResponse(community);
    }

    /**
     * Updates a community (only the owner can update).
     */
    @Transactional
    public CommunityResponse updateCommunity(Long id, CreateCommunityRequest request, String username) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", id));

        User user = userService.getUserByUsername(username);
        if (!community.getOwnerUserId().equals(user.getId())) {
            throw new BadRequestException("Only the community owner can update this community");
        }

        community.setName(request.getName());
        community.setDescription(request.getDescription());
        community.setCategory(request.getCategory());
        if (request.getLogoUrl() != null) {
            community.setLogoUrl(request.getLogoUrl());
        }

        Community updated = communityRepository.save(community);
        log.info("Community updated: '{}' by user '{}'", updated.getName(), username);
        return toCommunityResponse(updated);
    }

    /**
     * Joins a user to a community.
     */
    @Transactional
    public void joinCommunity(Long communityId, String username) {
        communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));

        User user = userService.getUserByUsername(username);

        if (membershipRepository.existsByUserIdAndCommunityId(user.getId(), communityId)) {
            throw new BadRequestException("You are already a member of this community");
        }

        CommunityMembership membership = CommunityMembership.builder()
                .userId(user.getId())
                .communityId(communityId)
                .status(MemberStatus.ACTIVE)
                .build();

        membershipRepository.save(membership);
        log.info("User '{}' joined community ID {}", username, communityId);
    }

    /**
     * Removes a user from a community.
     */
    @Transactional
    public void leaveCommunity(Long communityId, String username) {
        User user = userService.getUserByUsername(username);

        if (!membershipRepository.existsByUserIdAndCommunityId(user.getId(), communityId)) {
            throw new BadRequestException("You are not a member of this community");
        }

        membershipRepository.deleteByUserIdAndCommunityId(user.getId(), communityId);
        log.info("User '{}' left community ID {}", username, communityId);
    }

    /**
     * Returns communities the current user has joined.
     */
    public List<CommunityResponse> getMyCommunities(String username) {
        User user = userService.getUserByUsername(username);
        List<CommunityMembership> memberships = membershipRepository.findByUserId(user.getId());
        return memberships.stream()
                .map(m -> communityRepository.findById(m.getCommunityId()).orElse(null))
                .filter(c -> c != null && c.isActive())
                .map(this::toCommunityResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lists all members of a community.
     */
    public List<UserResponse> getCommunityMembers(Long communityId) {
        communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));

        List<CommunityMembership> memberships = membershipRepository.findByCommunityId(communityId);

        return memberships.stream()
                .map(m -> userService.getUserById(m.getUserId()))
                .map(userService::toUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Converts a Community entity to CommunityResponse DTO.
     */
    public CommunityResponse toCommunityResponse(Community community) {
        long memberCount = membershipRepository.countByCommunityId(community.getId());
        User owner = userService.getUserById(community.getOwnerUserId());

        return CommunityResponse.builder()
                .id(community.getId())
                .name(community.getName())
                .description(community.getDescription())
                .category(community.getCategory())
                .ownerUserId(community.getOwnerUserId())
                .ownerUsername(owner.getUsername())
                .logoUrl(community.getLogoUrl())
                .createdAt(community.getCreatedAt())
                .isActive(community.isActive())
                .memberCount(memberCount)
                .build();
    }
}
