// src/components/Book.tsx
"use client";

import { motion } from 'framer-motion';
import { Memory } from '@/types';

interface BookProps {
    memory: Memory;
    color: string;
    onSelect: (id: string) => void;
}

export default function Book({ memory, color, onSelect }: BookProps) {
    return (
        <motion.div
            layoutId={`book-${memory.id}`}
            onClick={() => onSelect(memory.id)}
            className="relative cursor-pointer group"
            style={{ perspective: '1000px' }}
        >
            <div
                className={`relative w-12 h-64 rounded-r-md shadow-lg transform transition-all duration-300
      origin-bottom group-hover:-translate-y-2 group-hover:scale-105`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* 책등 (Spine) */}
                <div className={`absolute inset-0 flex items-center justify-center p-1 rounded-r-md ${color}`
                }>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/20
      via-transparent to-black/10 rounded-r-md"></div>
                    <h2
                        className="text-white font-semibold text-sm [writing-mode:vertical-rl] transform
      rotate-180 whitespace-nowrap overflow-hidden text-ellipsis opacity-0 group-hover:opacity-100
      transition-opacity duration-300"
                    >
                        {memory.title}
                    </h2>
                </div>

                {/* 책 앞표지 (Front Cover Edge) */}
                <div
                    className={`absolute top-0 left-0 w-full h-full bg-black/30 rounded-r-md`}
                    style={{ transform: 'rotateY(90deg) translateZ(2.9rem)', width: '0.5rem' }}
                ></div>

                {/* 책 페이지 (Pages) */}
                <div
                    className="absolute top-0 right-0 w-11 h-full bg-yellow-50 rounded-r-sm shadow-inner"
                    style={{ transform: 'translateZ(-0.5rem)' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10"
                    ></div>
                </div>
            </div>
        </motion.div>
    );
}