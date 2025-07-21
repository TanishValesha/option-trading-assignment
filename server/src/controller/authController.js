// controllers/userController.js (Backend)
const { supabase, supabaseAdmin } = require('../../lib/supabase');

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
    const {
      data: { user, session }, // We need the 'session' object here for the frontend
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
      return res.status(200).json({
        message: "User registered successfully. Please check your email to confirm your account.",
        sessionStatus: 'awaiting_email_confirmation',
        // session: null // Explicitly null if no immediate session
      });
    }

    const { data: newProfile, error: profileInsertError } = await supabaseAdmin
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        name: name || null,
      })
      .select('id, email, name')
      .single();

    if (profileInsertError || !newProfile) {
      console.error("Error creating user profile in public.users:", profileInsertError?.message);
      return res.status(500).json({ error: "Failed to create user profile after signup." });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: newProfile,
      sessionStatus: 'active', // Session is active because user object is present
      session: session // <--- SEND SESSION BACK TO FRONTEND
    });

  } catch (error) {
    console.error("Registration general error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @function loginUser
 * @description Handles user login: signs in with Supabase Auth
 * and returns basic user profile data AND session tokens.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { return res.status(400).json({ error: "Missing email or password" }); }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) { return res.status(400).json({ error: "Invalid email format" }); }
  if (password.length < 8) { return res.status(400).json({ error: "Password must be at least 8 characters long" }); }

  try {
    const {
      data: { user, session },
      error: signInError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Supabase sign-in error:", signInError.message);
      return res.status(400).json({ error: "Invalid credentials" });
    }
    if (!user || !session) {
      return res.status(500).json({ error: "Authentication failed. User or session data missing." });
    }

    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
        console.warn(`User profile not found in public.users for ID: ${user.id}. Error: ${profileError?.message}`);
        return res.status(200).json({
          message: "Login successful (profile not found in custom table)",
          user: { id: user.id, email: user.email },
          session: session
        });
    }

    res.status(200).json({
      message: "Login successful",
      user: userProfile,
      session: session // <--- SEND SESSION BACK TO FRONTEND
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
    // Calling signOut from backend ensures the session is invalidated on Supabase's server.
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("Supabase signOut error:", signOutError.message);
      return res.status(500).json({ error: signOutError.message });
    }

    res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {
    console.error("Logout general error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser, logoutUser };