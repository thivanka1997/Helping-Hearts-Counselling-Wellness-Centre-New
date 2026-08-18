-- =====================================================================
-- DATABASE SCHEMA & SEED SCRIPT FOR INFINITYFREE / MYSQL
-- Platform: Helping Hearts Counselling & Wellness Centre
-- Target Engine: MySQL 8.0+ / MariaDB 10.4+
-- Generated: 2026-08-08
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if re-initialising
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `media_library`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `announcements`;
DROP TABLE IF EXISTS `blog_tags`;
DROP TABLE IF EXISTS `blog_categories`;
DROP TABLE IF EXISTS `blogs`;
DROP TABLE IF EXISTS `gallery_media`;
DROP TABLE IF EXISTS `workshops`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `client_appointments`;
DROP TABLE IF EXISTS `payment_submissions`;
DROP TABLE IF EXISTS `attendance_sessions`;
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `course_enrollments`;
DROP TABLE IF EXISTS `lesson_resources`;
DROP TABLE IF EXISTS `lessons`;
DROP TABLE IF EXISTS `course_modules`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `lecturers`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. USERS, ROLES & SECURITY
-- ---------------------------------------------------------------------

CREATE TABLE `roles` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
('ADMIN', 'Administrator', 'Full system access across public website, CMS, LMS and user management'),
('LECTURER', 'Lecturer', 'Access to assigned courses, student lists, materials, and attendance marking'),
('STUDENT', 'Student', 'Access to enrolled courses, lessons, resources, progress, and attendance'),
('COUNSELLING_ADMIN', 'Counselling Administrator', 'Confidential access to client appointment requests and scheduling');

