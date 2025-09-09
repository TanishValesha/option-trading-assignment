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

module.exports = { getStockData };