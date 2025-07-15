const { supabase } = require('../../lib/supabase');

// exports.getOptionChains = async (req, res) => {
//   const { date, time, expiry } = req.body;
//   if (!date || !time || !expiry)
//     return res.status(400).json({ error: 'date, time, expiry required' });

//   const { data, error } = await supabase
//     .from('snapshots')
//     .select('d, gpt, gpr, spot, fut_price, option_chain(strike, call_ltp, put_ltp,)')
//     .eq('trade_date', date)
//     .eq('snapshot_time', time)
//     .eq('expiry_date', expiry)
//     .single()

//   if (error) return res.status(500).json({ error });


// //   const chain = data.option_chain.map(r => ({
// //     strike: r.strike,
// //     call: { ltp: r.call_ltp },
// //     put:  { ltp: r.put_ltp }
// //   }))

//   res.json({
//     data
//   });
// };

exports.getOptionChains = async (req, res) => {
    const { date, time, expiry } = req.body;
    if (!date || !time || !expiry)
        return res.status(400).json({ error: 'date, time, expiry required' });

    const { data, error } = await supabase
        .from('snapshots')
        .select(`
      d, gpt, gpr, spot, fut_price,
      option_chain(strike, call_ltp, put_ltp)
    `)
        .eq('trade_date', date)
        .eq('snapshot_time', time)
        .eq('expiry_date', expiry)
        .single();                       

    if (error) return res.status(500).json({ error });

    const chain = data.option_chain.map(r => ({
        strike: r.strike,
        call_ltp: r.call_ltp,
        put_ltp: r.put_ltp
    }))

    res.json({
        meta: {
            dayOpen: data.d,
            spot: data.spot,
            atm_iv: data.gpt,
            fut_price: data.fut_price,
        },
        chain
    });
};

