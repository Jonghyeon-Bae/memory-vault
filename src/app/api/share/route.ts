import { NextResponse } from "next/server"
import { mockSharedLinks } from "@/lib/shared-links"
import { SharedLink } from "@/types"

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { memoryId } = await request.json()

        if (!memoryId) {
            return NextResponse.json(
                { message: "memoryId가 필요합니다." },
                { status: 400 }
            )
        }

        const shareId = crypto.randomUUID()
        const oneTimePassword = Math.floor(
            100000 + Math.random() * 900000
        ).toString()

        const newSharedLink: SharedLink = {
            id: shareId,
            memoryId,
            oneTimePassword,
            isUsed: false,
            createdAt: new Date().toISOString(),
        }

        mockSharedLinks.push(newSharedLink)
        console.log("새 공유 링크가 생성되었어요. : ", newSharedLink)
        console.log("현재 모든 공유 링크에요. : ", mockSharedLinks)

        return NextResponse.json({
            id: newSharedLink.id,
            oneTimePassword: newSharedLink.oneTimePassword,
        })
    } catch (e) {
        console.log("공유링크 생성 오류! : ", e)
        return NextResponse.json(
            { message: "서버오류가 발생했어요." },
            { status: 500 }
        )
    }
}
