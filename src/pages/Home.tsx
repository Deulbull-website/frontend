import HeroVideoModal from '../components/HeroVideoModal';
import HeroCarousel from '../components/HeroCarousel';
import About from './About';

const INSTAGRAM_URL = 'https://www.instagram.com/hs_deulbull/';
const YOUTUBE_URL = 'https://www.youtube.com/@hs_Deulbull';

const HERO_IMAGES = Array.from(
  { length: 15 },
  (_, i) => `/images/hero/hero-${i + 1}.jpg`,
);

export default function Home() {
  return (
    <>
      {/* 영상 파일 준비되면 이 경로만 실제 파일로 교체하면 됩니다. */}
      <HeroVideoModal videoSrc="/videos/hero-preview.mp4" />

      <section className="relative mx-auto h-[100dvh] max-h-[932px] w-full max-w-[430px] overflow-hidden bg-[#111]">
        {/* 배경 사진 슬라이드 + 하단 그라데이션 */}
        <div className="absolute inset-x-0 bottom-[75px] top-0 bg-[#060608]">
          <HeroCarousel images={HERO_IMAGES} />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px]"
          style={{
            background:
              'linear-gradient(0deg, #060608 0%, #060608 17.9%, rgba(6,6,8,.95) 25%, rgba(6,6,8,.82) 38%, rgba(6,6,8,.6) 55%, rgba(6,6,8,.34) 74%, rgba(6,6,8,.13) 90%, rgba(6,6,8,0) 100%)',
          }}
        />

        {/* 상단 SNS 아이콘 */}
        <div className="absolute left-6 right-6 top-6 flex justify-end gap-5 text-white">
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" aria-label="YouTube">
            <YoutubeIcon />
          </a>
          <a href="/contact" aria-label="문의">
            <ContactIcon />
          </a>
        </div>

        {/* 중앙 타이틀 */}
        <div className="absolute inset-x-6 bottom-[150px] flex flex-col items-center gap-[18px] text-center">
          <p className="text-xs tracking-[0.34em] text-white/66">
            HANSUNG UNIV. VOCAL CREW
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

function ContactIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M21 12.2c0 4-4 7.2-9 7.2-1 0-2-.13-2.9-.37L4 21l1.2-3.5C3.8 16.1 3 14.25 3 12.2 3 8.2 7 5 12 5s9 3.2 9 7.2Z" />
    </svg>
  );
}
