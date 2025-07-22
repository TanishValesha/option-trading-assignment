// controllers/positionsController.js
const { supabase } = require('../../lib/supabase'); // Use the public supabase client for DB operations (RLS will protect it)

/**
 * @function savePositions
 * @description Saves (inserts or updates) an array of position objects for the authenticated user.
 * Assumes positions in the array might have an 'id' for updates, or no 'id' for new inserts.
 * @param {object} req - Express request object (expected: req.user from authMiddleware, req.body.positions as array)
 * @param {object} res - Express response object
 */
const savePositions = async (req, res) => {
  // Ensure user is authenticated (authMiddleware should have populated req.user)
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "User not authenticated." });
  }

  const userId = req.user.id; // Get the authenticated user's ID
  console.log(userId);
  
  const positionsToSave = req.body; // Expect an array of position objects
  console.log(positionsToSave);
  

  if (!Array.isArray(positionsToSave)) {
    return res.status(400).json({ error: "Request body must contain an array of 'positions'." });
  }

  if (positionsToSave.length === 0) {
    return res.status(200).json({ message: "No positions provided to save." });
  }

  const preparedPositions = positionsToSave.map(pos => ({
    "userId": userId,
    "lotNo": pos.lotNo,
    qty: pos.qty,
    strike: pos.strike,
    side: pos.side,
    type: pos.type,
    expiry: pos.expiry,
    entry: pos.entry,
    ltp: pos.ltp,
    delta: pos.delta,
    "pnlAbs": pos.pnlAbs,
    "pnlPct": pos.pnlPct,
    "end_date": pos.end_date,
    selected: pos.selected,
  }));

  try {
    // Use Supabase's `upsert` method for efficient bulk insert/update.
    // `onConflict: 'id'` tells Supabase to update existing rows if an 'id' matches,
    // otherwise insert new rows.
    const { data, error } = await supabase
      .from('positions')
      .upsert(preparedPositions, { onConflict: 'id' })
      .select('*'); // Select all columns of the affected rows

    if (error) {
      console.error("Error saving positions:", error.message);
      return res.status(500).json({ error: "Failed to save positions: " + error.message });
    }

    res.status(200).json({
      message: "Positions saved successfully",
      savedPositions: data, // Return the saved/updated positions
    });

  } catch (error) {
    console.error("General error in savePositions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @function getPositions
 * @description Retrieves positions for the authenticated user where 'selected' is true.
 * @param {object} req - Express request object (expected: req.user from authMiddleware)
 * @param {object} res - Express response object
 */
const getPositions = async (req, res) => {
  // Ensure user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "User not authenticated." });
  }

  const userId = req.user.id; // Get the authenticated user's ID
  console.log(`Fetching positions for userId: ${userId} with selected: true`);

  try {
    const { data, error } = await supabase
      .from('positions')
      .select('*') // Select all columns
      .eq('userId', userId) // Filter by authenticated user's ID
      .eq('selected', true); // Filter where 'selected' column is true

    if (error) {
      console.error("Error fetching positions:", error.message);
      return res.status(500).json({ error: "Failed to fetch positions: " + error.message });
    }

    if (!data || data.length === 0) {
      console.log("No selected positions found for this user.");
      return res.status(200).json({ message: "No selected positions found.", positions: [] });
    }

    res.status(200).json({
      message: "Selected positions fetched successfully",
      positions: data,
    });

  } catch (error) {
    console.error("General error in getPositions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { savePositions, getPositions };