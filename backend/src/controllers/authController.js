import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

export const register = async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user - handle preferred_currency column gracefully
    let user, error;
    try {
      const { data: userWithPrefs, error: errorWithPrefs } = await supabase
        .from('users')
        .insert({
          email,
          password_hash,
          full_name,
          phone: phone || null,
          role: 'user'
        })
        .select('id, email, full_name, phone, role, created_at, preferred_currency')
        .single();

      if (errorWithPrefs) {
        // Check if error is due to missing column
        const errorMsg = errorWithPrefs.message || '';
        const errorCode = errorWithPrefs.code || '';
        if (errorMsg.includes('column') || errorMsg.includes('preferred_currency') || 
            errorCode === 'PGRST116' || errorCode === '42703') {
          // Column doesn't exist, try without preferred_currency
          const { data: userWithoutPrefs, error: errorWithoutPrefs } = await supabase
            .from('users')
            .insert({
              email,
              password_hash,
              full_name,
              phone: phone || null,
              role: 'user'
            })
            .select('id, email, full_name, phone, role, created_at')
            .single();
          
          user = userWithoutPrefs;
          error = errorWithoutPrefs;
          if (user) {
            user.preferred_currency = 'USD'; // Default value
          }
        } else {
          user = userWithPrefs;
          error = errorWithPrefs;
        }
      } else {
        user = userWithPrefs;
        error = null;
      }
    } catch (queryError) {
      // If query fails completely, try without preferred_currency
      const { data: userWithoutPrefs, error: errorWithoutPrefs } = await supabase
        .from('users')
        .insert({
          email,
          password_hash,
          full_name,
          phone: phone || null,
          role: 'user'
        })
        .select('id, email, full_name, phone, role, created_at')
        .single();
      
      user = userWithoutPrefs;
      error = errorWithoutPrefs;
      if (user) {
        user.preferred_currency = 'USD'; // Default value
      }
    }

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to register user',
        details: error.message || 'Database error'
      });
    }

    if (!user) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET not configured' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        preferred_currency: user.preferred_currency || 'USD'
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      details: error.message || 'Unknown error'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user - try with preferred_currency first, fallback if column doesn't exist
    let user, error;
    try {
      const { data: userWithPrefs, error: errorWithPrefs } = await supabase
        .from('users')
        .select('id, email, password_hash, full_name, phone, role, preferred_currency')
        .eq('email', email)
        .single();

      if (errorWithPrefs) {
        // Check if error is due to missing column
        const errorMsg = errorWithPrefs.message || '';
        const errorCode = errorWithPrefs.code || '';
        if (errorMsg.includes('column') || errorMsg.includes('preferred_currency') || 
            errorCode === 'PGRST116' || errorCode === '42703') {
          // Column doesn't exist, try without preferred_currency
          const { data: userWithoutPrefs, error: errorWithoutPrefs } = await supabase
            .from('users')
            .select('id, email, password_hash, full_name, phone, role')
            .eq('email', email)
            .single();
          
          user = userWithoutPrefs;
          error = errorWithoutPrefs;
          if (user) {
            user.preferred_currency = 'USD'; // Default value
          }
        } else {
          user = userWithPrefs;
          error = errorWithPrefs;
        }
      } else {
        user = userWithPrefs;
        error = null;
      }
    } catch (queryError) {
      // If query fails completely, try without preferred_currency
      const { data: userWithoutPrefs, error: errorWithoutPrefs } = await supabase
        .from('users')
        .select('id, email, password_hash, full_name, phone, role')
        .eq('email', email)
        .single();
      
      user = userWithoutPrefs;
      error = errorWithoutPrefs;
      if (user) {
        user.preferred_currency = 'USD'; // Default value
      }
    }

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        preferred_currency: user.preferred_currency || 'USD'
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Login error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    res.status(500).json({ 
      error: 'Failed to login', 
      details: error.message || 'Unknown error'
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, phone, role, created_at, preferred_currency')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      user: {
        ...user,
        preferred_currency: user.preferred_currency || 'USD'
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
};

export const socialLogin = async (req, res) => {
  try {
    const { supabase_user_id, email, full_name, provider } = req.body;

    if (!supabase_user_id || !email) {
      return res.status(400).json({ error: 'Supabase user ID and email are required' });
    }

    // Check if user already exists by supabase_user_id first
    let existingUser = null;
    const { data: userBySupabaseId } = await supabase
      .from('users')
      .select('id, email, full_name, phone, role, created_at, supabase_user_id, preferred_currency')
      .eq('supabase_user_id', supabase_user_id)
      .maybeSingle();
    
    if (userBySupabaseId) {
      existingUser = userBySupabaseId;
    } else {
      // Check by email if not found by supabase_user_id
      const { data: userByEmail } = await supabase
        .from('users')
        .select('id, email, full_name, phone, role, created_at, supabase_user_id, preferred_currency')
        .eq('email', email)
        .maybeSingle();
      
      if (userByEmail) {
        existingUser = userByEmail;
      }
    }

    let user;

    if (existingUser) {
      // Update existing user with supabase_user_id if not set
      if (!existingUser.supabase_user_id) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ supabase_user_id })
          .eq('id', existingUser.id)
          .select('id, email, full_name, phone, role, created_at, preferred_currency')
          .single();
        
        if (updateError) {
          throw updateError;
        }
        user = updatedUser;
      } else {
        user = existingUser;
      }
    } else {
      // Create new user from social auth
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          supabase_user_id,
          email,
          full_name: full_name || email.split('@')[0],
          password_hash: null, // Social auth users don't have passwords
          role: 'user'
        })
        .select('id, email, full_name, phone, role, created_at, preferred_currency')
        .single();

      if (createError) {
        throw createError;
      }
      user = newUser;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Social login successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        preferred_currency: user.preferred_currency || 'USD'
      },
      token
    });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ 
      error: 'Failed to process social login',
      details: error.message || 'Unknown error'
    });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { preferred_currency } = req.body;

    // Validate currency code
    const validCurrencies = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'ZAR'];
    if (preferred_currency && !validCurrencies.includes(preferred_currency)) {
      return res.status(400).json({ error: 'Invalid currency code' });
    }

    const updateData = {};
    if (preferred_currency !== undefined) {
      updateData.preferred_currency = preferred_currency;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    // Try to update with preferred_currency, fallback if column doesn't exist
    let user, error;
    try {
      const { data: userWithPrefs, error: errorWithPrefs } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select('id, email, full_name, phone, role, created_at, preferred_currency')
        .single();

      if (errorWithPrefs) {
        console.error('Supabase update error:', errorWithPrefs);
        // Check if error is due to missing column
        const errorMsg = (errorWithPrefs.message || '').toLowerCase();
        const errorCode = errorWithPrefs.code || '';
        const errorDetails = errorWithPrefs.details || '';
        const errorHint = errorWithPrefs.hint || '';
        
        // Check for various column-related error patterns
        if (errorMsg.includes('column') || 
            errorMsg.includes('preferred_currency') || 
            errorMsg.includes('does not exist') ||
            errorCode === 'PGRST116' || 
            errorCode === '42703' ||
            errorCode === '42P01' ||
            errorDetails.includes('column') ||
            errorHint.includes('column')) {
          // Column doesn't exist - return error asking to run migration
          console.error('preferred_currency column not found in database');
          return res.status(500).json({ 
            error: 'Currency preference column not found. Please run the migration to add preferred_currency column to the users table.',
            details: 'Run this SQL in your Supabase SQL Editor: ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_currency VARCHAR(10) DEFAULT \'USD\';',
            migrationFile: 'database/migration_add_preferred_currency.sql'
          });
        }
        user = userWithPrefs;
        error = errorWithPrefs;
      } else {
        user = userWithPrefs;
        error = null;
      }
    } catch (queryError) {
      console.error('Update preferences query error:', queryError);
      console.error('Query error details:', {
        message: queryError.message,
        code: queryError.code,
        name: queryError.name
      });
      
      // Check if it's a column error
      const errorMsg = (queryError.message || '').toLowerCase();
      if (errorMsg.includes('column') || errorMsg.includes('preferred_currency') || errorMsg.includes('does not exist')) {
        return res.status(500).json({ 
          error: 'Currency preference column not found. Please run the migration to add preferred_currency column to the users table.',
          details: 'Run this SQL in your Supabase SQL Editor: ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_currency VARCHAR(10) DEFAULT \'USD\';',
          migrationFile: 'database/migration_add_preferred_currency.sql'
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to update preferences',
        details: queryError.message || 'Unknown error'
      });
    }

    if (error || !user) {
      console.error('Update preferences error:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });
      return res.status(500).json({ 
        error: 'Failed to update preferences',
        details: error?.message || 'Unknown error'
      });
    }

    res.json({
      message: 'Preferences updated successfully',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        preferred_currency: user.preferred_currency || 'USD'
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    console.error('Update preferences error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    res.status(500).json({ 
      error: 'Failed to update preferences',
      details: error.message || 'Unknown error'
    });
  }
};

