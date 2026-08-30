import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * 스크롤에 맞춰 아래에서 위로 살짝 올라오며 나타나는 애니메이션 래퍼.
 * 화면에 한 번 들어오면 계속 보이는 상태를 유지합니다(다시 사라지지 않음).
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // rootMargin 아래쪽을 화면 높이만큼 미리 넉넉하게 잡아서, 요소가 실제로 눈에 보이기
    // "전에" 미리 애니메이션을 시작하게 함. 본문(About)에는 이런 Reveal이 아주 많아서,
    // 예전처럼 화면에 들어오는 순간(눈에 보이는 시점)에 슬라이드+페이드 애니메이션이
    // 시작되면 스크롤하는 동안 계속 "화면이 밀리는" 것 같은 버벅임(따닥따닥)으로 느껴졌음.
    // 미리 트리거해서 화면에 보일 땐 이미 다 나타난 상태가 되도록 함
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

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      } ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
