import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'HOME' },
  { to: '/about', label: 'ABOUT' },
  { to: '/apply', label: 'APPLY' },
  { to: '/gallery', label: 'GALLERY' },
  { to: '/contact', label: 'CONTACT' },
];

export default function Nav() {
  // About 컨테이너에 overflow-hidden(둥근 모서리 클리핑)이 걸려 있어서
  // CSS position:sticky가 브라우저 뷰포트 기준으로 동작하지 않는 문제가 있음.
  // 그래서 센티널(sentinel)을 관찰해 직접 pinned 상태를 계산하고,
  // pinned일 때만 position:fixed로 전환해 크롬 주소창처럼 화면 상단에 계속 붙어있게 함.
  const [pinned, setPinned] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (barRef.current) setBarHeight(barRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setPinned(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-0 w-full" />
      {pinned && <div style={{ height: barHeight }} />}
      <div
        ref={barRef}
        className={`z-50 flex flex-col items-center bg-[rgba(8,8,10,0.88)] pt-3.5 backdrop-blur-md ${
          pinned ? 'fixed inset-x-0 top-0 mx-auto w-full max-w-[430px]' : 'relative w-full'
        }`}
      >
        <p className="mb-3 font-['Bebas_Neue',_Impact,_sans-serif] text-[26px] leading-[22px] tracking-[0.22em] text-white">
          DEULBULL
        </p>
        <div className="h-px w-full max-w-[430px] bg-white/10" />
        <nav className="flex w-full max-w-[430px] justify-center gap-5 py-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative text-[13px] font-semibold ${
                  isActive ? 'text-white' : 'text-white/45 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[7px] left-0 right-0 h-0.5 bg-white" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}
