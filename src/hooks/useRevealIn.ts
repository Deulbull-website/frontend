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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible] as const;
}
