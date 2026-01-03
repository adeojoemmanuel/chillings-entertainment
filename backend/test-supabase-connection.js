#!/usr/bin/env node

/**
 * Supabase Connection Diagnostic Tool
 * 
 * This script helps diagnose Supabase connection issues by testing:
 * 1. Environment variables
 * 2. URL accessibility
 * 3. API key validity
 * 4. Database connectivity
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

console.log('🔍 Supabase Connection Diagnostic Tool\n');
console.log('=' .repeat(50));

// Test 1: Check environment variables
console.log('\n📋 Test 1: Environment Variables');
console.log('-'.repeat(50));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

let envOk = true;

if (!supabaseUrl) {
  console.error('❌ SUPABASE_URL is missing');
  envOk = false;
} else {
  console.log('✓ SUPABASE_URL is set');
  try {
    const url = new URL(supabaseUrl);
    console.log(`   URL: ${url.origin}`);
    if (!url.protocol.startsWith('https')) {
      console.warn('   ⚠️  Warning: URL should use HTTPS');
    }
  } catch (error) {
    console.error('❌ SUPABASE_URL is invalid:', error.message);
    envOk = false;
  }
}

if (!supabaseKey) {
  console.error('❌ SUPABASE_KEY is missing');
  envOk = false;
} else {
  console.log('✓ SUPABASE_KEY is set');
  console.log(`   Key preview: ${supabaseKey.substring(0, 20)}...${supabaseKey.substring(supabaseKey.length - 10)}`);
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_KEY is missing');
  envOk = false;
} else {
  console.log('✓ SUPABASE_SERVICE_KEY is set');
  console.log(`   Key preview: ${supabaseServiceKey.substring(0, 20)}...${supabaseServiceKey.substring(supabaseServiceKey.length - 10)}`);
}

if (!envOk) {
  console.error('\n❌ Environment variables check failed. Please check your .env file.');
  process.exit(1);
}

// Test 2: Test URL accessibility
console.log('\n🌐 Test 2: URL Accessibility');
console.log('-'.repeat(50));

try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'HEAD',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    },
    signal: controller.signal
  });
  
  clearTimeout(timeoutId);
  
  if (response.ok || response.status === 404) {
    console.log('✓ Supabase endpoint is reachable');
    console.log(`   Status: ${response.status}`);
  } else {
    console.warn(`⚠️  Supabase endpoint returned status: ${response.status}`);
    if (response.status === 401) {
      console.error('   ❌ Authentication failed - check your API keys');
    }
  }
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('❌ Connection timeout - Supabase endpoint is not reachable');
    console.error('   This could indicate:');
    console.error('   - Internet connectivity issues');
    console.error('   - Firewall/proxy blocking the connection');
    console.error('   - Incorrect SUPABASE_URL');
    console.error('   - Supabase project is paused');
  } else {
    console.error('❌ Cannot reach Supabase endpoint:', error.message);
    console.error('   Error type:', error.constructor.name);
    if (error.cause) {
      console.error('   Root cause:', error.cause.message);
    }
  }
}

// Test 3: Test Supabase client
console.log('\n🔌 Test 3: Supabase Client Connection');
console.log('-'.repeat(50));

try {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  
  console.log('✓ Supabase client created');
  
  // Test query
  const { data, error } = await supabase
    .from('users')
    .select('count')
    .limit(1);
  
  if (error) {
    if (error.code === 'PGRST116') {
      console.log('✓ Database connection successful (table is empty)');
    } else {
      console.error('❌ Database query failed:', error.message);
      console.error('   Error code:', error.code);
      console.error('   Error details:', error.details);
      console.error('   Error hint:', error.hint);
    }
  } else {
    console.log('✓ Database connection successful');
  }
} catch (error) {
  console.error('❌ Supabase client error:', error.message);
  if (error.cause) {
    console.error('   Root cause:', error.cause.message);
  }
  if (error.suggestions) {
    console.error('   Suggestions:');
    error.suggestions.forEach((suggestion, i) => {
      console.error(`   ${i + 1}. ${suggestion}`);
    });
  }
}

// Test 4: Test specific tables
console.log('\n📊 Test 4: Database Tables');
console.log('-'.repeat(50));

const tablesToTest = ['users', 'events', 'cities', 'service_types', 'vendors'];

try {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  for (const table of tablesToTest) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.code === '42P01') {
          console.warn(`⚠️  Table '${table}' does not exist`);
        } else if (error.code === 'PGRST116') {
          console.log(`✓ Table '${table}' exists (empty)`);
        } else {
          console.warn(`⚠️  Table '${table}' error: ${error.message}`);
        }
      } else {
        console.log(`✓ Table '${table}' exists and is accessible`);
      }
    } catch (error) {
      console.error(`❌ Error testing table '${table}':`, error.message);
    }
  }
} catch (error) {
  console.error('❌ Error testing tables:', error.message);
}

console.log('\n' + '='.repeat(50));
console.log('✅ Diagnostic complete!');
console.log('\nIf you see errors above, please:');
console.log('1. Verify your SUPABASE_URL is correct');
console.log('2. Check that your Supabase project is active (not paused)');
console.log('3. Verify your API keys are correct in Supabase dashboard');
console.log('4. Check your internet connection');
console.log('5. Review the TROUBLESHOOTING.md file for more help\n');

