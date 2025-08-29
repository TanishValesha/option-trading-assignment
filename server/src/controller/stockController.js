const pool = require("../../lib/dbConnection");

const getStockList = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ticker 
      FROM stock_data
      ORDER BY ticker
    `);

    res.json(result.rows.map(row => row.ticker));
  } catch (err) {
    console.error("Error fetching tickers:", err);
    res.status(500).json({ error: "Failed to fetch tickers" });
  }
};

// ✅ Get stock data for a ticker within date range
const getStockData = async (req, res) => {
  const { ticker } = req.params;
  const start = "2023-01-01";
  const end = "2025-08-31";

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM stock_data
      WHERE ticker = $1
      AND date BETWEEN $2 AND $3
      ORDER BY date ASC
      `,
      [ticker, start, end]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stock data:", err);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
};

module.exports = { getStockList, getStockData };
