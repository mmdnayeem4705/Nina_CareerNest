package com.ninaorganization.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Basic
    private String fullName;
    private String phoneAlt;
    private String dob;
    private String gender;
    private String nationality;

    // Address
    @Lob
    private String currentAddress;
    @Lob
    private String permanentAddress;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String preferredJobLocation;
    private Boolean willingToRelocate;

    // Education / Skills stored as JSON strings for flexibility
    @Lob
    private String educationJson;

    @Lob
    private String skillsJson;

    // Social links
    private String linkedInUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String leetcodeUrl;
    private String hackerrankUrl;

    // Profile photo / resume links
    private String profilePhotoUrl;
    private String resumeUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
