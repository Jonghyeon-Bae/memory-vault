// src/app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link'; // Link 컴포넌트 임포트
import { Memory } from '@/types';
import { supabase } from '@/lib/supabase';

const bookColors = [
  'bg-blue-700', 'bg-green-700', 'bg-red-700', 'bg-yellow-700', 'bg-indigo-700',
  'bg-purple-700', 'bg-pink-700', 'bg-teal-700',
];

export default function HomePage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sharedInfo, setSharedInfo] = useState<{ id: string, password: string } | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('기억을 가져오는중 오류가 발생했어요.')
        setMemories([])
      } else {
        const formattedMemories: Memory[] = data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          imageUrl: item.image_url,
          createdAt: item.created_at
        }))
        setMemories(formattedMemories)
      }
      setLoading(false)
    }
    fetchMemories()
  }, [])
  const selectedMemory = selectedId ? memories.find(memory => memory.id === selectedId) : null
  const handleShare = async (memoryId: string) => {
    setIsSharing(true)
    setSharedInfo(null)

    try {
      const response = await fetch(`/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify({ memoryId })
      })
      if (!response.ok) throw new Error('공유링크 생성 실패!')
      const data = await response.json()
      setSharedInfo({ id: data.id, password: data.oneTimePassword })
    } catch (e) {
      console.error(e)
      alert("공유링크 생성 실패!")
    } finally {
      setIsSharing(false)
    }
  }
  const handleCloseDetail = () => {
    setSelectedId(null)
    setSharedInfo(null)
  }
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white p-4 sm:p-8
      overflow-hidden">
      <h1 className="text-4xl sm:text-5xl font-extrabold my-8 sm:my-12 text-center tracking-tight">
        나의 기억 보관함
      </h1>

      {/* 새 기억 추가 버튼 */}
      <Link href="/new" passHref>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg
      shadow-lg transition-colors duration-300"
        >
          새 기억 추가
        </motion.button>
      </Link>


      {loading ? (
        <p className='text-lg text-gray-400'>기억들을 불러오고 있어요...</p>
      ) : memories.length === 0 ? (
        <p className='text-lg text-gray-400'>아직 보관된 기억이 없어요! 새로운 기억을 추가해보세요!</p>
      ) : (
        <div className='relative w-full max-w-6xl p-4'>
          <div className='flex items-end justify-center gap-4 h-80 border-b-8 border-yellow-900 bg-gray-800/30 rounded-t-lg p-4'>
            {memories.map((memory: Memory, index: number) => (
              <motion.div
                key={memory.id}
                layoutId={`book-${memory.id}`}
                onClick={() => setSelectedId(memory.id)}
                className={`relative w-12 h-64 rounded-t-md shadow-lg cursor-pointer group transform transition-all duration-300 origin-bottom hover:-translate-y-2 hover:scale-105 ${bookColors[index % bookColors.length]}`}>
                <div className='absolute inset-0 flex items-center justify-center p-1'>
                  <h2 className="text-white font-semibold text-sm [writing-mode:vertical-rl]
       transform rotate-180 whitespace-nowrap overflow-hidden text-ellipsis opacity-0 group-hover:opacity-100
       transition-opacity duration-300">
                    {memory.title}
                  </h2>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/20
       via-transparent to-black/10 rounded-t-md"></div>
              </motion.div>
            ))}</div>
        </div>
      )}

      {/* 선택된 책을 보여주는 부분 (AnimatePresence 사용) */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            layoutId={`book-${selectedMemory.id}`}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4
      z-50"
            onClick={() => setSelectedId(null)}
          >
            <div
              className="relative w-full max-w-3xl h-auto max-h-[90vh] bg-white rounded-lg shadow-2xl
      flex flex-col md:flex-row overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 이미지 영역 */}
              <div className="w-full md:w-1/2 h-64 md:h-auto">
                <img src={selectedMemory.imageUrl} alt={selectedMemory.title} className="w-full h-full
      object-cover" />
              </div>
              {/* 텍스트 콘텐츠 영역 */}
              <div className="w-full md:w-1/2 p-6 overflow-y-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedMemory.title}</h2>
                <p className="text-sm text-gray-500 mb-6">{new Date(selectedMemory.createdAt).
                  toLocaleDateString('ko-KR')} 에 남긴 기억</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMemory.
                  content}</p>

                <div className='mt-6 pt-4 border-t'>
                  <button onClick={() => handleShare(selectedMemory.id)} disabled={isSharing} className='w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-300 disabled:bg-gray-400'>
                    {isSharing ? '생성중입니다...' : '이 기억 공유하기'}
                  </button>
                  {sharedInfo && (
                    <div className='mt-4 p-3 bg-gray-100 rounded-md text-sm text-gray-800'>
                      <p className='font-semibold'>공유 링크가 생성되었습니다. : </p>
                      <input type="text" readOnly value={`${window.location.origin}/share/${sharedInfo.id}`} className='w-full p-2 mt-2 bg-white border rounded-md' />
                      <p className='mt-2 font-semibold'>1회용 패스워드 : </p>
                      <input type="text" readOnly value={sharedInfo.password} className='w-full p-2 mt-2 bg-white border rounded-md' />
                    </div>
                  )}
                </div>
              </div>
              {/* 닫기 버튼 */}
              <button onClick={handleCloseDetail} className="absolute top-4 right-4
      text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
