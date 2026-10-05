/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Figurine {
  src: string;
  bg: string;
  panel: string;
  id: string;
  title: string;
}

const IMAGES: Figurine[] = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
    id: '01',
    title: 'Cosmic Hopper',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
    id: '02',
    title: 'Forest Sentinel',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
    id: '03',
    title: 'Sakura Spark',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
    id: '04',
    title: 'Aqua Dynamo',
  },
];

const GRAIN_SVG_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E";

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const touchStartX = useRef<number | null>(null);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Responsive mobile detector
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigate function with 650ms animation lock
  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActiveIndex((prev) => (direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4));
      setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [isAnimating]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        navigate('next');
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        navigate('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Touch handlers for swipe support on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) {
        navigate('next');
      } else {
        navigate('prev');
      }
    }
    touchStartX.current = null;
  };

  // Derive roles
  const centerIndex = activeIndex;
  const leftIndex = (activeIndex + 3) % 4;
  const rightIndex = (activeIndex + 1) % 4;
  const backIndex = (activeIndex + 2) % 4;

  const getRole = (index: number): 'center' | 'left' | 'right' | 'back' => {
    if (index === centerIndex) return 'center';
    if (index === leftIndex) return 'left';
    if (index === rightIndex) return 'right';
    return 'back';
  };

  const getRoleStyle = (role: 'center' | 'left' | 'right' | 'back'): React.CSSProperties => {
    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: 'none',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '60%' : '92%',
          bottom: isMobile ? '22%' : 0,
          pointerEvents: 'auto',
          cursor: 'default',
        };
      case 'left':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
          pointerEvents: 'auto',
          cursor: 'pointer',
        };
      case 'right':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
          pointerEvents: 'auto',
          cursor: 'pointer',
        };
      case 'back':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
          pointerEvents: 'none',
        };
    }
  };

  const activeFigurine = IMAGES[activeIndex];

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        backgroundColor: activeFigurine.bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', sans-serif",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        {/* 1. Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("${GRAIN_SVG_DATA_URI}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: 0.4,
            zIndex: 50,
          }}
          aria-hidden="true"
        />

        {/* 2. Giant ghost text "3D SHAPE" */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            top: '18%',
            zIndex: 2,
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(90px, 28vw, 380px)',
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: 1,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
          aria-hidden="true"
        >
          3D SHAPE
        </div>

        {/* 3. Top-left brand label "TOONHUB" */}
        <div
          className="absolute top-6 left-4 sm:left-8 flex items-center gap-3 text-xs font-semibold uppercase text-white"
          style={{
            zIndex: 60,
            opacity: 0.9,
            letterSpacing: '0.18em',
          }}
        >
          <span>TOONHUB</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-white/60" />
          <span className="hidden sm:inline-block text-[11px] tracking-[0.25em] text-white/70">
            SERIES 01
          </span>
        </div>

        {/* Top-right subtle figurine number indicator */}
        <div
          className="absolute top-6 right-4 sm:right-8 flex items-center gap-2 text-xs font-semibold uppercase text-white/90"
          style={{
            zIndex: 60,
            letterSpacing: '0.18em',
          }}
        >
          <span className="font-mono text-sm">{activeFigurine.id}</span>
          <span className="text-white/40">/</span>
          <span className="font-mono text-sm text-white/60">04</span>
        </div>

        {/* 4. Carousel */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 3 }}
        >
          {IMAGES.map((item, index) => {
            const role = getRole(index);
            const roleStyle = getRoleStyle(role);

            return (
              <div
                key={item.src}
                onClick={() => {
                  if (role === 'left') navigate('prev');
                  if (role === 'right') navigate('next');
                }}
                title={role === 'left' ? 'Previous' : role === 'right' ? 'Next' : undefined}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  transition:
                    'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, filter, opacity',
                  ...roleStyle,
                }}
              >
                <img
                  src={item.src}
                  alt={`Toonhub figurine ${index + 1}`}
                  draggable={false}
                  className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.22)]"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 5. Bottom-left text + nav buttons */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 text-white"
          style={{
            zIndex: 60,
            maxWidth: '320px',
          }}
        >
          <p
            className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px] text-white"
            style={{
              opacity: 0.95,
              letterSpacing: '0.02em',
            }}
          >
            TOONHUB FIGURINES
          </p>

          <p
            className="hidden sm:block text-xs sm:text-sm text-white mb-4 sm:mb-5"
            style={{
              opacity: 0.85,
              lineHeight: 1.6,
            }}
          >
            The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft
            is flawless. Many thanks! Wishing you the win. Order now.
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate('prev')}
              disabled={isAnimating}
              aria-label="Previous figurine"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 border-white bg-transparent text-white cursor-pointer transition-all duration-150 hover:scale-108 hover:bg-white/12 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={() => navigate('next')}
              disabled={isAnimating}
              aria-label="Next figurine"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 border-white bg-transparent text-white cursor-pointer transition-all duration-150 hover:scale-108 hover:bg-white/12 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link "DISCOVER IT" */}
        <div
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10"
          style={{ zIndex: 60 }}
        >
          <a
            href="#discover"
            onClick={(e) => {
              e.preventDefault();
              navigate('next');
            }}
            className="flex items-center gap-2 sm:gap-4 text-white uppercase no-underline cursor-pointer group transition-opacity duration-200"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            <span className="group-hover:opacity-100">DISCOVER IT</span>
            <ArrowRight
              className="w-5 h-5 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:translate-x-1.5"
              strokeWidth={2.25}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
