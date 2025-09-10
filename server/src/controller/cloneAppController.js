const pool = require("../../lib/dbConnection");

const getStockData = async (req, res) => {
    const { stock } = req.params;

  try {
    
    let infoQuery = `
    SELECT *
    FROM us_clone_warren
    WHERE ticker=$1
    `;
    
    const { rows: rows1 } = await pool.query(infoQuery, [stock]);

     let chartQuery = `
    SELECT 
    id,
    stock_ticker,
    report_date::date AS report_date,
    revenue,
    revenue_growth_yoy,
    cost_of_revenue,
    gross_profit,
    selling_general_admin,
    other_operating_expenses,
    operating_expenses,
    operating_income,
    interest_income,
    interest_expense,
    other_expense_income,
    pretax_income,
    income_tax,
    net_income,
    net_income_growth,
    shares_outstanding_basic,
    shares_outstanding_diluted,
    shares_change,
    eps_basic,
    eps_diluted,
    eps_growth,
    gross_margin,
    operating_margin,
    profit_margin,
    effective_tax_rate,
    ebitda,
    ebitda_margin,
    ebit,
    ebit_margin
FROM ind_fin_data_income
WHERE stock_ticker = $1;


    `;
    
    const { rows: rows2 } = await pool.query(chartQuery, [stock]);

   const formattedRows = rows2.map(r => {
  const d = new Date(r.report_date);
  // Use local date components
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return {
    ...r,
    report_date: `${year}-${month}-${day}`
  };
});

    res.status(200).json({
      data: rows1,
      chartData: formattedRows
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