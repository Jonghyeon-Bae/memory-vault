import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY

if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin cannot be used on the client-side.")
}

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL and Service Key are required for admin client.")
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})
