const { supabase } = require('../../lib/supabase');

exports.getTimes = async (req, res) => {
    const { date } = req.body;
    if (!date) return res.status(400).json({ error: 'date required' });

    const { data, error } = await supabase
        .from('snapshots')
        .select('snapshot_time')
        .eq('trade_date', date)
        .order('snapshot_time');

    if (error) return res.status(500).json({ error });

    const uniqueTimes = [...new Set(data.map(r => r.snapshot_time))];
    res.json({ data: uniqueTimes });
};
