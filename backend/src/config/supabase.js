import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('SUPABASE_SERVICE_KEY:', supabaseKey ? 'Set' : 'Missing');
  throw new Error('Missing Supabase environment variables');
}

// Validate URL format
let parsedUrl;
try {
  parsedUrl = new URL(supabaseUrl);
  if (!parsedUrl.protocol.startsWith('https')) {
    console.warn('⚠️  Warning: SUPABASE_URL should use HTTPS protocol');
  }
} catch (error) {
  console.error('Invalid SUPABASE_URL format:', supabaseUrl);
  throw new Error('Invalid SUPABASE_URL format');
}

// Log URL (without exposing full key)
console.log('🔗 Supabase URL:', parsedUrl.origin);
console.log('🔑 Service Key:', supabaseKey.substring(0, 20) + '...' + (supabaseKey.length > 20 ? supabaseKey.substring(supabaseKey.length - 10) : ''));

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  db: {
    schema: 'public'
  },
  global: {
    fetch: async (url, options = {}) => {
      // Add timeout to fetch requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        
        // Provide more detailed error information
        if (error.name === 'AbortError') {
          const fetchError = new Error('Request timeout: Supabase connection timed out after 30 seconds');
          fetchError.cause = error;
          fetchError.url = url;
          throw fetchError;
        }
        
        // Enhance fetch failed errors with more context
        if (error.message && error.message.includes('fetch failed')) {
          const enhancedError = new Error(`Network error connecting to Supabase: ${error.message}`);
          enhancedError.cause = error;
          enhancedError.url = url;
          enhancedError.suggestions = [
            'Check your internet connection',
            'Verify SUPABASE_URL is correct and accessible',
            'Check if Supabase project is active (not paused)',
            'Verify firewall/proxy settings',
            'Try accessing the Supabase URL in your browser'
          ];
          throw enhancedError;
        }
        
        throw error;
      }
    }
  }
});

// Enhanced connection test with better diagnostics
(async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test 1: Basic connectivity
    const testUrl = `${supabaseUrl}/rest/v1/`;
    let timeoutId;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(testUrl, {
        method: 'HEAD',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok && response.status !== 404) {
        console.warn(`⚠️  Supabase endpoint returned status: ${response.status}`);
      }
    } catch (fetchError) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('✗ Cannot reach Supabase endpoint:', fetchError.message);
      console.error('   URL tested:', testUrl);
      if (fetchError.cause) {
        console.error('   Cause:', fetchError.cause.message);
      }
    }
    
    // Test 2: Database query
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows is fine, just means table is empty
        console.log('✓ Supabase connection successful (table is empty)');
      } else {
        console.warn('⚠️  Supabase query warning:', error.message);
        console.warn('   Error code:', error.code);
        console.warn('   Error details:', error.details);
      }
    } else {
      console.log('✓ Supabase connection successful');
    }
  } catch (error) {
    console.error('✗ Supabase connection failed:', error.message);
    if (error.cause) {
      console.error('   Root cause:', error.cause.message);
    }
    if (error.url) {
      console.error('   Failed URL:', error.url);
    }
    if (error.suggestions) {
      console.error('   Troubleshooting:');
      error.suggestions.forEach((suggestion, i) => {
        console.error(`   ${i + 1}. ${suggestion}`);
      });
    }
    console.error('Please check your SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
  }
})();

// Client for user operations (uses anon key)
export const supabaseClient = createClient(
  supabaseUrl,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      fetch: async (url, options = {}) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      }
    }
  }
);

