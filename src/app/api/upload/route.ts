import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename || !request.body) {
        return NextResponse.json(
            { message: "파일이름이 없거나 전송되지 않았습니다." },
            { status: 400 }
        )
    }
    try {
        const blob = await put(filename, request.body, {
            access: "public",
            addRandomSuffix: true,
        })
        return NextResponse.json(blob)
    } catch (e) {
        console.error("Vercel Blob 업로드 오류 : ", e)
        return NextResponse.json(
            { message: "파일 업로드 중 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}
