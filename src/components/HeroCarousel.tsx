import { useEffect, useRef, useState } from 'react';

interface HeroCarouselProps {
  images: string[];
  intervalMs?: number;
}

// 인스타그램 여러 장 게시물의 점 인디케이터와 동일한 방식.
// - 점은 최대 5개만 보이고, 활성 사진이 가운데(3번째)로 오도록 점 목록 자체가 옆으로 슬라이드된다.
// - 맨 처음(1~3번째 사진)과 맨 끝(마지막에서 3번째~마지막 사진)에서는 슬라이드가 멈추고
//   그 자리에서 점 크기만 거리에 따라 작아진다.
const DOT_SIZE = 6;
const DOT_GAP = 8;
const DOT_STEP = DOT_SIZE + DOT_GAP;
const MAX_VISIBLE_DOTS = 5;

function dotScale(distance: number) {
  if (distance <= 0) return 1;
  if (distance === 1) return 0.75;
  if (distance === 2) return 0.55;
  if (distance === 3) return 0.4;
  return 0.28;
}

function DotsPager({ total, active }: { total: number; active: number }) {
  if (total <= 1) return null;

  const visibleCount = Math.min(total, MAX_VISIBLE_DOTS);
  const windowStart = Math.min(Math.max(active - 2, 0), Math.max(total - MAX_VISIBLE_DOTS, 0));

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: visibleCount * DOT_STEP - DOT_GAP, height: DOT_SIZE }}
    >
      <div
        className="absolute left-0 top-0 flex items-center"
        style={{
          gap: DOT_GAP,
          transform: `translateX(${-windowStart * DOT_STEP}px)`,
          transition: 'transform 300ms ease',
        }}
      >
        {Array.from({ length: total }).map((_, p) => {
          const scale = dotScale(Math.abs(p - active));
          return (
            <span
              key={p}
              className={`flex-none rounded-full ${p === active ? 'bg-white' : 'bg-white/45'}`}
              style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                transform: `scale(${scale})`,
                transition: 'transform 300ms ease, background-color 300ms ease',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function HeroCarousel({ images, intervalMs = 4000 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const dragStartX = useRef<number | null>(null);
  const dragging = useRef(false);

  const goTo = (next: number) => {
    setIndex(((next % total) + total) % total);
  };

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [index, total, intervalMs]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging.current || dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragging.current = false;
    dragStartX.current = null;
    const threshold = 40;
    if (delta > threshold) goTo(index - 1);
    else if (delta < -threshold) goTo(index + 1);
  };

  return (
    <div className="relative h-full w-full">
      <div
        className="h-full w-full touch-pan-y overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragging.current = false;
          dragStartX.current = null;
        }}
      >
        <div
          className="flex h-full"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(-${(index * 100) / total}%)`,
            transition: 'transform 400ms ease',
          }}
        >
          {images.map((src, i) => (
            <div key={src} className="h-full flex-none" style={{ width: `${100 / total}%` }}>
              <img
                src={src}
                alt={`들불 공연 사진 ${i + 1}`}
                draggable={false}
                className="h-full w-full select-none object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <DotsPager total={total} active={index} />
      </div>
    </div>
  );
}
