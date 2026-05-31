package com.ninaorganization.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.Locale;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url:}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key:}")
    private String serviceRoleKey;

    public String uploadFile(MultipartFile file, String bucket, String objectPath) throws IOException, InterruptedException {
        if (supabaseUrl == null || supabaseUrl.isBlank()) {
            throw new IllegalStateException("Supabase URL is not configured");
        }
        if (serviceRoleKey == null || serviceRoleKey.isBlank()) {
            throw new IllegalStateException("Supabase service role key is not configured");
        }

        var client = HttpClient.newHttpClient();
        var request = HttpRequest.newBuilder()
                .uri(URI.create(String.format("%s/storage/v1/object/%s/%s", supabaseUrl, bucket, objectPath)))
                .header("Authorization", "Bearer " + serviceRoleKey)
                .header("apikey", serviceRoleKey)
                .header("x-upsert", "true")
                .header("Content-Type", file.getContentType() != null ? file.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE)
                .PUT(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            throw new IllegalStateException("Supabase storage upload failed: " + response.body());
        }

        return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, bucket, objectPath);
    }

    public String makeObjectPath(Long userId, String kind, String originalFilename) {
        String extension = ""
                + (originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase(Locale.ROOT)
                : "");
        String timestamp = String.valueOf(Instant.now().toEpochMilli());
        return String.format("profiles/%d/%s-%s%s", userId, kind, timestamp, extension);
    }
}
