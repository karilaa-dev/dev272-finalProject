-- Migration: 202406120002 – Enable Row-Level Security and ownership policies
-- This depends on tables created in 202406120001_initial_schema.sql

-- 1. Enable RLS for all user-facing tables
alter table if exists mood_logs       enable row level security;
alter table if exists daily_goals     enable row level security;
alter table if exists journal_entries enable row level security;
alter table if exists users           enable row level security;

-- 2. MOOD_LOGS policies -----------------------------------------------------
DROP POLICY IF EXISTS "mood owner select"  ON mood_logs;
DROP POLICY IF EXISTS "mood owner insert"  ON mood_logs;
DROP POLICY IF EXISTS "mood owner update"  ON mood_logs;
DROP POLICY IF EXISTS "mood owner delete"  ON mood_logs;

CREATE POLICY "mood owner select"
    ON mood_logs FOR SELECT  USING ( user_id = auth.uid() );
CREATE POLICY "mood owner insert"
    ON mood_logs FOR INSERT  WITH CHECK ( user_id = auth.uid() );
CREATE POLICY "mood owner update"
    ON mood_logs FOR UPDATE  USING ( user_id = auth.uid() );
CREATE POLICY "mood owner delete"
    ON mood_logs FOR DELETE  USING ( user_id = auth.uid() );

-- 3. DAILY_GOALS policies ----------------------------------------------------
DROP POLICY IF EXISTS "goal owner select"  ON daily_goals;
DROP POLICY IF EXISTS "goal owner insert"  ON daily_goals;
DROP POLICY IF EXISTS "goal owner update"  ON daily_goals;
DROP POLICY IF EXISTS "goal owner delete"  ON daily_goals;

CREATE POLICY "goal owner select"
    ON daily_goals FOR SELECT USING ( user_id = auth.uid() );
CREATE POLICY "goal owner insert"
    ON daily_goals FOR INSERT WITH CHECK ( user_id = auth.uid() );
CREATE POLICY "goal owner update"
    ON daily_goals FOR UPDATE USING ( user_id = auth.uid() );
CREATE POLICY "goal owner delete"
    ON daily_goals FOR DELETE USING ( user_id = auth.uid() );

-- 4. JOURNAL_ENTRIES policies ----------------------------------------------
DROP POLICY IF EXISTS "entry owner select"  ON journal_entries;
DROP POLICY IF EXISTS "entry owner insert"  ON journal_entries;
DROP POLICY IF EXISTS "entry owner update"  ON journal_entries;
DROP POLICY IF EXISTS "entry owner delete"  ON journal_entries;

CREATE POLICY "entry owner select"
    ON journal_entries FOR SELECT USING ( user_id = auth.uid() );
CREATE POLICY "entry owner insert"
    ON journal_entries FOR INSERT WITH CHECK ( user_id = auth.uid() );
CREATE POLICY "entry owner update"
    ON journal_entries FOR UPDATE USING ( user_id = auth.uid() );
CREATE POLICY "entry owner delete"
    ON journal_entries FOR DELETE USING ( user_id = auth.uid() );

-- 5. USERS (profile) table policies ----------------------------------------
DROP POLICY IF EXISTS "read own profile"    ON users;
DROP POLICY IF EXISTS "create own profile"  ON users;
DROP POLICY IF EXISTS "update own profile"  ON users;
DROP POLICY IF EXISTS "delete own profile"  ON users;

CREATE POLICY "read own profile"
    ON users FOR SELECT USING ( id = auth.uid() );
CREATE POLICY "create own profile"
    ON users FOR INSERT WITH CHECK ( id = auth.uid() );
CREATE POLICY "update own profile"
    ON users FOR UPDATE USING ( id = auth.uid() );
CREATE POLICY "delete own profile"
    ON users FOR DELETE USING ( id = auth.uid() );

-- Done ---------------------------------------------------------------------- 