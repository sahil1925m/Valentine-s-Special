import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
    return supabaseUrl !== '' && supabaseAnonKey !== '';
};

// Create a dummy client or real client depending on configuration
// The dummy client will fail gracefully when methods are called
let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

// Export a proxy that handles missing configuration gracefully
export const supabase = supabaseClient as SupabaseClient;

// Type for the proposals table
export interface ProposalRecord {
    id: string;
    partner_name: string;
    intro_message?: string;
    messages: string[];
    image_urls: string[];
    theme?: string;
    created_at: string;
}
