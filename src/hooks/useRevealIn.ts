import { useEffect, useRef, useState } from 'react';

/**
 * 스크롤로 화면에 들어올 때 위에서 아래로 살짝 내려오며 나타나는 효과를 위한 훅.
 * 반환된 ref를 섹션 요소에 걸어주면, 화면에 처음 들어오는 순간 visible이 true가 됩니다.
 */
export default function useRevealIn<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // rootMargin 아래쪽을 미리 넉넉하게 잡아서 실제로 화면에 보이기 전에 애니메이션을
    // 끝내 둠 — 스크롤 중에 큰 섹션이 슬라이드+페이드 되는 게 버벅임(따닥따닥)으로 느껴지는
    // 문제를 줄이기 위함
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px 150px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible] as const;
}
