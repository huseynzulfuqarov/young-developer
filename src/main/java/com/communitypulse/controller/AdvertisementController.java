package com.communitypulse.controller;

import com.communitypulse.dto.request.CreateAdvertisementRequest;
import com.communitypulse.entity.Advertisement;
import com.communitypulse.service.AdvertisementService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/advertisements")
@Slf4j
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    public AdvertisementController(AdvertisementService advertisementService) {
        this.advertisementService = advertisementService;
    }

    @PostMapping
    public ResponseEntity<Advertisement> createAdvertisement(
            @Valid @RequestBody CreateAdvertisementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(advertisementService.createAdvertisement(request));
    }

    @GetMapping("/community/{id}")
    public ResponseEntity<List<Advertisement>> getAdsByCommunity(@PathVariable Long id) {
        return ResponseEntity.ok(advertisementService.getAdsByCommunity(id));
    }

    @GetMapping("/relevant")
    public ResponseEntity<List<Advertisement>> getRelevantAds(Authentication authentication) {
        return ResponseEntity.ok(advertisementService.getRelevantAds(authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Advertisement> updateAdvertisement(
            @PathVariable Long id,
            @Valid @RequestBody CreateAdvertisementRequest request) {
        return ResponseEntity.ok(advertisementService.updateAdvertisement(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateAdvertisement(@PathVariable Long id) {
        advertisementService.deactivateAdvertisement(id);
        return ResponseEntity.noContent().build();
    }
}
