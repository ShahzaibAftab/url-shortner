import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

function getValidURL(url) {
    if (url.includes('http://') || url.includes('https://')) {
        return url
    }
    return 'https://' + url
}

export default async function handler(req) {
    if (req.method === "GET") {
        let pathname = req.nextUrl.pathname
        let parts = pathname.split('/')
        let id = parts[parts.length - 1]
        try {
            const { data, error } = await supabase
                .from("url")
                .select("original_url")
                .eq("id", id)
                .single();
            if (!error) {
                const shortUrl = data.original_url;
                console.log('Shorten url', shortUrl)
                return NextResponse.redirect(getValidURL(shortUrl))
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}