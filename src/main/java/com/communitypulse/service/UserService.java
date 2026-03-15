package com.communitypulse.service;

import com.communitypulse.dto.request.UpdateProfileRequest;
import com.communitypulse.dto.response.UserResponse;
import com.communitypulse.entity.User;
import com.communitypulse.exception.ResourceNotFoundException;
import com.communitypulse.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for user-related operations.
 */
@Service
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves a user by username.
     *
     * @param username the username to search for
     * @return the User entity
     * @throws ResourceNotFoundException if user is not found
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    /**
     * Retrieves a user by ID.
     *
     * @param id the user ID
     * @return the User entity
     * @throws ResourceNotFoundException if user is not found
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    /**
     * Updates the current user's profile (fullName, bio, skills).
     *
     * @param username the authenticated user's username
     * @param request  the update data
     * @return updated UserResponse DTO
     */
    @Transactional
    public UserResponse updateProfile(String username, UpdateProfileRequest request) {
        User user = getUserByUsername(username);
        user.setFullName(request.getFullName());
        user.setBio(request.getBio());
        user.setSkills(request.getSkills());
        User saved = userRepository.save(user);
        log.info("Profile updated for user '{}'", username);
        return toUserResponse(saved);
    }

    /**
     * Converts a User entity to a UserResponse DTO.
     *
     * @param user the entity to convert
     * @return UserResponse DTO
     */
    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .profileImageUrl(user.getProfileImageUrl())
                .bio(user.getBio())
                .skills(user.getSkills())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

    /**
     * Returns all users as DTOs.
     *
     * @return list of UserResponse DTOs
     */
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }
}
