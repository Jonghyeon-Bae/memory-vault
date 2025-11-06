// src/app/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { Memory } from '@/types';
import Book from '@/compoments/Book';

const bookColors = [
  '#4a2c2a', '#0f4c5c', '#5c2751', '#283618', '#6f1d1b', '#03045e', '#582f0e',
];

export default function HomePage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shareInfo, setShareInfo] = useState<{ id: string; password: string } | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const calculateBooksPerPage = () => {
      if (window.innerWidth < 640) return 3;
      if (window.innerWidth < 768) return 4;
      if (window.innerWidth < 1024) return 5;
      if (window.innerWidth < 1280) return 6;
      return 7;
    };
    const updateBpp = () => setBooksPerPage(calculateBooksPerPage());
    updateBpp();
    window.addEventListener('resize', updateBpp);
    return () => window.removeEventListener('resize', updateBpp);
  }, []);

  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('memories').select('*').order('created_at', {
        ascending: false
      });
      if (error) {
        console.error('기억을 가져오는 중 오류 발생:', error);
        setMemories([]);
      } else {
        const formattedMemories: Memory[] = data.map(item => ({
          id: item.id, title: item.title, content: item.content,
          imageUrl: item.image_url, createdAt: item.created_at,
        }));
        setMemories(formattedMemories);
      }
      setLoading(false);
    };
    fetchMemories();
  }, []);

  const displayedMemories = useMemo(() => {
    const startIndex = currentPage * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return memories.slice(startIndex, endIndex);
  }, [memories, currentPage, booksPerPage]);

  const totalPages = Math.ceil(memories.length / booksPerPage);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));

  const selectedMemory = selectedId ? memories.find(m => m.id === selectedId) : null;

  const handleShare = async (memoryId: string) => {
    setIsSharing(true);
    setShareInfo(null);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId }),
      });
      if (!response.ok) throw new Error('공유 링크 생성 실패');
      const data = await response.json();
      setShareInfo({ id: data.id, password: data.oneTimePassword });
    } catch (error: any) {
      console.error(error);
      alert('공유 링크 생성에 실패했습니다.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedId(null);
    setShareInfo(null);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (e) {
      alert('클립보드 복사에 실패했어요..')
    }
  }

  return (
    <main className="dream-background flex min-h-screen flex-col items-center text-white p-4 sm:p-8 overflow-hidden">
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl font-normal my-8 sm:my-12 text-center tracking-wider"
        style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.4), 0 0 12px rgba(180, 180, 255, 0.3)' }}
      >
        나의 기억 보관함
      </h1>

      <Link href="/new" passHref>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mb-8 px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shadow-lg transition-colors duration-300">
          새 기억 추가
        </motion.button>
      </Link>

      {loading ? (
        <p className="text-lg">기억들을 불러오는 중...</p>
      ) : memories.length === 0 ? (
        <p className="text-lg">아직 보관된 기억이 없습니다. 새로운 기억을 추가해 보세요!</p>
      ) : (
        <div className="w-full max-w-7xl flex items-center justify-center gap-4">
          <motion.button onClick={handlePrev} disabled={currentPage === 0} className="p-2 rounded-full bg-black/20 hover:bg-black/40 disabled:opacity-30 disabled:cursor-not-allowed" whileTap={{
            scale: 0.9
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </motion.button>

          <div className="relative w-full p-4 overflow-hidden">
            <div className="flex items-end justify-center gap-4 h-72 sm:h-80 border-b-[16px] border-t-[16px] border-[#4a2c2a] bg-black/30 rounded-lg p-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)]">
              <AnimatePresence mode="popLayout">
                {displayedMemories.map((memory) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <Book
                      memory={memory}
                      color={bookColors[memories.indexOf(memory) % bookColors.length]}
                      onSelect={setSelectedId}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <motion.button onClick={handleNext} disabled={currentPage >= totalPages - 1} className="p-2 rounded-full bg-black/20 hover:bg-black/40 disabled:opacity-30 disabled:cursor-not-allowed" whileTap={{
            scale: 0.9
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24
 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7
 7-7 7" /></svg>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {selectedMemory && (
          <motion.div layoutId={`book-${selectedMemory.id}`} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={handleCloseDetail}>
            <div className="relative w-full max-w-3xl h-auto max-h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="w-full md:w-1/2 h-56 sm:h-64 md:h-auto"><img src={selectedMemory.imageUrl} alt={selectedMemory.title} className="w-full h-full object-cover" /></div>
              <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{selectedMemory.title}</h2>
                <p className="text-sm text-gray-500 mb-6">{new Date(selectedMemory.createdAt).
                  toLocaleDateString('ko-KR')} 에 남겨진 기억</p>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap flex-grow">{selectedMemory.content}</p>
                <div className="mt-6 pt-4 border-t">
                  <button onClick={() => handleShare(selectedMemory.id)} disabled={isSharing}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-300 disabled:bg-gray-400">
                    {isSharing ? '생성 중...' : '이 기억 공유하기'}
                  </button>
                  {shareInfo && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm text-gray-800">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">공유 링크가 생성되었습니다:</p>
                        {copied && <span className="text-green-600 font-semibold">복사 완료!</span>}
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/share/${shareInfo.id}`}
                        className="w-full p-2 mt-2 bg-white border rounded-md cursor-pointer hover:bg-gray-50"
                        onClick={(e) => handleCopy(e.currentTarget.value)}
                      />
                      <p className="mt-2 font-semibold">1회용 비밀번호:</p>
                      <input
                        type="text"
                        readOnly
                        value={shareInfo.password}
                        className="w-full p-2 mt-2 bg-white border rounded-md cursor-pointer hover:bg-gray-50"
                        onClick={(e) => handleCopy(e.currentTarget.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <button onClick={handleCloseDetail} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}