const { supabase } = require('./supabase');
const { redisClient, connectRedis } = require('./redisClient');

const CACHE_TTL_SECONDS = 60 * 60; // 1 hour TTL, same as API

// Helper to add days to YYYY-MM-DD string
function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

// Format date for key and querying
function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function preloadBulkDataToRedis(startDate, endDate, chunkSizeDays = 5) {
  try {
    await connectRedis();

    let currentStart = startDate;

    while (currentStart <= endDate) {
      let currentEnd = addDays(currentStart, chunkSizeDays - 1);
      if (currentEnd > endDate) currentEnd = endDate;

      console.log(`Caching data from ${currentStart} to ${currentEnd}`);

      // Fetch from supabase with same select and ordering as your API
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('snapshots')
        .select(`
          trade_date,
          snapshot_time,
          expiry_date,
          d,
          gpt,
          gpr,
          spot,
          fut_price,
          option_chain(strike, call_ltp, put_ltp)
        `)
        .gte('trade_date', currentStart)
        .lte('trade_date', currentEnd)
        .order('trade_date', { ascending: true })
        .order('snapshot_time', { ascending: true })
        .order('expiry_date', { ascending: true });

      if (supabaseError) {
        console.error(`Supabase error for range ${currentStart} to ${currentEnd}:`, supabaseError);
        break;
      }

      // Structure data same as your API
      const structuredData = {};

      for (const row of supabaseData) {
        const tradeDate = row.trade_date;
        const snapshotTime = row.snapshot_time;
        const expiryDate = row.expiry_date;

        if (!structuredData[tradeDate]) structuredData[tradeDate] = {};
        if (!structuredData[tradeDate][snapshotTime]) structuredData[tradeDate][snapshotTime] = {};

        structuredData[tradeDate][snapshotTime][expiryDate] = {
          meta: {
            dayOpen: row.d,
            spot: row.spot,
            atm_iv: row.gpt,
            fut_price: row.fut_price,
          },
          chain: (row.option_chain || []).map(opt => ({
            strike: opt.strike,
            call_ltp: opt.call_ltp,
            put_ltp: opt.put_ltp,
          })),
        };
      }

      const cacheKey = `bulk_options_data:${currentStart}_to_${currentEnd}`;
      try {
        await redisClient.setEx(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(structuredData));
        console.log(`Cached data in Redis key: ${cacheKey} with TTL ${CACHE_TTL_SECONDS}s`);
      } catch (redisErr) {
        console.error(`Redis setEx error for key ${cacheKey}:`, redisErr);
      }

      currentStart = addDays(currentEnd, 1);
    }
  } catch (err) {
    console.error('Failed to connect to Redis or other error:', err);
  } finally {
    redisClient.disconnect();
  }
}

// Customize your date range here
const START_DATE = '2021-01-01';
const END_DATE = '2021-01-31';

preloadBulkDataToRedis(START_DATE, END_DATE);
