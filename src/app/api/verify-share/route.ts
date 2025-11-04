import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { shareId, password } = await request.json()

        if (!shareId || !password) {
            return NextResponse.json(
                { message: "공유ID와 패스워드가 필요합니다." },
                { status: 400 }
            )
        }

        const { data: sharedLink, error: findError } = await supabase
            .from("shared_links")
            .select("*")
            .eq("id", shareId)
            .single()

        if (findError || !sharedLink) {
            return NextResponse.json(
                { message: "유효하지 않은 링크입니다." },
                { status: 404 }
            )
        }
        if (sharedLink.isUsed) {
            return NextResponse.json(
                { message: "이미 사용된 링크입니다." },
                { status: 410 }
            )
        }
        if (sharedLink.one_time_password !== password) {
            return NextResponse.json(
                { message: "패스워드가 일치하지 않습니다." },
                { status: 401 }
            )
        }
        const { error: updateError } = await supabase
            .from("shared_link")
            .update({ is_used: true })
            .eq("id", shareId)

        if (updateError) {
            throw new Error("링크 상태 업데이트에 실패했어요..")
        }

        const { data: memory, error: memoryError } = await supabase
            .from("memories")
            .select("*")
            .eq("id", sharedLink.memory_id)
            .single()

        if (memoryError || !memory) {
            return NextResponse.json(
                { message: "공유된 기억을 찾을 수 없습니다." },
                { status: 404 }
            )
        }
        return NextResponse.json({
            id: memory.id,
            title: memory.title,
            content: memory.content,
            imageUrl: memory.image_url,
            createdAt: memory.created_at,
        })
    } catch (e) {
        return NextResponse.json(
            { message: "서버 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}
