import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Store config fetched from API
let cachedConfig: { url: string; key: string } | null = null;
let configPromise: Promise<{ url: string; key: string }> | null = null;

// Fetch config from server-side API (where env vars work)
async function fetchConfig(): Promise<{ url: string; key: string }> {
    if (cachedConfig) return cachedConfig;

    if (configPromise) return configPromise;

    configPromise = fetch('/api/config')
        .then(res => res.json())
        .then(data => {
            cachedConfig = {
                url: data.supabaseUrl || '',
                key: data.supabaseAnonKey || ''
            };
            return cachedConfig;
        })
        .catch(err => {
            console.error('Failed to fetch config:', err);
            return { url: '', key: '' };
        });

    return configPromise;
}

// Synchronous check - uses cached value or returns false
export const isSupabaseConfigured = () => {
    if (cachedConfig) {
        return cachedConfig.url !== '' && cachedConfig.key !== '' && cachedConfig.url.includes('supabase');
    }
    // If not cached yet, trigger fetch and return false for now
    if (typeof window !== 'undefined') {
        fetchConfig();
    }
    return false;
};

// Async check - waits for config to be fetched
export const checkSupabaseConfigured = async (): Promise<boolean> => {
    const config = await fetchConfig();
    return config.url !== '' && config.key !== '' && config.url.includes('supabase');
};

// Lazy initialization - create client only when first accessed
let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = async (): Promise<SupabaseClient | null> => {
    if (supabaseClient) return supabaseClient;

    const config = await fetchConfig();

    if (config.url && config.key && config.url.includes('supabase')) {
        supabaseClient = createClient(config.url, config.key);
    }
    return supabaseClient;
};

// For backward compatibility - synchronous client getter
const getSupabaseClientSync = (): SupabaseClient | null => {
    if (supabaseClient) return supabaseClient;

    if (cachedConfig && cachedConfig.url && cachedConfig.key) {
        supabaseClient = createClient(cachedConfig.url, cachedConfig.key);
    }
    return supabaseClient;
};

// Export a getter that handles missing configuration gracefully
export const supabase = new Proxy({} as SupabaseClient, {
    get(_, prop) {
        const client = getSupabaseClientSync();
        if (!client) {
            console.warn('Supabase not configured or config not loaded yet');
            return () => Promise.resolve({ data: null, error: new Error('Supabase not configured') });
        }
        return (client as unknown as Record<string, unknown>)[prop as string];
    }
});

// Initialize config on module load (client-side only)
if (typeof window !== 'undefined') {
    fetchConfig();
}

// Type for the proposals table
export interface ProposalRecord {
    id: string;
    partner_name: string;
    partner_gender?: string;
    intro_message?: string;
    messages: string[];
    image_urls: string[];
    theme?: string;
    created_at: string;
    // RSVP Fields
    response_date?: string;
    response_time?: string;
    response_message?: string;
    // Creator notification
    creator_email?: string;
    email_sent?: boolean;
}
