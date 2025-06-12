-- Migration: PostgreSQL schema for WellMind app
-- Creates tables used by the mobile application.

-- Ensure uuid generation available
create extension if not exists "pgcrypto";

-- USERS table -----------------------------------------------------------------
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone_number text,
  email text,
  created_at timestamp with time zone default now()
);

-- JOURNAL ENTRIES -------------------------------------------------------------
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- DAILY GOALS -----------------------------------------------------------------
create table if not exists daily_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  is_done boolean not null default false,
  show_on_home boolean not null default false,
  created_at timestamp with time zone default now()
);

-- MOOD LOGS -------------------------------------------------------------------
create table if not exists mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood text not null,
  logged_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  unique (user_id, logged_at)
); 