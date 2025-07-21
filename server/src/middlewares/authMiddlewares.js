
const { supabaseAdmin } = require('../../lib/supabase');


exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token not provided or malformed.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token using Supabase's admin client
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      console.error('Token verification failed:', error?.message || 'No user data.');
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // Attach user information to the request object
    // For CommonJS, you might not have explicit type extensions, but you can still attach it.
    req.user = {
      id: data.user.id,
      email: data.user.email || 'N/A',
      // You could fetch more profile data here if needed, but for middleware, basic is fine.
    };

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Authentication middleware error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};
