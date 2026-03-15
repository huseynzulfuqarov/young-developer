package com.communitypulse.controller;

import com.communitypulse.dto.request.CreateCommunityRequest;
import com.communitypulse.dto.response.CommunityResponse;
import com.communitypulse.dto.response.UserResponse;
import com.communitypulse.service.CommunityService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
@Slf4j
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @PostMapping
    public ResponseEntity<CommunityResponse> createCommunity(
            @Valid @RequestBody CreateCommunityRequest request,
            Authentication authentication) {
        CommunityResponse response = communityService.createCommunity(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CommunityResponse>> getAllCommunities() {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityResponse> getCommunityById(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.getCommunityById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityResponse> updateCommunity(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommunityRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(communityService.updateCommunity(id, request, authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<CommunityResponse>> getMyCommunities(Authentication authentication) {
        return ResponseEntity.ok(communityService.getMyCommunities(authentication.getName()));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Void> joinCommunity(@PathVariable Long id, Authentication authentication) {
        communityService.joinCommunity(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<Void> leaveCommunity(@PathVariable Long id, Authentication authentication) {
        communityService.leaveCommunity(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<UserResponse>> getCommunityMembers(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.getCommunityMembers(id));
    }
}
