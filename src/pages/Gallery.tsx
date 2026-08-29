import Nav from '../components/Nav';
import AshBackground from '../components/AshBackground';

// Gallery는 아직 콘텐츠가 준비되지 않아 임시 안내 페이지로 구성했습니다.
// 나중에 실제 공연/활동 사진들을 그리드로 채우면 됩니다.
export default function Gallery() {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#0a0a0c] text-white">
      <AshBackground />
      <Nav />

      <div className="px-6 pt-16">
        <p className="font-['Bebas_Neue',_Impact,_sans-serif] text-[26px] tracking-[0.1em] text-white">
          GALLERY
        </p>
      </div>

      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10 text-2xl">
          📷
        </div>
        <p className="text-base font-bold text-white">준비 중입니다</p>
        <p className="text-sm leading-[1.7] text-white/60">
          들불의 다양한 공연과 활동 사진들을 곧 만나보실 수 있어요.
        </p>
      </div>
    </div>
  );
}
