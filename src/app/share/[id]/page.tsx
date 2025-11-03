"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Memory } from '@/types';

export default function SharePage() {
    const params = useParams()
    const shareId = params.id as string
    const [password, setPassword] = useState('');
    const [memory, setMemory] = useState<Memory | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/verify-share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shareId: shareId, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || '인증에 실패했습니다.');
            }

            setMemory(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 기억이 성공적으로 로드된 경우
    if (memory) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 sm:p-8">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
                    <img src={memory.imageUrl} alt={memory.title} className="w-full h-64 object-cover" />
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{memory.title}</h1>
                        <p className="text-sm text-gray-500 mb-4">{new Date(memory.createdAt).toLocaleDateString(
                            'ko-KR')} 에 남겨진 기억</p>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{memory.content}</p>
                    </div>
                </div>
            </main>
        );
    }

    // 비밀번호 입력 폼
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4
      sm:p-8">
            <h1 className="text-3xl font-bold mb-4">비밀번호 입력</h1>
            <p className="text-gray-400 mb-8">이 기억을 보려면 1회용 비밀번호를 입력하세요.</p>
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg">
                <input
                    type="password"
                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white
      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="6자리 비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="mt-4 text-red-400">{error}</p>}
                <button
                    type="submit"
                    className="w-full mt-6 p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md
      transition-colors duration-300 disabled:bg-gray-500"
                    disabled={isLoading}
                >
                    {isLoading ? '확인 중...' : '기억 열기'}
                </button>
            </form>
        </main>
    );
}