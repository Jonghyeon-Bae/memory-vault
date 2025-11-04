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
    // 제목이 너무 길 경우 '...' 처리
    const truncatedTitle = memory.title.length > 12 ? memory.title.slice(0, 11) + '…' : memory.title;

    return (
        <motion.div
            layoutId={`book-${memory.id}`}
            onClick={() => onSelect(memory.id)}
            className="relative cursor-pointer group w-14 h-64"
            whileHover={{ y: -8, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
            <svg width="56" height="256" viewBox="0 0 56 256" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="absolute drop-shadow-lg">
                {/* --- SVG 정의 --- */}
                <defs>
                    <linearGradient id="gold-foil" x1="0" y1="0" x2="4" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FDE047" />
                        <stop offset="0.5" stopColor="#D97706" />
                        <stop offset="1" stopColor="#FDE047" />
                    </linearGradient>
                    <linearGradient id="gold-highlight" x1="0" y1="0" x2="1" y2="0">
                        <stop stopColor="white" stopOpacity="0.5" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <filter id="leather-texture" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"
                            result="turbulence" />
                        <feSpecularLighting surfaceScale="1" specularConstant=".75" specularExponent="20"
                            lightingColor="#FFF" in="turbulence" result="specularLighting">
                            <feDistantLight azimuth="3" elevation="100" />
                        </feSpecularLighting>
                        <feComposite in="SourceGraphic" in2="specularLighting" operator="arithmetic" k1="0" k2="1"
                            k3="1" k4="0" result="lit" />
                        <feBlend in="SourceGraphic" in2="lit" mode="multiply" />
                    </filter>
                </defs>

                {/* --- 책 모양 그리기 --- */}
                {/* 책 페이지 */}
                <path d="M52 0V256H4C2.89543 256 2 255.105 2 254V2C2 0.895431 2.89543 0 4 0H52Z" fill={color} />
                <path d="M52 0V256" stroke="#000000" strokeOpacity="0.1" />

                {/* 책등 기본 색상 */}
                <path d="M4 0C2.89543 0 2 0.895431 2 2V254C2 255.105 2.89543 256 4 256H0V0H4Z" fill={color} />

                {/* 책등 질감 */}
                <path d="M4 0C2.89543 0 2 0.895431 2 2V254C2 255.105 2.89543 256 4 256H0V0H4Z" fill="black"
                    fillOpacity="0.1" filter="url(#leather-texture)" />

                {/* 책등 위쪽 장식 */}
                <path d="M0 8H4V32H0V8Z" fill="url(#gold-foil)" />
                <path d="M0 8H4" stroke="#422006" strokeOpacity="0.6" />
                <path d="M0 32H4" stroke="#422006" strokeOpacity="0.6" />
                <path d="M0 12H4" stroke="#422006" strokeOpacity="0.3" />
                <path d="M0 28H4" stroke="#422006" strokeOpacity="0.3" />
                <path d="M0 8H4V10H0V8Z" fill="url(#gold-highlight)" fillOpacity="0.7" />

                {/* 책등 아래쪽 장식 */}
                <path d="M0 224H4V248H0V224Z" fill="url(#gold-foil)" />
                <path d="M0 224H4" stroke="#422006" strokeOpacity="0.6" />
                <path d="M0 248H4" stroke="#422006" strokeOpacity="0.6" />
                <path d="M0 228H4" stroke="#422006" strokeOpacity="0.3" />
                <path d="M0 244H4" stroke="#422006" strokeOpacity="0.3" />
                <path d="M0 224H4V226H0V224Z" fill="url(#gold-highlight)" fillOpacity="0.7" />

                {/* 책 제목 (SVG <text> 사용) */}
                <text
                    x="28"
                    y="128"
                    transform="rotate(90, 28, 128)"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-semibold text-lg"
                    style={{ letterSpacing: '0.05em', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                >
                    {truncatedTitle}
                </text>
            </svg>
        </motion.div>
    );
}