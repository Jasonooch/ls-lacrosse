'use client';

import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import ScoreboardCard from '../cards/ScoreboardCard/ScoreboardCard';
import styles from './ScoreSwiper.module.css';
import type { Game } from '@/lib/api/games/games';
import Link from 'next/link';

interface ScoreSwiperProps {
  games: Game[];
}

export default function ScoreSwiper({ games }: ScoreSwiperProps) {
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (swiperRef.current && prevButtonRef.current && nextButtonRef.current) {
      if (typeof swiperRef.current.params.navigation !== 'boolean') {
        const navigation = swiperRef.current.params.navigation;
        if (navigation) {
          navigation.prevEl = prevButtonRef.current;
          navigation.nextEl = nextButtonRef.current;
          swiperRef.current.navigation.init();
          swiperRef.current.navigation.update();
        }
      }
    }
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.cardWrapper}>
        <Swiper
          modules={[Navigation]}
          slidesPerView={4}
          spaceBetween={8}
          effect="slide"
          speed={300}
          preventInteractionOnTransition={true}
          navigation={true}
          onSwiper={(swiper: SwiperType) => {
            swiperRef.current = swiper;
          }}
          onBeforeInit={(swiper: SwiperType) => {
            if (typeof swiper.params.navigation !== 'boolean') {
              const navigation = swiper.params.navigation;
              if (navigation && prevButtonRef.current && nextButtonRef.current) {
                navigation.prevEl = prevButtonRef.current;
                navigation.nextEl = nextButtonRef.current;
              }
            }
          }}
          breakpoints={{
            // Mobile
            0: {
              slidesPerView: 1,
              spaceBetween: 8,
            },
            // Landscape Mobile
            640: {
              slidesPerView: 1,
              spaceBetween: 8,
            },
            // Landscape Tablet
            1024: {
              slidesPerView: 3,
              spaceBetween: 8,
            },
            // Desktop
            1280: {
              slidesPerView: 4,
              spaceBetween: 8,
            },
          }}
          className={styles.swiper}
        >
          {games.map((game, index) => (
            <SwiperSlide key={game.id || index} className={styles.slide}>
              <ScoreboardCard game={game} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <div className={styles.arrowWrap}>
        <button ref={prevButtonRef} className={`${styles.navButton} ${styles.prevButton}`}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M9.375 3.75L5.625 7.5L9.375 11.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button ref={nextButtonRef} className={`${styles.navButton} ${styles.nextButton}`}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M5.625 3.75L9.375 7.5L5.625 11.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <Link href="/varsity/schedule" className={styles.calendarLink}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M14 2h-1V1h-1v1H4V1H3v1H2c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zM2 14V6h12v8H2zm12-10H2V3h2v1h1V3h8v1h1V3h2v1z"/>
        </svg>
      </Link>
    </div>
  );
}