CREATE TABLE `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_id` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `avatar` VARCHAR(255) NULL,
  `status` ENUM('ACTIVE', 'PENDING', 'SUSPENDED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. LECTURERS & STUDENTS
-- ---------------------------------------------------------------------

CREATE TABLE `lecturers` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `photo` VARCHAR(255) NOT NULL,
  `qualifications` TEXT NOT NULL,
  `specialization` TEXT NOT NULL,
  `bio` TEXT NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lecturers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `students` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL UNIQUE,
  `dob` DATE NULL,
  `address` TEXT NULL,
  `registration_ref` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. COURSES, MODULES, LESSONS & RESOURCES
-- ---------------------------------------------------------------------

CREATE TABLE `courses` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `short_desc` TEXT NOT NULL,
  `description` LONGTEXT NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `lecturer_id` VARCHAR(64) NOT NULL,
  `duration` VARCHAR(100) NOT NULL,
  `schedule` VARCHAR(150) NOT NULL,
  `fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) DEFAULT 'LKR',
  `category` VARCHAR(100) NOT NULL,
  `level` ENUM('Beginner', 'Intermediate', 'Advanced', 'All Levels') DEFAULT 'All Levels',
  `status` ENUM('Published', 'Draft', 'Archived') DEFAULT 'Published',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_courses_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `course_modules` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `course_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `display_order` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_modules_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lessons` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `module_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `video_url` VARCHAR(255) NULL COMMENT 'YouTube Video URL or Embed ID',
  `duration_minutes` INT DEFAULT 30,
  `display_order` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lessons_module` FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lesson_resources` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `lesson_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `type` ENUM('PDF', 'DOC', 'PPT', 'LINK') NOT NULL,
  `url` TEXT NOT NULL COMMENT 'Google Drive Link or Material URL',
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_resources_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. ENROLLMENTS & MANUAL PAYMENT VERIFICATION
-- ---------------------------------------------------------------------

CREATE TABLE `payment_submissions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `dob` DATE NULL,
  `address` TEXT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'Bank Transfer',
  `payment_slip_url` VARCHAR(255) NULL,
  `payment_ref` VARCHAR(100) NULL,
  `amount_paid` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  `rejection_reason` TEXT NULL,
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` TIMESTAMP NULL,
  CONSTRAINT `fk_payments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `course_enrollments` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `status` ENUM('ACTIVE', 'COMPLETED', 'SUSPENDED') DEFAULT 'ACTIVE',
  `overall_progress` INT DEFAULT 0,
  `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_enrollments_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enrollments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_student_course` (`student_id`, `course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lesson_progress` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `enrollment_id` VARCHAR(64) NOT NULL,
  `lesson_id` VARCHAR(64) NOT NULL,
  `completed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_progress_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `course_enrollments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_progress_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_enrollment_lesson` (`enrollment_id`, `lesson_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. ATTENDANCE MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE `attendance` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `session_date` DATE NOT NULL,
  `session_title` VARCHAR(255) NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL DEFAULT 'Present',
  `marked_by` VARCHAR(150) NOT NULL,
  `remarks` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_attendance_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_attendance_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. CONFIDENTIAL COUNSELLING CLIENT APPOINTMENT SYSTEM
-- (Strictly isolated from student LMS tables)
-- ---------------------------------------------------------------------

CREATE TABLE `services` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `short_desc` TEXT NOT NULL,
  `full_desc` LONGTEXT NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `benefits_json` JSON NOT NULL,
  `session_duration` VARCHAR(100) NOT NULL,
  `format` ENUM('In-Person', 'Online', 'Both') DEFAULT 'Both',
  `category` VARCHAR(100) NOT NULL,
  `featured` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `client_appointments` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `reference_no` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `service_id` VARCHAR(64) NOT NULL,
  `service_title` VARCHAR(200) NOT NULL,
  `preferred_date` DATE NOT NULL,
  `preferred_time` VARCHAR(50) NOT NULL,
  `session_type` ENUM('Physical', 'Online') NOT NULL DEFAULT 'Physical',
  `notes` TEXT NULL,
  `status` ENUM('Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled') DEFAULT 'Pending',
  `admin_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_appointments_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. EVENTS, WORKSHOPS, BLOGS, GALLERY & MEDIA
-- ---------------------------------------------------------------------

CREATE TABLE `events` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `type` ENUM('EVENT', 'WORKSHOP') NOT NULL DEFAULT 'EVENT',
  `description` LONGTEXT NOT NULL,
  `event_date` DATE NOT NULL,
  `start_time` VARCHAR(30) NOT NULL,
  `end_time` VARCHAR(30) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `is_online` TINYINT(1) DEFAULT 0,
  `image` VARCHAR(255) NOT NULL,
  `video_url` VARCHAR(255) NULL,
  `registration_url` VARCHAR(255) NULL,
  `status` ENUM('PUBLISHED', 'DRAFT') DEFAULT 'PUBLISHED',
  `featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `blogs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `summary` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `author` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `tags_json` JSON NULL,
  `status` ENUM('PUBLISHED', 'DRAFT') DEFAULT 'PUBLISHED',
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `gallery_media` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `type` ENUM('IMAGE', 'YOUTUBE_VIDEO') NOT NULL DEFAULT 'IMAGE',
  `url` TEXT NOT NULL,
  `thumbnail_url` TEXT NULL,
  `category` ENUM('Events', 'Workshops', 'Training', 'Gallery') NOT NULL DEFAULT 'Gallery',
  `caption` TEXT NULL,
  `event_date` DATE NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. ANNOUNCEMENTS, NOTIFICATIONS & SITE SETTINGS
-- ---------------------------------------------------------------------

CREATE TABLE `announcements` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `target_role` ENUM('ALL', 'STUDENTS', 'LECTURERS') DEFAULT 'ALL',
  `course_id` VARCHAR(64) NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notifications` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('INFO', 'SUCCESS', 'WARNING') DEFAULT 'INFO',
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `site_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `site_name` VARCHAR(200) NOT NULL DEFAULT 'Helping Hearts Counselling & Wellness Centre',
  `tagline` VARCHAR(255) NOT NULL DEFAULT 'Nurturing Mind, Healing Hearts & Empowering Lives',
  `phone_primary` VARCHAR(50) NOT NULL DEFAULT '0742344251',
  `phone_secondary` VARCHAR(50) DEFAULT '+94 74 234 4251',
  `emergency_helpline` VARCHAR(50) DEFAULT '1333 / 0742344251',
  `email_primary` VARCHAR(100) NOT NULL DEFAULT 'helpingheartscounsellingservic@gmail.com',
  `address_physical` VARCHAR(255) NOT NULL DEFAULT 'HELPING HEARTS Counselling & Wellness, Thelangapatha Road, Wattala',
  `opening_hours` VARCHAR(255) NOT NULL DEFAULT 'Mon - Sat: 8:30 AM - 6:00 PM (Appointments Available Sunday)',
  `facebook_url` VARCHAR(255) DEFAULT 'https://facebook.com/helpingheartslk',
  `instagram_url` VARCHAR(255) DEFAULT 'https://instagram.com/helpingheartslk',
  `linkedin_url` VARCHAR(255) DEFAULT 'https://linkedin.com/company/helpinghearts',
  `currency_symbol` VARCHAR(10) DEFAULT 'LKR'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `site_settings` (`id`, `site_name`, `tagline`, `phone_primary`, `phone_secondary`, `emergency_helpline`, `email_primary`, `address_physical`, `opening_hours`, `facebook_url`, `instagram_url`, `linkedin_url`, `currency_symbol`) VALUES 
(1, 'Helping Hearts Counselling & Wellness Centre', 'Nurturing Mind, Healing Hearts & Empowering Lives', '0742344251', '+94 74 234 4251', '1333 (National Helpline) / 0742344251', 'helpingheartscounsellingservic@gmail.com', 'HELPING HEARTS Counselling & Wellness, Thelangapatha Road, Wattala', 'Mon - Sat: 8:30 AM - 6:00 PM (Appointments Available Sunday)', 'https://facebook.com/helpingheartslk', 'https://instagram.com/helpingheartslk', 'https://linkedin.com/company/helpinghearts', 'LKR')
ON DUPLICATE KEY UPDATE `site_name` = VALUES(`site_name`);

-- ---------------------------------------------------------------------
-- SEED DATA: LECTURERS & FOUNDER
-- ---------------------------------------------------------------------

INSERT INTO `lecturers` (`id`, `name`, `title`, `photo`, `qualifications`, `specialization`, `bio`, `email`, `phone`, `display_order`) VALUES
('lec-1', 'Ms. Ramsina Farvin Jelaldeen', 'Course Founder & Director | Psychotherapist | Lecturer | Life Coach', '/src/assets/images/regenerated_image_1786279526494.png', 'NLP Practitioner (Institute of Hypnosis & NLP Lanka), Sports Psychology (Institute of Sports Psychology), APA Member 2025 (American Psychological Association ID: C2405149465)', 'Psychological Counselling, Psychotherapy, NLP Practice, Life Coaching, Educational Pedagogy & Sinhala Language Instruction', 'Ms. Ramsina Farvin Jelaldeen is the Course Founder and Director of Helping Hearts Counselling & Wellness Centre. She serves as Counselor & Psychotherapist at Freedom Psychological Counselling Center (Pepiliyana), Psychological Counselor at HOPE Health Centre, and Lecturer at the Sri Lanka National Institute of Professional Counsellors. Having taught at Amana International School and practiced widely across Sri Lanka, she combines deep clinical empathy with academic excellence.', 'helpingheartscounsellingservic@gmail.com', '0742344251', 1),
('lec-2', 'Dr. Anura Jayasinghe', 'Senior Clinical Psychologist & Academic Advisor', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop', 'Ph.D. in Clinical Psychology, M.Phil. in Counselling', 'Family Therapy, Adolescent Psychology, Substance Abuse Rehabilitation', 'Dr. Jayasinghe brings over 18 years of clinical expertise from government and private health sectors in Sri Lanka.', 'anura.jayasinghe@helpingheartswellness.org', '+94 77 222 3344', 2),
('lec-3', 'Mrs. K. Perera', 'Visiting Lecturer in Child & Educational Psychology', 'https://images.unsplash.com/photo-1580894732413-a9236e788c7c?q=80&w=800&auto=format&fit=crop', 'M.Ed. in Educational Psychology, B.Ed. (Hons)', 'Child Development, Learning Disabilities, Student Counselling', 'Specialist in child development with 10+ years advising international school boards.', 'k.perera@helpingheartswellness.org', '+94 77 333 4455', 3)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ---------------------------------------------------------------------
-- SEED DATA: FEATURED BLOG ARTICLES
-- ---------------------------------------------------------------------

INSERT INTO `blogs` (`id`, `title`, `slug`, `summary`, `content`, `image`, `author`, `category`, `tags_json`, `status`, `meta_title`, `meta_description`, `published_at`) VALUES
('blg-bdd-ramsina', 'මොකක්ද මේ ගොඩක් අය නොදන්න Body Dysmorphic Disorder (BDD) එක කියන්නේ?', 'body-dysmorphic-disorder-bdd-paper-article', 'මනෝ උපදේශිකා Ramsina Farvin Jelaldeen විසින් රචිත පුවත්පත් ලිපිය: කාංසා අක්‍රමතාව (Social Anxiety) යටතේ එන ශරීර ස්වභාවය පිළිබඳ අක්‍රමතාවය (BDD), එහි ලක්ෂණ සහ CBT, Mindfulness, Music Therapy, Drama Therapy ප්‍රතිකාර.', '### මොකක්ද මේ ගොඩක් අය නොදන්න Body Dysmorphic Disorder (BDD) එක කියන්නේ?\n\n**කර්තෘ:** මනෝ උපදේශිකා රම්සිනා ෆර්වින් ජෙලල්දීන් (*Ms. Ramsina Farvin Jelaldeen*)\n**ප්‍රකාශිත දිනය:** 2024.01.25\n\n#### 1. හැඳින්වීම\nකාංසා අක්‍රමතාව (Social Anxiety) යටතේ එන ශරීර ස්වභාවය පිළිබඳ අක්‍රමතාවය (Body Dysmorphic Disorder - BDD) යනු වර්තමාන සමාජයේ ඉතා සුලබව දැකිය හැකි තත්ත්වයකි.\n\n#### 2. කුමක්ද මේ Body Dysmorphic Disorder එක කියන්නේ?\nමෙහිදී සරල වශයෙන් සිදුවන්නේ යම් පුද්ගලයෙකු විසින් තමන්ගේ ශරීරය විශාල වශයෙන් විකෘතියකට ලක් වී ඇතැයි සිතමින් ඇති වන තදබල මානසික පීඩනයයි.\n\n#### 3. මෙය හඳුනා ගැනීමට තිබෙන ලක්ෂණ\n- නිතරම කණ්ණාඩියෙන් තමන්ගේ පෙනුම පරීක්ෂා කිරීම\n- අධික ලෙස කොණ්ඩය පීරීම හෝ පෙනුම සකස් කිරීම\n- සම කෑම / කැලැල් සෑරීම (Skin picking)\n- අන් අයගෙන් නිරන්තරයෙන් සහතික හා පුනරීක්ෂණ සෙවීම\n- හුදකලා වීම හා සමාජයෙන් වෙන්වීම\n\n#### 4. මෙයට තිබෙන ප්‍රතිකාර\nCBT ප්‍රතිකාර, Mindfulness & Meditation, Music Therapy & Drama Therapy මගින් මෙම තත්ත්වය ඉතා සාර්ථකව කළමනාකරණය කළ හැක.', '/src/assets/images/bdd_paper_article_1786275528886.jpg', 'Ms. Ramsina Farvin Jelaldeen', 'Paper Articles & BDD', '["BDD", "Body Dysmorphic Disorder", "Social Anxiety", "Paper Article", "Ramsina Farvin Jelaldeen"]', 'PUBLISHED', 'Body Dysmorphic Disorder (BDD) Article | Ms. Ramsina Farvin Jelaldeen', 'Published newspaper article on BDD by Ms. Ramsina Farvin Jelaldeen.', '2024-01-25')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- ---------------------------------------------------------------------
-- INDEXES FOR OPTIMIZED QUERY PERFORMANCE
-- ---------------------------------------------------------------------

CREATE INDEX `idx_appointments_status` ON `client_appointments` (`status`);
CREATE INDEX `idx_appointments_date` ON `client_appointments` (`preferred_date`);
CREATE INDEX `idx_payments_status` ON `payment_submissions` (`status`);
CREATE INDEX `idx_attendance_student` ON `attendance` (`student_id`, `session_date`);
CREATE INDEX `idx_lessons_module` ON `lessons` (`module_id`, `display_order`);
CREATE INDEX `idx_blogs_status` ON `blogs` (`status`, `published_at`);
CREATE INDEX `idx_events_status` ON `events` (`status`, `event_date`);

-- =====================================================================
-- END OF DATABASE SCHEMA
-- =====================================================================
