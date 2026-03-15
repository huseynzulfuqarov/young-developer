package com.communitypulse.controller;

import com.communitypulse.dto.request.UpdateProfileRequest;
import com.communitypulse.dto.response.UserResponse;
import com.communitypulse.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@Slf4j
public class MemberController {

    private final UserService userService;

    public MemberController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(
                userService.toUserResponse(userService.getUserByUsername(authentication.getName()))
        );
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(userService.updateProfile(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllMembers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toUserResponse(userService.getUserById(id)));
    }
}
