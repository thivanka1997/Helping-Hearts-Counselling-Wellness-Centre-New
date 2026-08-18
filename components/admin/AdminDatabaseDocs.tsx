'use client';
import React, { useState } from 'react';
import { Database, Download, Copy, CheckCircle2, Server, ShieldCheck, Code, Globe } from 'lucide-react';

export const AdminDatabaseDocs: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- ==============================================================================
-- Helping Hearts Counselling & Wellness Centre - Database Schema
-- Compatible with MySQL 8.0+, MariaDB 10.4+, and InfinityFree / phpMyAdmin
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS \`helping_hearts_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`helping_hearts_db\`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('PUBLIC_CLIENT', 'STUDENT', 'LECTURER', 'ADMIN') NOT NULL DEFAULT 'PUBLIC_CLIENT',
  \`phone\` VARCHAR(50),
  \`status\` ENUM('ACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS \`courses\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`short_desc\` TEXT,
  \`description\` TEXT,
  \`category\` VARCHAR(100) NOT NULL,
  \`duration\` VARCHAR(100),
  \`schedule\` VARCHAR(255),
  \`fee\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`currency\` VARCHAR(10) NOT NULL DEFAULT 'LKR',
  \`lecturer_id\` VARCHAR(36),
  \`lecturer_name\` VARCHAR(255),
  \`level\` VARCHAR(50) DEFAULT 'Diploma',
  \`image\` TEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`lecturer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. COURSE MODULES TABLE
CREATE TABLE IF NOT EXISTS \`course_modules\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`course_id\` VARCHAR(36) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`description\` TEXT,
  \`order_index\` INT NOT NULL DEFAULT 1,
  FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. LESSONS TABLE
CREATE TABLE IF NOT EXISTS \`lessons\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`module_id\` VARCHAR(36) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`description\` TEXT,
  \`video_url\` TEXT NOT NULL,
  \`order_index\` INT NOT NULL DEFAULT 1,
  \`duration_minutes\` INT DEFAULT 30,
  FOREIGN KEY (\`module_id\`) REFERENCES \`course_modules\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. STUDENT REGISTRATIONS & SLIPS TABLE
CREATE TABLE IF NOT EXISTS \`student_registrations\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`full_name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) NOT NULL,
  \`dob\` DATE,
  \`address\` TEXT,
  \`course_id\` VARCHAR(36) NOT NULL,
  \`course_title\` VARCHAR(255) NOT NULL,
  \`payment_method\` VARCHAR(50) DEFAULT 'Bank Deposit',
  \`payment_ref\` VARCHAR(100),
  \`payment_slip_url\` TEXT NOT NULL,
  \`amount_paid\` DECIMAL(10,2) NOT NULL,
  \`status\` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  \`admin_notes\` TEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. CONFIDENTIAL COUNSELLING APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS \`client_appointments\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`full_name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) NOT NULL,
  \`service_id\` VARCHAR(100) NOT NULL,
  \`service_title\` VARCHAR(255) NOT NULL,
  \`preferred_date\` DATE NOT NULL,
  \`preferred_time\` VARCHAR(50) NOT NULL,
  \`session_type\` ENUM('In-Person (Colombo)', 'Online Video Call') NOT NULL,
  \`notes\` TEXT,
  \`status\` ENUM('Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  \`admin_notes\` TEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([sqlCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'helping_hearts_database.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Database Schema & Deployment Docs</h1>
          <p className="text-xs text-slate-500">Official MySQL/MariaDB database blueprint and deployment guides for InfinityFree & CPanel.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            {copied ? 'Copied to Clipboard!' : 'Copy SQL'}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-300" /> Download database.sql
          </button>
        </div>
      </div>

      {/* SQL Code Block */}
      <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3 font-mono text-xs overflow-x-auto">
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
          <span className="flex items-center gap-2">
            <Server className="w-4 h-4 text-teal-400" /> database.sql (MySQL 8.0 / MariaDB Compatible)
          </span>
          <span className="text-amber-400 font-bold">utf8mb4_unicode_ci</span>
        </div>

        <pre className="max-h-96 overflow-y-auto leading-relaxed text-teal-300">
          <code>{sqlCode}</code>
        </pre>
      </div>

      {/* Deployment & Architecture Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-800" /> Free Hosting (InfinityFree / cPanel) Setup
          </h3>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-700 leading-relaxed">
            <li>Log into your InfinityFree Control Panel (cPanel) or phpMyAdmin.</li>
            <li>Create a new MySQL Database named <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-900 font-mono">helping_hearts_db</code>.</li>
            <li>Open phpMyAdmin and click the <strong>Import</strong> tab.</li>
            <li>Upload the downloaded <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-900 font-mono">database.sql</code> file and click Go.</li>
            <li>All tables, indexes, and foreign keys will be created automatically.</li>
          </ol>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> Data Isolation Security Guarantee
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Confidential client counselling appointment requests (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">client_appointments</code>) are stored in a dedicated, isolated database table. No student account or lecturer role has read access to client appointments.
          </p>
        </div>
      </div>
    </div>
  );
};
