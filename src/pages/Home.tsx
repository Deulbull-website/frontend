import { useEffect, useRef, useState } from 'react';
import HeroVideoModal from '../components/HeroVideoModal';
import HeroCarousel, { DotsPager } from '../components/HeroCarousel';
import Reveal from '../components/Reveal';
import About from './About';

const INSTAGRAM_URL = 'https://www.instagram.com/hs_deulbull/';
const YOUTUBE_URL = 'https://www.youtube.com/@hs_Deulbull';
// 메뉴판 CONTACT와 동일한 카카오톡 오픈채팅 링크
const CONTACT_URL = 'https://open.kakao.com/o/sAIy1UKi';

const HERO_IMAGES = Array.from(
  { length: 14 },
  (_, i) => `/images/hero/main${i + 1}.jpg`,
);

// 마우스 휠 한 칸(약 100px)만으로 바로 다음/이전 화면으로 넘어가지 않도록,
// 이 정도 누적 스크롤량이 쌓여야 화면 전환이 일어나게 합니다(대략 휠 두 칸 분량).
const WHEEL_THRESHOLD = 220;
const TRANSITION_LOCK_MS = 700;

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const wheelAccumRef = useRef(0);
  const transitioningRef = useRef(false);

  // 히어로 → About → Poster → Location 순서로, 휠 두 칸 정도 쌓여야
  // 다음/이전 화면으로 완전히 전환되도록 하는 페이지 넘김 효과.
  // (각 화면에는 data-snap-section 속성이 붙어 있습니다.)
  useEffect(() => {
    function getSections() {
      return Array.from(document.querySelectorAll<HTMLElement>('[data-snap-section]'));
    }

    function handleWheel(e: WheelEvent) {
      if (transitioningRef.current) {
        e.preventDefault();
        return;
      }

      const sections = getSections();
      if (sections.length === 0) return;

      const scrollY = window.scrollY;
      let currentIndex = 0;
      for (let i = 0; i < sections.length; i += 1) {
        if (sections[i].offsetTop <= scrollY + 2) currentIndex = i;
      }
      const current = sections[currentIndex];

      // 현재 화면에서 아래로 스크롤할 때: 일정량 이상 쌓여야 다음 화면으로 완전히 전환
      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        e.preventDefault();
        wheelAccumRef.current += e.deltaY;
        if (wheelAccumRef.current >= WHEEL_THRESHOLD) {
          wheelAccumRef.current = 0;
          transitioningRef.current = true;
          sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.setTimeout(() => {
            transitioningRef.current = false;
          }, TRANSITION_LOCK_MS);
        }
        return;
      }

      // 현재 화면 맨 위 지점에서 위로 스크롤할 때: 일정량 이상 쌓여야 이전 화면으로 완전히 복귀
      if (e.deltaY < 0 && currentIndex > 0 && scrollY <= current.offsetTop + 2) {
        e.preventDefault();
        wheelAccumRef.current += e.deltaY;
        if (wheelAccumRef.current <= -WHEEL_THRESHOLD) {
          wheelAccumRef.current = 0;
          transitioningRef.current = true;
          sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.setTimeout(() => {
            transitioningRef.current = false;
          }, TRANSITION_LOCK_MS);
        }
        return;
      }

      wheelAccumRef.current = 0;
    }

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <>
      {/* 영상 파일 준비되면 이 경로만 실제 파일로 교체하면 됩니다. */}
      <HeroVideoModal videoSrc="/videos/hero-preview.mp4" />

      <section
        ref={heroRef}
        data-snap-section
        className="relative z-0 mx-auto h-[100dvh] max-h-[932px] w-full max-w-[430px] snap-start overflow-hidden bg-[#111]"
        style={{ scrollSnapStop: 'always' }}
      >
        {/* 배경 사진 슬라이드 + 하단 그라데이션 */}
        <div className="absolute inset-x-0 bottom-[75px] top-0 bg-[#060608]">
          <HeroCarousel images={HERO_IMAGES} onIndexChange={setHeroIndex} />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px]"
          style={{
            background:
              'linear-gradient(0deg, #060608 0%, #060608 17.9%, rgba(6,6,8,.95) 25%, rgba(6,6,8,.82) 38%, rgba(6,6,8,.6) 55%, rgba(6,6,8,.34) 74%, rgba(6,6,8,.13) 90%, rgba(6,6,8,0) 100%)',
          }}
        />

        {/* 점 인디케이터 — 그라데이션보다 뒤(아래)에서 렌더링하면 사진 위 그라데이션에 가려지므로 그 다음에 렌더링 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[76px] flex justify-center">
          <DotsPager total={HERO_IMAGES.length} active={heroIndex} />
        </div>

        {/* 아래로 스크롤 유도 화살표 — 누르면 About으로 스크롤 이동 */}
        <button
          type="button"
          aria-label="아래로 스크롤"
          onClick={() => {
            const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-section]'));
            const currentIndex = heroRef.current ? sections.indexOf(heroRef.current) : -1;
            const next = currentIndex >= 0 ? sections[currentIndex + 1] : sections[1];
            next?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="absolute inset-x-0 bottom-[35px] flex justify-center py-2 text-white/70"
        >
          <span className="animate-bounce">
            <ChevronDownIcon />
          </span>
        </button>

        {/* 상단 SNS 아이콘 */}
        <div className="absolute left-6 right-6 top-6 flex justify-end gap-5 text-white">
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" aria-label="YouTube">
            <YoutubeIcon />
          </a>
          <a href={CONTACT_URL} target="_blank" rel="noreferrer" aria-label="문의">
            <ContactIcon />
          </a>
        </div>

        {/* 중앙 타이틀 */}
        <Reveal className="absolute inset-x-6 bottom-[106px] flex flex-col items-center gap-[12px] text-center">
          <p className="text-xs tracking-[0.34em] text-white/66">
            HANSUNG UNIV.BAND CLUB
          </p>
          <h1 className="font-['Bebas_Neue',_Impact,_sans-serif] text-[96px] leading-[0.86] tracking-[0.06em] text-white">
            DEULBULL
          </h1>
          <div className="h-px w-11 bg-white/50" />
          <p className="text-[26px] font-bold tracking-[0.04em] text-white">
            신입부원 모집
          </p>
          <p className="text-sm font-light tracking-[0.2em] text-white/70">
            한성대학교 중앙노래패
          </p>
        </Reveal>
      </section>

      {/* 히어로 아래로 스크롤하면 ABOUT(본문) 내용이 이어서 나옵니다. */}
      <About />
    </>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.2" y="5.4" width="19.6" height="13.2" rx="4" />
      <path d="M10.4 9.4 L15.2 12 L10.4 14.6 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="50" height="22" viewBox="0 0 24 24" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M21 12.2c0 4-4 7.2-9 7.2-1 0-2-.13-2.9-.37L4 21l1.2-3.5C3.8 16.1 3 14.25 3 12.2 3 8.2 7 5 12 5s9 3.2 9 7.2Z" />
    </svg>
  );
}
