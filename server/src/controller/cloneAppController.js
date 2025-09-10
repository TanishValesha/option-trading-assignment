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

   const formattedRows1 = rows2.map(r => {
  const d = new Date(r.report_date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return {
    ...r,
    report_date: `${year}-${month}-${day}`
  };
});

  const balanceChartQuery = `SELECT
    id,
    stock_ticker,
    report_date::date AS report_date,
    cash_and_equivalents,
    short_term_investments,
    cash_and_cash_equivalents,
    cash_growth,
    receivables,
    inventory,
    other_current_assets,
    total_current_assets,
    property_plant_equipment,
    long_term_investments,
    goodwill,
    intangible_assets,
    other_long_term_assets,
    total_long_term_assets,
    total_assets,
    accounts_payable,
    deferred_revenue,
    current_debt,
    total_current_liabilities,
    other_current_liabilities,
    long_term_debt,
    total_long_term_liabilities,
    other_long_term_liabilities,
    total_liabilities,
    total_debt,
    debt_growth,
    common_stock,
    retained_earnings,
    comprehensive_income,
    shareholders_equity,
    total_liabilities_and_equity,
    net_cash_debt
FROM ind_fin_data_balance
WHERE stock_ticker = $1;`



const { rows: rows3 } = await pool.query(balanceChartQuery, [stock]);

const formattedRows2 = rows3.map(r => {
  const d = new Date(r.report_date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return {
    ...r,
    report_date: `${year}-${month}-${day}`
  };
});

const cashFlowQuery = `SELECT
    id,
    stock_ticker,
    report_date::date AS report_date,
    depreciation_amortization,
    share_based_compensation,
    other_operating_activities,
    operating_cash_flow,
    operating_cash_flow_growth,
    capital_expenditures,
    acquisitions,
    change_in_investments,
    other_investing_activities,
    investing_cash_flow,
    dividends_paid,
    other_financing_activities,
    financing_cash_flow,
    net_cash_flow,
    free_cash_flow,
    free_cash_flow_growth,
    unclassified_cashflow
FROM ind_fin_data_cashflow
WHERE stock_ticker = $1;`

const { rows: rows4 } = await pool.query(cashFlowQuery, [stock]);

const formattedRows3 = rows4.map(r => {
  const d = new Date(r.report_date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return {
    ...r,
    report_date: `${year}-${month}-${day}`
  };
});

const ratiosQuery = `SELECT
    id,
    stock_ticker,
    report_date::date AS report_date,
    market_capitalization,
    market_cap_growth,
    enterprise_value,
    pe_ratio,
    pb_ratio,
    debt_equity_ratio,
    interest_coverage,
    quick_ratio,
    current_ratio,
    asset_turnover,
    earnings_yield,
    fcf_yield,
    dividend_yield,
    payout_ratio,
    total_shareholder_return
FROM ind_fin_data_ratios
WHERE stock_ticker = $1;`;

const { rows: rows5 } = await pool.query(ratiosQuery, [stock]);

const formattedRows4 = rows5.map(r => {
  const d = new Date(r.report_date);
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
      chartData: formattedRows1,
      balanceChart: formattedRows2,
      cashFlowData: formattedRows3,
      ratiosData: formattedRows4
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