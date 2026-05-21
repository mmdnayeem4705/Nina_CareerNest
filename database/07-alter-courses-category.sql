-- Fix courses.category if Hibernate created an ENUM that rejects new values (DEVOPS, AI_ML, etc.)
USE nina_db;
ALTER TABLE courses MODIFY COLUMN category VARCHAR(50);
