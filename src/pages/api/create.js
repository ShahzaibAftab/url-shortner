import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { originalUrl } = req.body;
            const id = nanoid(8);

            // Insert data into the database
            const { error } = await supabase
                .from('urls')
                .insert([{ id, original_url: originalUrl }]);

            if (error) {
                console.error('Supabase error:', error.message);
                res.status(500).json({ error: 'Failed to create short URL' });
                return;
            }

            // Fetch the inserted data
            const { data: insertedData, fetchError } = await supabase
                .from('urls')
                .select()
                .eq('id', id)
                .single();

            if (fetchError) {
                console.error('Supabase fetch error:', fetchError.message);
                res.status(500).json({ error: 'Failed to fetch inserted data' });
                return;
            }

            // Construct short URL
            const shortUrl = `${req.headers.host}/${insertedData.id}`;
            res.status(200).json({ shortUrl });
        } catch (err) {
            console.error('Database operation error:', err.message);
            res.status(500).json({ error: 'Failed to create short URL' });
        }
    } else {
        res.status(405).json({ error: 'Method not Allowed' });
    }
}

