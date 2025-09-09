const pool = require("../../lib/dbConnection");

const getStockData = async (req, res) => {
    const { stock } = req.params;

  try {
    
    let query = `
    SELECT *
    FROM us_clone_warren
    WHERE ticker=$1
    `;
    
    const { rows } = await pool.query(query, [stock]);

    res.status(200).json({
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllStocks = async (req, res) => {
     const { page = "1" } = req.query;

  try {
    const limit = 15;
    const offset = (Number(page) - 1) * limit;
    
    let query = `
    SELECT *
    FROM us_clone_warren
    LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(query, [limit, offset]);
    res.status(200).json({
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getStockData, getAllStocks };