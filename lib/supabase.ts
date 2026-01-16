import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Helper to get the URL at runtime
const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const getSupabaseAnonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Helper to check if Supabase is configured - checks at runtime
export const isSupabaseConfigured = () => {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();

    // Debug logging - remove after fixing
    if (typeof window !== 'undefined') {
        console.log('Supabase Debug:', {
            urlExists: !!url,
            urlLength: url?.length || 0,
            keyExists: !!key,
            keyLength: key?.length || 0,
            urlPreview: url?.substring(0, 30) || 'EMPTY'
        });
    }

    return url !== '' && key !== '' && url.includes('supabase');
};

// Lazy initialization - create client only when first accessed
let supabaseClient: SupabaseClient | null = null;

const getSupabaseClient = (): SupabaseClient | null => {
    if (supabaseClient) return supabaseClient;

    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();

    if (url && key && url.includes('supabase')) {
        supabaseClient = createClient(url, key);
    }
    return supabaseClient;
};

// Export a getter that handles missing configuration gracefully
export const supabase = new Proxy({} as SupabaseClient, {
    get(_, prop) {
        const client = getSupabaseClient();
        if (!client) {
            console.warn('Supabase not configured. Add credentials to .env.local');
            return () => Promise.resolve({ data: null, error: new Error('Supabase not configured') });
        }
        return (client as unknown as Record<string, unknown>)[prop as string];
    }
});

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
