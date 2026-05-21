package com.ninaorganization.controller;

import com.ninaorganization.dto.response.ApiResponse;
import com.ninaorganization.entity.Profile;
import com.ninaorganization.repository.ProfileRepository;
import com.ninaorganization.repository.UserRepository;
import com.ninaorganization.security.UserPrincipal;
import com.ninaorganization.service.SupabaseStorageService;
import com.ninaorganization.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SupabaseStorageService storageService;

    @GetMapping
    public ResponseEntity<ApiResponse<Profile>> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        Long userId = principal.getUser().getId();
        var profile = profileRepository.findByUserId(userId).orElse(null);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Profile>> saveProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestBody Map<String, Object> body) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        Long userId = principal.getUser().getId();
        var user = userRepository.findById(userId).orElseThrow();

        var profile = profileRepository.findByUserId(userId).orElseGet(() -> {
            Profile p = new Profile();
            p.setUser(user);
            p.setCreatedAt(LocalDateTime.now());
            return p;
        });

        String fullName = safeString(body, "fullName");
        if (fullName != null) profile.setFullName(fullName);
        String phoneAlt = safeString(body, "phoneAlt");
        if (phoneAlt != null) profile.setPhoneAlt(phoneAlt);
        String dob = safeString(body, "dob");
        if (dob != null) profile.setDob(dob);
        String gender = safeString(body, "gender");
        if (gender != null) profile.setGender(gender);
        String nationality = safeString(body, "nationality");
        if (nationality != null) profile.setNationality(nationality);

        String currentAddress = safeString(body, "currentAddress");
        if (currentAddress != null) profile.setCurrentAddress(currentAddress);
        String permanentAddress = safeString(body, "permanentAddress");
        if (permanentAddress != null) profile.setPermanentAddress(permanentAddress);
        String city = safeString(body, "city");
        if (city != null) profile.setCity(city);
        String state = safeString(body, "state");
        if (state != null) profile.setState(state);
        String country = safeString(body, "country");
        if (country != null) profile.setCountry(country);
        String postalCode = safeString(body, "postalCode");
        if (postalCode != null) profile.setPostalCode(postalCode);
        String preferredJobLocation = safeString(body, "preferredJobLocation");
        if (preferredJobLocation != null) profile.setPreferredJobLocation(preferredJobLocation);
        Boolean willingToRelocate = safeBoolean(body, "willingToRelocate");
        if (willingToRelocate != null) profile.setWillingToRelocate(willingToRelocate);

        String educationJson = safeString(body, "educationJson");
        if (educationJson != null) profile.setEducationJson(educationJson);
        String skillsJson = safeString(body, "skillsJson");
        if (skillsJson != null) profile.setSkillsJson(skillsJson);

        String linkedInUrl = safeString(body, "linkedInUrl");
        if (linkedInUrl != null) profile.setLinkedInUrl(linkedInUrl);
        String githubUrl = safeString(body, "githubUrl");
        if (githubUrl != null) profile.setGithubUrl(githubUrl);
        String portfolioUrl = safeString(body, "portfolioUrl");
        if (portfolioUrl != null) profile.setPortfolioUrl(portfolioUrl);
        String leetcodeUrl = safeString(body, "leetcodeUrl");
        if (leetcodeUrl != null) profile.setLeetcodeUrl(leetcodeUrl);
        String hackerrankUrl = safeString(body, "hackerrankUrl");
        if (hackerrankUrl != null) profile.setHackerrankUrl(hackerrankUrl);

        String profilePhotoUrl = safeString(body, "profilePhotoUrl");
        if (profilePhotoUrl != null) profile.setProfilePhotoUrl(profilePhotoUrl);
        String resumeUrl = safeString(body, "resumeUrl");
        if (resumeUrl != null) profile.setResumeUrl(resumeUrl);

        profile.setUpdatedAt(LocalDateTime.now());
        profile = profileRepository.save(profile);

        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadProfileFile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("kind") String kind,
            @RequestPart("file") MultipartFile file) throws IOException, InterruptedException {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        Long userId = principal.getUser().getId();
        String path = storageService.makeObjectPath(userId, kind, file.getOriginalFilename());
        String publicUrl = storageService.uploadFile(file, "profiles", path);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("url", publicUrl)));
    }

    private String safeString(Map<String, Object> body, String key) {
        Object value = body.get(key);
        return value instanceof String ? (String) value : null;
    }

    private Boolean safeBoolean(Map<String, Object> body, String key) {
        Object value = body.get(key);
        return value == null ? null : Boolean.valueOf(value.toString());
    }
}
