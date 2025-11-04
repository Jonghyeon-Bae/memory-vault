import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { memoryId } = await request.json()

        if (!memoryId) {
            return NextResponse.json(
                { message: "memoryId가 필요합니다." },
                { status: 400 }
            )
        }

        const oneTimePassword = Math.floor(
            100000 + Math.random() * 900000
        ).toString()

        const { data, error } = await supabase
            .from("shared_links")
            .insert({
                memory_id: memoryId,
                one_time_password: oneTimePassword,
            })
            .select()
            .single()

        if (error) {
            throw new Error("공유 링크 생성에 실패했어요!")
        }

        return NextResponse.json({
            id: data.id,
            oneTimePassword: data.one_time_password,
        })
    } catch (e) {
        return NextResponse.json(
            { message: "서버오류가 발생했어요." },
            { status: 500 }
        )
    }
}
