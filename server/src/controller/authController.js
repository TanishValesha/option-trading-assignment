// controllers/userController.js
// Import both supabase clients using require()
const { supabase, supabaseAdmin } = require('../../lib/supabase'); // Adjust path if necessary

/**
 * @function registerUser
 * @description Handles user registration: signs up with Supabase Auth
 * and creates a corresponding profile in the public.users table.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  // --- Basic Input Validation ---
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  try {
    // 1. Sign up user with Supabase Auth
    const {
      data: { user, session }, // 'session' will be null if email confirmation is required
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error("Supabase signup error:", signUpError.message);
      return res.status(400).json({ error: signUpError.message });
    }

    if (!user) {
      // This case indicates that email confirmation is likely enabled.
      // Supabase will send a confirmation email.
      return res.status(200).json({
        message: "User registered successfully. Please check your email to confirm your account.",
        sessionStatus: 'awaiting_email_confirmation'
      });
    }

    // 2. Create a corresponding entry in your `public.users` profile table.
    const { data: newProfile, error: profileInsertError } = await supabaseAdmin
      .from('users') // Your custom users table (e.g., public.users)
      .insert({
        id: user.id, // Link to Supabase Auth user ID
        email: user.email, // Use the email from the Supabase Auth user
        name: name || null, // Use null if name is optional and not provided
      })
      .select('id, email, name') // Select the created profile data to return
      .single(); // Expect one row inserted

    if (profileInsertError || !newProfile) {
      console.error("Error creating user profile in public.users:", profileInsertError?.message);
      // IMPORTANT: If profile creation fails, you might want to delete the Supabase Auth user
      // await supabaseAdmin.auth.admin.deleteUser(user.id);
      return res.status(500).json({ error: "Failed to create user profile after signup." });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: newProfile,
      sessionStatus: 'active'
    });

  } catch (error) {
    console.error("Registration general error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @function loginUser
 * @description Handles user login: signs in with Supabase Auth
 * and returns basic user profile data.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // --- Basic Input Validation ---
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Password length validation for login (optional but good practice)
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  try {
    // 1. Sign in user with Supabase Auth
    // This handles user lookup and password verification.
    const {
      data: { user, session },
      error: signInError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Supabase sign-in error:", signInError.message);
      // Generic error message for security (don't reveal if email or password was wrong)
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!user || !session) {
      // This case should ideally not happen if no signInError, but good for safety
      return res.status(500).json({ error: "Authentication failed. User or session data missing." });
    }

    // 2. Fetch additional user profile data from your `public.users` table (optional, but good to return)
    //    We use the regular `supabase` client here because the user is now authenticated,
    //    and RLS policies should allow them to read their own profile.
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name') // Select the profile fields you want to return
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
        console.warn(`User profile not found in public.users for ID: ${user.id}. Error: ${profileError?.message}`);
        // Log this, but don't fail login if auth succeeded. Just return basic user data.
        return res.status(200).json({
          message: "Login successful (profile not found in custom table)",
          user: { id: user.id, email: user.email }, // Basic user data from auth.users
        });
    }

    // Supabase handles the JWT and session cookie setting internally.
    res.status(200).json({
      message: "Login successful",
      user: userProfile, // Return the full user profile
    });

  } catch (error) {
    console.error("Login general error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @function logoutUser
 * @description Handles user logout: invalidates the user's session with Supabase Auth.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const logoutUser = async (req, res) => {
  try {
    // Call Supabase's signOut method.
    // This will invalidate the current session for the user whose token is active.
    // Supabase client (used on the frontend) handles clearing its stored session and cookies.
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("Supabase signOut error:", signOutError.message);
      return res.status(500).json({ error: signOutError.message });
    }

    // Respond with a success message
    res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {
    console.error("Logout general error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser, logoutUser }; // Export the functions