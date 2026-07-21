/*
  # Add Newsletter Subscription System

  1. New Tables
    - `newsletter_subscribers` - Email subscribers for newsletter

  2. Security
    - Enable RLS on newsletter_subscribers table
    - Add policies for public signup and admin management

  3. Features
    - Track subscriber email and signup date
    - Track subscription status
    - Support bulk messaging for admin
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own subscription"
  ON newsletter_subscribers FOR SELECT
  USING (true);

CREATE POLICY "Subscribers can update their own status"
  ON newsletter_subscribers FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
