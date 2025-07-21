// const { supabase } = require('../../lib/supabase'); // Ensure your supabase client is correctly initialized

// exports.getBulkData = async (req, res) => {
//     const { date } = req.query; // 'date' query parameter is expected as YYYY-MM-DD string

//     if (!date) {
//         return res.status(400).json({ error: 'Missing date query parameter' });
//     }

//     let startDate;
//     try {
//         startDate = new Date(date);
//         // Validate if the date is actually valid (e.g., prevents "Invalid Date" errors)
//         if (isNaN(startDate.getTime())) {
//             throw new Error("Invalid date format");
//         }
//     } catch (e) {
//         return res.status(400).json({ error: 'Invalid date format for query parameter.' });
//     }

//     const endDate = new Date(startDate);
//     endDate.setDate(endDate.getDate() + 4); // Get data for 'date' and the next 4 days

//     // Helper to format Date objects to YYYY-MM-DD string for database comparison
//     const formatDateToYYYYMMDD = (d) => {
//         const year = d.getFullYear();
//         const month = String(d.getMonth() + 1).padStart(2, '0');
//         const day = String(d.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     };

//     const fromDateString = formatDateToYYYYMMDD(startDate);
//     const toDateString = formatDateToYYYYMMDD(endDate);

//     console.log(`Fetching bulk data from ${fromDateString} to ${toDateString}`);

//     // Fetching from 'market_statistics' and joining 'options_chain_data'
//     // Ensure all columns from market_statistics are selected for 'meta'
//     // And relevant columns from options_chain_data for 'chain'
//     const { data, error } = await supabase
//         .from('market_statistics') // Querying the main statistics table
//         .select(`
//             capture_date,
//             capture_time,
//             expiry,
//             expiry_value,
//             day_open_value,
//             day_open_change_info,
//             spot_value,
//             spot_change_info,
//             fut_value,
//             atm_iv_value,
//             pcr_value,
//             max_pain_value,
//             options_chain_data(
//                 strike,
//                 call_ltp,
//                 put_ltp,
//                 call_gamma,
//                 call_vega,
//                 call_theta,
//                 call_delta,
//                 call_oi,
//                 call_iv,
//                 pcr,
//                 put_ltp,
//                 put_oi,
//                 put_delta,
//                 put_theta,
//                 put_vega,
//                 put_gamma
//             )
//         `)
//         .gte('capture_date', fromDateString)
//         .lte('capture_date', toDateString)
//         .order('capture_date', { ascending: true }) // Order by date first
//         .order('capture_time', { ascending: true }) // Then by time
//         .order('expiry_value', { ascending: true }); // Then by expiry to group related data

//     if (error) {
//         console.error('[supabase]', error);
//         return res.status(error.status || 500).json({ error: error.message });
//     }

//     // Structure the data as per client-side expectation
//     const structuredData = {};

//     for (const row of data) {
//         const tradeDate = row.capture_date;     // e.g., "2025-05-02"
//         const snapshotTime = row.capture_time;   // e.g., "09:16:00"
//         const expiryDate = row.expiry_value;     // e.g., "2025-09-25" (DATE type from DB)

//         // Ensure nested structure: tradeDate -> snapshotTime -> expiryDate
//         if (!structuredData[tradeDate]) structuredData[tradeDate] = {};
//         if (!structuredData[tradeDate][snapshotTime]) structuredData[tradeDate][snapshotTime] = {};

//         // Assign the data for this specific snapshot (time + expiry)
//         structuredData[tradeDate][snapshotTime][expiryDate] = {
//             meta: {
//                 dayOpen: row.day_open_value,
//                 dayOpenChangeInfo: row.day_open_change_info,
//                 spot: row.spot_value,
//                 spotChangeInfo: row.spot_change_info,
//                 futPrice: row.fut_value, // Renamed from fut_price for consistency
//                 atmIv: row.atm_iv_value, // Renamed from atm_iv
//                 pcr: row.pcr_value,      // Market PCR
//                 maxPain: row.max_pain_value
//             },
//             // Map the options_chain_data into the expected 'chain' format
//             chain: (row.options_chain_data || []).map(opt => ({
//                 strike: opt.strike,
//                 call_ltp: opt.call_ltp,
//                 call_gamma: opt.call_gamma,
//                 call_vega: opt.call_vega,
//                 call_theta: opt.call_theta,
//                 call_delta: opt.call_delta,
//                 call_oi: opt.call_oi,
//                 call_iv: opt.call_iv,
//                 pcr: opt.pcr, // Strike-level PCR
//                 put_ltp: opt.put_ltp,
//                 put_oi: opt.put_oi,
//                 put_delta: opt.put_delta,
//                 put_theta: opt.put_theta,
//                 put_vega: opt.put_vega,
//                 put_gamma: opt.put_gamma
//             }))
//         };
//     }

//     res.json(structuredData);
// };

const { supabase } = require('../../lib/supabase');

exports.getBulkData = async (req, res) => {
     const { date } = req.query;
    const today = date
    const next4Days = new Date(today);
    next4Days.setDate(next4Days.getDate() + 4);

    const formatDate= (date) => {
         const year = date.getFullYear();
         const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
         return `${year}-${month}-${day}`;
     };

    const fromDate = date
    const toDate = formatDate(next4Days)

    const { data, error } = await supabase
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
        .gte('trade_date', fromDate)
        .lte('trade_date', toDate);

    if (error) {
        console.error('[supabase]', error);
        return res.status(error.status || 500).json({ error });
    }
    

    const structured = {};

    for (const row of data) {
        const tradeDate = row.trade_date;
        const time = row.snapshot_time;
        const expiry = row.expiry_date;

        if (!structured[tradeDate]) structured[tradeDate] = {};
        if (!structured[tradeDate][time]) structured[tradeDate][time] = {};

        structured[tradeDate][time][expiry] = {
            meta: {
                dayOpen: row.d,
                spot: row.spot,
                atm_iv: row.gpt,
                fut_price: row.fut_price
            },
            chain: (row.option_chain || []).map(opt => ({
                strike: opt.strike,
                call_ltp: opt.call_ltp,
                put_ltp: opt.put_ltp
            }))
        };
    }

    res.json(structured);
};