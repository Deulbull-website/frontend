// "개발 전달용" 원본 시안 HTML의 본문(About·Poster·Location·Contact) 배경 효과를
// 그대로 옮긴 컴포넌트입니다. 시안에는 3개 층이 겹쳐 있습니다:
//   1) 은은하게 숨쉬는 주황/붉은 빛 덩어리 9개 (emberPulse 애니메이션)
//   2) 미세한 필름 그레인(노이즈) 텍스처
//   3) 회백색 재/먼지 입자 — 개수를 늘리고, 시안에 정의만 되어있던 ashRise
//      애니메이션(천천히 위로 떠오르며 사라짐)을 실제로 적용해 더 살아있는 느낌을 줍니다.
// 모두 본문 카드(position:relative; isolation:isolate; overflow:hidden) 안에서만
// 보이도록 absolute + inset-0 + -z-10으로 배치합니다.

const PARTICLE_COUNT = 130;

// 항상 같은 결과가 나오도록 간단한 시드 기반 pseudo-random 사용
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 필름 그레인 텍스처 — CSS radial-gradient로 점을 일정 간격(3px)마다 반복시키면 확대했을 때
// 규칙적인 점 격자(도트 패턴)로 보이는 문제가 있어, SVG feTurbulence로 만든 진짜 랜덤 노이즈
// 이미지를 타일링해서 사용합니다. 확대해도 격자무늬 없이 자연스러운 그레인으로 보입니다.
const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' seed='7'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

// 시안에서 재/먼지 입자에 쓰인 회백색 계열 팔레트 (6가지를 순환)
const DUST_COLORS = [
  'rgba(200,192,183,0.4)',
  'rgba(150,143,136,.6)',
  'rgba(178,170,161,.44)',
  'rgba(118,112,106,.56)',
  'rgba(88,84,80,.64)',
  'rgba(64,60,58,.7)',
];

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const left = seededRandom(i * 12.9898) * 100;
  const top = seededRandom(i * 78.233) * 100;
  const w = 1 + seededRandom(i * 3.7) * 15;
  const h = w * (0.3 + seededRandom(i * 5.1) * 0.7);
  const rotate = seededRandom(i * 9.1) * 90 - 45;
  const blur = seededRandom(i * 6.6) * 1.3;
  const color = DUST_COLORS[i % DUST_COLORS.length];
  // 재가 천천히 위로 떠오르며 사라지는 느낌을 내기 위한 애니메이션 속도/시작 시점
  const duration = 8 + seededRandom(i * 15.3) * 10; // 8~18초
  const delay = -seededRandom(i * 21.7) * 18; // 음수 delay로 시작할 때부터 이미 제각각 다른 지점에 있도록
  return { left, top, w, h, rotate, blur, color, duration, delay };
});

// 은은한 빛 덩어리 — 원본 시안 값 그대로 (9개, 카드 전체 높이 -2%~92%에 분산)
const glowBlobs = [
  { left: -18, top: -2, w: 350, h: 250, rotate: 6, color: 'rgba(255,116,40,.5)', blurPx: 82, radius: '53% 45% 54% 55% / 48% 39% 73% 65%' },
  { left: 46, top: 0, w: 320, h: 230, rotate: -5, color: 'rgba(214,58,12,.44)', blurPx: 86, radius: '46% 27% 68% 59% / 59% 43% 55% 26%' },
  { left: -22, top: 20, w: 240, h: 300, rotate: -2, color: 'rgba(255,86,22,.28)', blurPx: 92, radius: '70% 44% 64% 43% / 41% 65% 41% 74%' },
  { left: 76, top: 26, w: 250, h: 310, rotate: 22, color: 'rgba(255,120,40,.26)', blurPx: 92, radius: '71% 48% 30% 58% / 26% 33% 56% 57%' },
  { left: -20, top: 50, w: 240, h: 300, rotate: 33, color: 'rgba(255,96,28,.24)', blurPx: 95, radius: '45% 62% 72% 67% / 68% 28% 71% 63%' },
  { left: 74, top: 58, w: 250, h: 300, rotate: 9, color: 'rgba(255,84,20,.24)', blurPx: 95, radius: '58% 69% 33% 71% / 69% 37% 43% 57%' },
  { left: -20, top: 78, w: 250, h: 290, rotate: -13, color: 'rgba(255,90,24,.28)', blurPx: 90, radius: '67% 42% 50% 50% / 75% 56% 47% 42%' },
  { left: -16, top: 90, w: 340, h: 250, rotate: -26, color: 'rgba(255,84,20,.44)', blurPx: 84, radius: '52% 53% 49% 58% / 32% 41% 51% 56%' },
  { left: 48, top: 92, w: 350, h: 240, rotate: 16, color: 'rgba(196,44,8,.42)', blurPx: 84, radius: '69% 56% 57% 55% / 73% 35% 62% 73%' },
];

export default function AshBackground() {
  return (
    <>
      {/* 1) 은은하게 숨쉬는 주황/붉은 빛 덩어리 */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{ animation: 'emberPulse 6s ease-in-out infinite' }}
      >
        {glowBlobs.map((b, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: `${b.w}px`,
              height: `${b.h}px`,
              transform: `rotate(${b.rotate}deg)`,
              background: b.color,
              borderRadius: b.radius,
              filter: `blur(${b.blurPx}px)`,
            }}
          />
        ))}
      </div>

      {/* 2) 미세한 필름 그레인(노이즈) 텍스처 — 랜덤 노이즈 타일이라 확대해도 점 격자로 보이지 않음 */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
        }}
      />

      {/* 3) 회백색 재/먼지 입자 텍스처 — 천천히 위로 떠오르며 사라지는(ashRise) 애니메이션 적용 */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.w}px`,
              height: `${p.h}px`,
              transform: `rotate(${p.rotate}deg)`,
            }}
          >
            <span
              className="block h-full w-full rounded-full"
              style={{
                background: p.color,
                filter: `blur(${p.blur}px)`,
                animation: `ashRise ${p.duration}s linear ${p.delay}s infinite`,
              }}
            />
          </span>
        ))}
      </div>
    </>
  );
}
