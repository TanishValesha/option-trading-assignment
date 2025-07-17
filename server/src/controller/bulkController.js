// const { supabase } = require('../../lib/supabase');


// exports.getBulkData = async (req, res) => {
//     const { date } = req.query;
//     if (!date)
//         res.status(400).json({ error: 'date' });

//     const today = date
//     const next4Days = new Date(date);
//     console.log(next4Days.getDate())
//     next4Days.setDate(next4Days.getDate() + 4);

//     const formatDate= (date) => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     };

//     console.log("Start date", today);
//     console.log("End date", formatDate(next4Days));

    

//     const { data, error } = await supabase
//         .from('snapshots')
//         .select(`
//       trade_date,
//       snapshot_time,
//       expiry_date,
//       d,
//       gpt,
//       gpr,
//       spot,
//       fut_price,
//       option_chain(strike, call_ltp, put_ltp)
//     `)
//         .gte('trade_date', today)
//         .lte('trade_date', formatDate(next4Days))
//         .order('trade_date', {ascending: true})

//     if (error) {
//         console.error('[supabase]', error);
//         res.status(error.status || 500).json({ error });
//     }

//     const structured = {};

//     for (const row of data) {
//         const tradeDate = row.trade_date;
//         if (!structured[tradeDate]) {
//             structured[tradeDate] = [];
//         }

//         structured[tradeDate].push({
//             time: row.snapshot_time,
//             expiry: row.expiry_date,
//             meta: {
//                 dayOpen: row.d,
//                 spot: row.spot,
//                 atm_iv: row.gpt,
//                 fut_price: row.fut_price
//             },
//             chain: (row.option_chain || []).map(opt => ({
//                 strike: opt.strike,
//                 call_ltp: opt.call_ltp,
//                 put_ltp: opt.put_ltp
//             }))
//         });
        
//     }

//     res.json(structured);
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
