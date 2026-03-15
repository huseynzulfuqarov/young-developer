package com.communitypulse.entity;

import com.communitypulse.enums.MemberStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "community_memberships",
       uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "communityId"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long communityId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    private LocalDateTime lastActiveAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MemberStatus status = MemberStatus.ACTIVE;

    @Column(nullable = false)
    @Builder.Default
    private int totalPoints = 0;

    @PrePersist
    protected void onCreate() {
        this.joinedAt = LocalDateTime.now();
        this.lastActiveAt = LocalDateTime.now();
    }
}
