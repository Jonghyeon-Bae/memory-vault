import { NextResponse } from "next/server"
import { mockSharedLinks } from "@/lib/shared-links"
import { mockMemories } from "@/lib/memories"

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { shareId, password } = await request.json()

        if (!shareId || !password) {
            return NextResponse.json(
                { message: "공유ID와 패스워드가 필요합니다." },
                { status: 400 }
            )
        }
        const SharedLink = mockSharedLinks.find((link) => link.id === shareId)

        if (!SharedLink) {
            return NextResponse.json(
                { message: "유효하지 않은 링크입니다." },
                { status: 404 }
            )
        }
        if (SharedLink.isUsed) {
            return NextResponse.json(
                { message: "이미 사용된 링크입니다." },
                { status: 410 }
            )
        }
        if (SharedLink.oneTimePassword !== password) {
            return NextResponse.json(
                { message: "패스워드가 일치하지 않습니다." },
                { status: 401 }
            )
        }

        SharedLink.isUsed = true
        const memory = mockMemories.find(
            (memory) => memory.id === SharedLink.memoryId
        )

        if (!memory) {
            return NextResponse.json(
                { message: "공유된 기억을 찾을 수 없습니다." },
                { status: 404 }
            )
        }
        return NextResponse.json(memory)
    } catch (e) {
        console.error("공유 검증 오류입니다 : ", e)
        return NextResponse.json(
            { message: "서버 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}
