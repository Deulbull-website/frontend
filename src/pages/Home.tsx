import { useEffect, useRef, useState } from 'react';
// import HeroVideoModal from '../components/HeroVideoModal'; // 동영상 팝업 — 일단 비활성화
import HeroCarousel, { DotsPager } from '../components/HeroCarousel';
import Reveal from '../components/Reveal';
import About from './About';

const INSTAGRAM_URL = 'https://www.instagram.com/hs_deulbull/';
const YOUTUBE_URL = 'https://www.youtube.com/@hs_Deulbull';
// 메뉴판 CONTACT와 동일한 카카오톡 오픈채팅 링크
const CONTACT_URL = 'https://open.kakao.com/o/sAIy1UKi';

// main3은 메인 화면 슬라이드에서 제외
const HERO_IMAGES = Array.from({ length: 14 }, (_, i) => i + 1)
  .filter((n) => n !== 3)
  .map((n) => `/images/hero/main${n}.jpg`);

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  // 스크롤 점프가 진행 중일 때 중복으로 다시 트리거되는 것을 막기 위한 플래그
  const isJumpingRef = useRef(false);

  // 히어로 → About으로 부드럽게 스크롤 이동시키는 함수. 화살표 버튼과, 아래
  // 휠/터치 스크롤 감지 로직이 동일하게 이 함수를 사용함
  const goToAbout = () => {
    if (isJumpingRef.current) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-section]'));
    const currentIndex = heroRef.current ? sections.indexOf(heroRef.current) : -1;
    const next = currentIndex >= 0 ? sections[currentIndex + 1] : sections[1];
    if (!next) return;
    isJumpingRef.current = true;
    next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => {
      isJumpingRef.current = false;
    }, 900);
  };

  // 히어로 화면(맨 위)에 있을 때는 스크롤을 조금만 내려도(휠을 살짝 굴리거나 위로
  // 살짝 스와이프해도) About까지 한 번에 부드럽게 스크롤 이동하게 함. 예전에 썼던
  // CSS scroll-snap은 긴 About 블록과 만나면 스크롤 내내 스냅 위치를 계속
  // 재계산하면서 버벅이는 문제가 있어서 걷어냈으므로, 히어로에서만 JS로 "한 번 크게
  // 점프"시키는 방식을 씀 (About 안쪽은 원래대로 자유 스크롤 그대로 둠)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY > 4 || e.deltaY <= 8) return;
      e.preventDefault();
      goToAbout();
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY > 4) return;
      const currentY = e.touches[0]?.clientY ?? touchStartY;
      if (touchStartY - currentY <= 12) return;
      e.preventDefault();
      goToAbout();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <>
      {/* 동영상 팝업 — 일단 비활성화 (다시 켤 때는 위 import와 아래 한 줄만 복구하면 됩니다) */}
      {/* <HeroVideoModal videoSrc="/videos/hero-preview.mp4" /> */}

      {/* CSS scroll-snap(snap-start + proximity)이 About처럼 아주 긴 블록과 만나면
          스크롤 내내 스냅 위치를 계속 재계산하면서 따닥거리는 현상이 있어서 완전히 제거함.
          이제 완전히 일반적인 자유 스크롤이고, "아래로 스크롤" 화살표를 눌렀을 때만
          scrollIntoView로 부드럽게 이동함 */}
      <section
        ref={heroRef}
        data-snap-section
        className="relative z-0 mx-auto h-[100dvh] max-h-[932px] w-full max-w-[430px] overflow-hidden bg-[#111]"
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

        {/* 점 인디케이터 — 그라데이션보다 뒤(아래)에서 렌더링하면 사진 위 그라데이션에 가려지므로 그 다음에 렌더링.
            화면 위쪽부터 아래쪽 순서로 차례차례 올라오도록, 타이틀(제일 위 줄부터 신입부원 모집/한성대 줄까지)이
            다 올라온 다음에 이어서 등장하게 delay를 늘림 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[76px] flex justify-center">
          <Reveal delay={440}>
            <DotsPager total={HERO_IMAGES.length} active={heroIndex} />
          </Reveal>
        </div>

        {/* 아래로 스크롤 유도 화살표 — 누르면 About으로 스크롤 이동. 화면에서 제일 아래에 있으니 제일 마지막에 등장 */}
        <Reveal delay={520} className="absolute inset-x-0 bottom-[29px] flex justify-center">
          <button
            type="button"
            aria-label="아래로 스크롤"
            onClick={goToAbout}
            className="py-2 text-white/70"
          >
            {/* span이 기본 inline이면 transform이 적용되지 않아 통통 튀는 애니메이션이
                안 보이므로 inline-block으로 바꿔줌 */}
            <span className="inline-block animate-bounce">
              <ChevronDownIcon />
            </span>
          </button>
        </Reveal>

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

        {/* 중앙 타이틀 — 줄마다 순서대로 아래에서 위로 올라오며 나타남 */}
        <div className="absolute inset-x-6 bottom-[106px] flex flex-col items-center gap-[12px] text-center">
          <Reveal delay={0}>
            <p className="text-xs tracking-[0.34em] text-white/66">
              HANSUNG UNIV.BAND CLUB
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-['Bebas_Neue',_Impact,_sans-serif] text-[96px] leading-[0.86] tracking-[0.06em] text-white">
              DEULBULL
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <div className="h-px w-11 bg-white/50" />
          </Reveal>
          <Reveal delay={280}>
            <p className="text-[26px] font-bold tracking-[0.04em] text-white">
              신입부원 모집
            </p>
          </Reveal>
          <Reveal delay={360}>
            <p className="text-sm font-light tracking-[0.2em] text-white/70">
              한성대학교 중앙노래패
            </p>
          </Reveal>
        </div>
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
