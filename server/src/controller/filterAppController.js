const pool = require("../../lib/dbConnection");

const getFilterAppData = async (req, res) => {
     const { page = "1", marketCap } = req.query;

  try {
    const limit = 10;
    const offset = (Number(page) - 1) * limit;

    let minCap = null;
    let maxCap = null;

    switch (marketCap) {
      case "below1B":
        maxCap = 1_000_000_000;
        break;
      case "over1B":
        minCap = 1_000_000_000;
        break;
      case "over300M":
        minCap = 300_000_000;
        break;
      case "over100M":
        minCap = 100_000_000;
        break;
      case "megaCap":
        minCap = 200_000_000_000;
        break;
      case "largeCap":
        minCap = 10_000_000_000;
        maxCap = 200_000_000_000;
        break;
      case "midCap":
        minCap = 2_000_000_000;
        maxCap = 10_000_000_000;
        break;
      case "smallCap":
        minCap = 300_000_000;
        maxCap = 2_000_000_000;
        break;
      case "microCap":
        maxCap = 300_000_000;
        break;
    }
    
    let query = `
    SELECT *
    FROM filter_data
    WHERE 1=1
    `;
    const values = [];
    
    if (minCap !== null) {
      values.push(minCap);
      query += ` AND market_cap >= $${values.length}`;
    }
    if (maxCap !== null) {
      values.push(maxCap);
      query += ` AND market_cap <= $${values.length}`;
    }
    
    values.push(limit, offset);
    query += ` ORDER BY symbol LIMIT $${values.length - 1} OFFSET $${values.length}`;
    
    const { rows } = await pool.query(query, values);

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM filter_data
      WHERE 1=1
    `;
    const countValues = [];

    if (minCap !== null) {
      countValues.push(minCap);
      countQuery += ` AND market_cap >= $${countValues.length}`;
    }
    if (maxCap !== null) {
      countValues.push(maxCap);
      countQuery += ` AND market_cap <= $${countValues.length}`;
    }

    const countResult = await pool.query(countQuery, countValues);

    // const { rows } = await pool.query(query, [limit, offset]);
    res.status(200).json({
      total: parseInt(countResult.rows[0].total, 10),
      page: Number(page),
      pageSize: limit,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getFilterAppData };