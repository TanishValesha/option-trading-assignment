export const seoConfig = {
  stockScreener: {
    title: "Stocknomic",
    description: "Discover your next big investment with our advanced stock screener. Scan 20+ Indian market indexes with custom filters, technical charts, and dive deep into the fundamental analysis of any stock. Find opportunities faster.",
    keywords: "stock screener india, live stock screener, nse screener, bse screener, fundamental analysis tool india, stock scanner, intraday stock screener, swing trading stocks, stock charts, financial ratios",
    canonical: "/stock-screener"
  },
  optionTrading: {
    title: "Optionomic",
    description: "Test your Nifty and Bank Nifty option strategies risk-free. Our powerful backtesting tool uses years of historical NSE data to provide detailed P&L reports, payoff charts, and performance metrics. Optimize your trades today!",
    keywords: "nifty option backtesting, bank nifty backtesting, options strategy tester india, nse options, historical option data, option strategy builder, payoff chart calculator, options trading tool, nifty options, bank nifty options",
    canonical: "/option-trading"
  },
  home: {
    title: "Wealthnomic",
    description: "Empower your trading with Wealthnomic. Utilize our powerful Indian stock screener to find winning stocks and backtest your Nifty & Bank Nifty option strategies on historical data. Make data-driven decisions.",
    keywords: "stock screener india, nifty option backtesting, indian stock market analysis, trading tools, nse, bse, fundamental analysis, options strategy tester, wealthnomic, stock market india",
    canonical: "/"
  }
};

export type SEOPageKey = keyof typeof seoConfig;