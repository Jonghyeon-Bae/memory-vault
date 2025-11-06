import { NextResponse } from "next/server"

export function GET() {
    const envVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not Set',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
        NEXT_PUBLIC_SUPABASE_SERVICE_KEY: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY ? 'Set' : 'Not Set',
    }

    return NextResponse.json(envVars)
}
