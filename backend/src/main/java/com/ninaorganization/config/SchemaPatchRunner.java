package com.ninaorganization.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Fixes MySQL schema quirks on existing databases (reserved words, ENUM category column).
 */
@Component
@Order(0)
@RequiredArgsConstructor
@Slf4j
public class SchemaPatchRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        patch("ALTER TABLE courses MODIFY COLUMN category VARCHAR(50)", "courses.category -> VARCHAR(50)");
        patch("ALTER TABLE internships CHANGE COLUMN virtual is_virtual TINYINT(1) NOT NULL DEFAULT 0", "internships.virtual -> is_virtual");
    }

    private void patch(String sql, String label) {
        try {
            jdbcTemplate.execute(sql);
            log.info("Schema patch applied: {}", label);
        } catch (Exception e) {
            log.debug("Schema patch skipped ({}): {}", label, e.getMessage());
        }
    }
}
