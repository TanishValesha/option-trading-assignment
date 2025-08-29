const { supabase } = require('../../lib/supabase');
const pool = require("../../lib/dbConnection"); // AWS PostgreSQL connection


const addToWatchlist = async (req, res) => {
  try {
    const { ticker } = req.body;
    const userId = req.user.id;

    if (!userId || !ticker) {
      return res.status(400).json({ error: "userId and ticker are required" });
    }

    // 1. Check if ticker exists in AWS PostgreSQL stock_data
    const stockQuery = "SELECT ticker FROM stock_data WHERE ticker = $1 LIMIT 1";
    const { rows } = await pool.query(stockQuery, [ticker.toUpperCase()]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Ticker not found in stocks table" });
    }

    // 2. Insert into Supabase watchlist
    const { data: watchlist, error: watchlistError } = await supabase
      .from("watchlist")
      .insert([{ user_id: userId, ticker: ticker.toUpperCase() }])
      .select()
      .single();

    if (watchlistError) {
      return res.status(400).json({ error: watchlistError.message });
    }

    return res.status(201).json({
      message: "Stock added to watchlist",
      watchlist,
    });
  } catch (err) {
    console.error("Error adding to watchlist:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const deleteFromWatchlist = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    // delete from supabase
    const { data, error } = await supabase
      .from("watchlist")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Watchlist item not found" });
    }

    return res.status(200).json({
      message: "Stock removed from watchlist",
      deleted: data[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTodayStockData = async (req, res) => {
  try {
    const { ticker } = req.params;

    if (!ticker) {
      return res.status(400).json({ error: "ticker is required" });
    }

    const query = `
      SELECT adj_close, change_percent
      FROM stock_data
      WHERE ticker = $1
      ORDER BY date DESC
      LIMIT 1;
    `;

    const { rows } = await pool.query(query, [ticker]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No record found for today" });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id

    // Fetch all watchlist tickers for the user
    const { data: watchlist, error } = await supabase
      .from('watchlist')
      .select('id, ticker, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ watchlist })
  } catch (err) {
    console.error('Error fetching watchlist:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


module.exports = { addToWatchlist, getWatchlist, deleteFromWatchlist, getTodayStockData }