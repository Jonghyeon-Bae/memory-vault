import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    throw new Error(
        "Supabase URL, Anon Key, 또는 Service Key 환경 변수가 설정되지 않았어요."
    )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// service_role 키가 클라이언트에 노출되는 것을 막기 위한 방어 코드
if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin은 클라이언트 측에서 사용할 수 없습니다.")
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})
