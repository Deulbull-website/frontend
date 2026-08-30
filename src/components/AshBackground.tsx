// "개발 전달용" 원본 시안 HTML의 본문(About·Poster·Location·Contact) 배경 효과를
// 그대로 옮긴 컴포넌트입니다. 시안에는 3개 층이 겹쳐 있습니다:
//   1) 은은하게 숨쉬는 주황/붉은 빛 덩어리 9개 (emberPulse 애니메이션)
//   2) 미세한 필름 그레인(노이즈) 텍스처
//   3) 회백색 재 조각 + 더 작은 재가루 입자 — 타고 남은 재처럼 길쭉하고 찌그러진
//      윤곽(border-radius 랜덤)을 가지며, 애니메이션 없이 고정된 채로 흩뿌려져 있습니다.
//      ABOUT / POSTER / LOCATION / Contact us 구간마다 밀도를 다르게 줍니다.
// 모두 본문 카드(position:relative; isolation:isolate; overflow:hidden) 안에서만
// 보이도록 absolute + inset-0 + -z-10으로 배치합니다.

// 항상 같은 결과가 나오도록 간단한 시드 기반 pseudo-random 사용
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// seed를 이용해 [min, max) 범위의 값을 뽑는 짧은 헬퍼
function rand(seed: number, min: number, max: number) {
  return min + seededRandom(seed) * (max - min);
}

// 필름 그레인 텍스처 — CSS radial-gradient로 점을 일정 간격(3px)마다 반복시키면 확대했을 때
// 규칙적인 점 격자(도트 패턴)로 보이는 문제가 있어, SVG feTurbulence로 만든 진짜 랜덤 노이즈
// 이미지를 타일링해서 사용합니다. 확대해도 격자무늬 없이 자연스러운 그레인으로 보입니다.
const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' seed='7'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

// 재 조각 색 — 반투명 회색 5톤. rgba(150,143,136,.6) ~ rgba(64,60,58,.7) 사이를 보간.
const DUST_COLORS = [
  'rgba(150,143,136,.6)',
  'rgba(129,122,117,.62)',
  'rgba(107,102,97,.65)',
  'rgba(86,81,78,.68)',
  'rgba(64,60,58,.7)',
];

// 재가루(더 작고 옅은 입자) 색 범위
const POWDER_COLOR = { r: 200, g: 192, b: 183, alphaMin: 0.2, alphaMax: 0.42 };

// 정원이 아니라, 타고 남은 재 조각처럼 찌그러진 유기적 윤곽이 되도록
// border-radius 8개 값을 전부 랜덤(28~72%)으로 뽑아 만듭니다.
function randomBorderRadius(seed: number) {
  const v = Array.from({ length: 8 }, (_, k) => rand(seed + k * 3.371, 28, 72).toFixed(0));
  return `${v[0]}% ${v[1]}% ${v[2]}% ${v[3]}% / ${v[4]}% ${v[5]}% ${v[6]}% ${v[7]}%`;
}

// 구간(ABOUT / POSTER / LOCATION / Contact us)별로 재 밀도를 다르게 주기 위한 밴드.
// AshBackground는 About.tsx 전체(모든 섹션이 세로로 이어붙은 카드) 위에 한 번만
// 깔리므로, top(%) 범위를 각 섹션이 대략 위치하는 구간에 맞춰 나눕니다.
const ASH_BANDS = [
  { top: [0, 30] as const, count: 52 }, // ABOUT
  { top: [30, 54] as const, count: 26 }, // POSTER
  { top: [54, 80] as const, count: 46 }, // LOCATION
  { top: [80, 100] as const, count: 32 }, // Contact us
];

const POWDER_BANDS = [
  { top: [0, 30] as const, count: 70 },
  { top: [30, 54] as const, count: 34 },
  { top: [54, 80] as const, count: 62 },
  { top: [80, 100] as const, count: 40 },
];

function buildAshParticles() {
  const list: {
    left: number;
    top: number;
    w: number;
    h: number;
    rotate: number;
    blur: number;
    radius: string;
    color: string;
  }[] = [];
  let i = 0;
  ASH_BANDS.forEach((band, bandIdx) => {
    for (let k = 0; k < band.count; k += 1) {
      const seed = i * 12.9898 + bandIdx * 3.1;
      const left = rand(seed * 1.7, 0, 100);
      const top = rand(seed * 2.3, band.top[0], band.top[1]);
      const w = rand(seed * 3.7, 3, 16);
      const h = w * rand(seed * 5.1, 0.16, 0.5);
      const rotate = rand(seed * 9.1, -80, 80);
      const blur = rand(seed * 6.6, 0.3, 1.3);
      const radius = randomBorderRadius(seed * 4.213 + 1);
      const color = DUST_COLORS[i % DUST_COLORS.length];
      list.push({ left, top, w, h, rotate, blur, radius, color });
      i += 1;
    }
  });
  return list;
}

function buildPowderParticles() {
  const list: {
    left: number;
    top: number;
    w: number;
    h: number;
    rotate: number;
    radius: string;
    blur: number;
    color: string;
  }[] = [];
  let i = 0;
  POWDER_BANDS.forEach((band, bandIdx) => {
    for (let k = 0; k < band.count; k += 1) {
      const seed = i * 17.71 + bandIdx * 5.9 + 500;
      const left = rand(seed * 1.3, 0, 100);
      const top = rand(seed * 2.9, band.top[0], band.top[1]);
      const w = rand(seed * 3.3, 1, 3);
      // 재가루도 재 조각과 마찬가지로 완전한 원이 아니라 살짝 찌그러진 블롭 모양으로
      const h = w * rand(seed * 5.7, 0.5, 1);
      const rotate = rand(seed * 8.2, -90, 90);
      const radius = randomBorderRadius(seed * 4.9 + 3);
      const blur = rand(seed * 4.4, 0.2, 0.8);
      const alpha = rand(seed * 6.1, POWDER_COLOR.alphaMin, POWDER_COLOR.alphaMax);
      const color = `rgba(${POWDER_COLOR.r},${POWDER_COLOR.g},${POWDER_COLOR.b},${alpha.toFixed(2)})`;
      list.push({ left, top, w, h, rotate, radius, blur, color });
      i += 1;
    }
  });
  return list;
}

const particles = buildAshParticles();
const powderParticles = buildPowderParticles();

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

      {/* 3) 회백색 재 조각 + 재가루 — 애니메이션 없이 고정된 채로 흩뿌려져 있음 */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={`ash-${i}`}
            className="absolute"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.w}px`,
              height: `${p.h}px`,
              transform: `rotate(${p.rotate}deg)`,
              background: p.color,
              borderRadius: p.radius,
              filter: `blur(${p.blur}px)`,
            }}
          />
        ))}
        {powderParticles.map((p, i) => (
          <span
            key={`powder-${i}`}
            className="absolute"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.w}px`,
              height: `${p.h}px`,
              transform: `rotate(${p.rotate}deg)`,
              background: p.color,
              borderRadius: p.radius,
              filter: `blur(${p.blur}px)`,
            }}
          />
        ))}
      </div>
    </>
  );
}
