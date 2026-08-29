// 시안의 "본문" 배경에 있던 잉걸불/재(ash) 텍스처를 재사용 가능한 컴포넌트로 뺐습니다.
// 시안엔 색/크기/회전값이 조금씩 다른 점(dust) 60~80개가 손으로 박혀있었는데,
// 유지보수하기 어려워서 고정 시드 배열로 생성해 같은 느낌을 내도록 했습니다.
// 필요하면 PARTICLE_COUNT만 조절하면 됩니다.

const PARTICLE_COUNT = 40;

// 항상 같은 결과가 나오도록 간단한 시드 기반 pseudo-random 사용
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const left = seededRandom(i * 12.9898) * 100;
  const top = seededRandom(i * 78.233) * 100;
  const w = 1 + seededRandom(i * 3.7) * 15;
  const h = w * (0.3 + seededRandom(i * 5.1) * 0.7);
  const rotate = seededRandom(i * 9.1) * 90 - 45;
  const opacity = 0.2 + seededRandom(i * 4.3) * 0.5;
  const blur = seededRandom(i * 6.6) * 1.3;
  return { left, top, w, h, rotate, opacity, blur };
});

export default function AshBackground() {
  return (
    <>
      {/* 은은한 주황/붉은 빛 덩어리 (blur된 원형 그라데이션) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden animate-[emberPulse_6s_ease-in-out_infinite]">
        <span className="absolute -left-[18%] -top-[2%] h-[250px] w-[350px] rotate-6 rounded-[53%_45%_54%_55%/48%_39%_73%_65%] bg-[rgba(255,116,40,0.5)] blur-[82px]" />
        <span className="absolute left-[46%] top-0 h-[230px] w-[320px] -rotate-6 rounded-[46%_27%_68%_59%/59%_43%_55%_26%] bg-[rgba(214,58,12,0.44)] blur-[86px]" />
        <span className="absolute -left-[22%] top-[20%] h-[300px] w-[240px] -rotate-2 rounded-[70%_44%_64%_43%/41%_65%_41%_74%] bg-[rgba(255,86,22,0.28)] blur-[92px]" />
        <span className="absolute left-[76%] top-[26%] h-[310px] w-[250px] rotate-[22deg] rounded-[71%_48%_30%_58%/26%_33%_56%_57%] bg-[rgba(255,120,40,0.26)] blur-[92px]" />
        <span className="absolute -left-[20%] top-1/2 h-[300px] w-[240px] rotate-[33deg] rounded-[45%_62%_72%_67%/68%_28%_71%_63%] bg-[rgba(255,96,28,0.24)] blur-[95px]" />
        <span className="absolute left-[74%] top-[58%] h-[300px] w-[250px] rotate-[9deg] rounded-[58%_69%_33%_71%/69%_37%_43%_57%] bg-[rgba(255,84,20,0.24)] blur-[95px]" />
      </div>

      {/* 미세한 재/먼지 입자 텍스처 */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[rgba(200,192,183,0.35)]"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.w}px`,
              height: `${p.h}px`,
              transform: `rotate(${p.rotate}deg)`,
              opacity: p.opacity,
              filter: `blur(${p.blur}px)`,
            }}
          />
        ))}
      </div>
    </>
  );
}
