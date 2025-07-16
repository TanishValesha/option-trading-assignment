const { supabase } = require('../../lib/supabase');

exports.getExpiryDates = async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date Required!' });

    const { data, error } = await supabase
        .from('snapshots')
        .select('expiry_date')
        .eq('trade_date', date)
        .order('expiry_date');

    if (error) return res.status(500).json({ error });

    const uniqueDates = [...new Set(data.map(r => r.expiry_date))];
    res.json({ data: uniqueDates });
};
