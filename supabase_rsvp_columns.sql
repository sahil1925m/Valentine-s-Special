-- Run this in your Supabase SQL Editor to fix the "missing column" error

ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS response_date text,
ADD COLUMN IF NOT EXISTS response_time text,
ADD COLUMN IF NOT EXISTS response_message text;

-- (Optional) If you want to ensure the email status is tracked correctly
ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS email_sent boolean DEFAULT false;
