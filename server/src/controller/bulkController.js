
const { supabase } = require('../../lib/supabase'); 
const { redisClient, connectRedis } = require('../../lib/redisClient'); 


const CACHE_TTL_SECONDS = 60 * 60;

exports.getBulkData = async (req, res) => {
    try {
        await connectRedis();
    } catch (error) {
        console.error('Failed to establish Redis connection in handler:', error);
    }

    const { date } = req.query; 

   
    if (!date) {
        return res.status(400).json({ error: 'Missing date query parameter. Please provide date in YYYY-MM-DD format.' });
    }


    let queryDate;
    try {
        queryDate = new Date(date);
        if (isNaN(queryDate.getTime())) {
            throw new Error("Invalid date format");
        }
    } catch (e) {
        return res.status(400).json({ error: 'Invalid date format for query parameter. Expected YYYY-MM-DD.' });
    }

    const next4Days = new Date(queryDate);
    next4Days.setDate(next4Days.getDate() + 4);

    const formatDate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); 
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fromDateString = date; 
    const toDateString = formatDate(next4Days); 

    console.log(`API Request for data from ${fromDateString} to ${toDateString}`);

    const cacheKey = `bulk_options_data:${fromDateString}_to_${toDateString}`;

    let structuredData = null;


    if (redisClient.isOpen) {
        try {
            console.log(`Checking Redis cache for key: ${cacheKey}`);
            const cachedDataString = await redisClient.get(cacheKey);

            if (cachedDataString) {
                structuredData = JSON.parse(cachedDataString);
                console.log('Data found in Redis cache. Returning instantly!');
                return res.json(structuredData);
            } else {
                console.log('Data not found in Redis cache. Proceeding to fetch from Supabase...');
            }
        } catch (redisErr) {
            console.error(`Error fetching from Redis for key ${cacheKey}:`, redisErr);
        }
    } else {
        console.warn('Redis client not connected. Skipping cache check and fetching directly from Supabase.');
    }


    console.log(`Fetching data from Supabase for range ${fromDateString} to ${toDateString}`);
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
        .gte('trade_date', fromDateString) 
        .lte('trade_date', toDateString)   
        .order('trade_date', { ascending: true })  
        .order('snapshot_time', { ascending: true }) 
        .order('expiry_date', { ascending: true }); 

    
    if (supabaseError) {
        console.error('[Supabase Error]:', supabaseError);
        return res.status(supabaseError.status || 500).json({ error: supabaseError.message });
    }

    const newStructuredData = {};

    for (const row of supabaseData) {
        const tradeDate = row.trade_date;       
        const snapshotTime = row.snapshot_time;   
        const expiryDate = row.expiry_date;     

       
        if (!newStructuredData[tradeDate]) newStructuredData[tradeDate] = {};
        if (!newStructuredData[tradeDate][snapshotTime]) newStructuredData[tradeDate][snapshotTime] = {};

        
        newStructuredData[tradeDate][snapshotTime][expiryDate] = {
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

    
    if (redisClient.isOpen) {
        try {
            const jsonToCache = JSON.stringify(newStructuredData); 
           
            await redisClient.setEx(cacheKey, CACHE_TTL_SECONDS, jsonToCache);
            console.log(`Data successfully stored in Redis for key: ${cacheKey} with TTL: ${CACHE_TTL_SECONDS}s`);
        } catch (redisErr) {
            console.error(`Error storing data to Redis for key ${cacheKey}:`, redisErr);
           
        }
    }

    res.json(newStructuredData);
};