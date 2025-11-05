"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function NewMemoryPage() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            alert('사진을 선택해주세요.')
            return
        }
        setIsUploading(true)

        try {
            const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`,
                {
                    method: 'POST',
                    body: file,
                }
            )
            if (!response.ok) {
                throw new Error('파일 업로드 실패!')
            }
            const newBlob = await response.json();
            const imageUrl = newBlob.url

            const { data, error } = await supabase
                .from('memories')
                .insert([
                    { title, content, image_url: imageUrl }
                ])
                .select()

            if (error) {
                throw new Error('기억 저장에 실패했어요. : ' + error.message)
            }
            alert('새 기억이 저장되었어요.')

            setTitle('')
            setContent('')
            setFile(null)

            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }

            router.push('/')
        } catch (e) {
            console.log(e)
            alert("기억 저장에 실패했어요!")
        } finally {
            setIsUploading(false)
        }
    }
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4 sm:p-8">
            <button onClick={() => router.back()} className="absolute top-4 left-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-300" aria-label="뒤로가기"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>

            </button>
            <h1 className="text-4xl font-bold mb-8"> 새 기억 추가 </h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">기억의 제목</label>
                    <input type="text" id="title" className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex) 첫 기록"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required />
                </div>
                <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">기억의 내용</label>
                    <textarea
                        id="content"
                        rows={6}
                        className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required></textarea>
                </div>
                <div className="mb-6">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">이미지</label>
                    <input type="file" id="image" ref={fileInputRef} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        required />

                    {file && (
                        <div className="mt-4">
                            <img src={URL.createObjectURL(file)} alt="미리보기" className="max-w-full h-auto rounded-md shadow-md" />
                        </div>
                    )}
                </div>
                <button type="submit"
                    className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md trasition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isUploading}>
                    {isUploading ? '업로드중....' : '기억 보관하기'}
                </button>
            </form>
        </main>
    )
}