import Nav from '../components/Nav';
import AshBackground from '../components/AshBackground';

const INSTAGRAM_URL = 'https://www.instagram.com/hs_deulbull/';
const YOUTUBE_URL = 'https://www.youtube.com/@hs_Deulbull';

// 문의 폼/채널은 나중에 확정되면 이 페이지에 실제 링크나 폼을 넣으면 됩니다.
// 지금은 우선 SNS 채널로 안내하는 임시 페이지입니다.
export default function Contact() {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#0a0a0c] text-white">
      <AshBackground />
      <Nav />

      <div className="px-6 pt-16">
        <p className="font-['Bebas_Neue',_Impact,_sans-serif] text-[26px] tracking-[0.1em] text-white">
          CONTACT
        </p>
      </div>

      <div className="flex flex-col gap-2 px-6 pt-8">
        <h2 className="text-2xl font-black text-white">문의하기</h2>
        <p className="text-sm leading-[1.7] text-white/70">
          문의 페이지는 준비 중입니다. 그전까지는 아래 채널로 편하게 연락해주세요.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 px-6">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 text-sm font-bold text-white"
        >
          인스타그램 DM 보내기
          <span className="text-white/50">@hs_deulbull</span>
        </a>
        <a
          href={YOUTUBE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 text-sm font-bold text-white"
        >
          유튜브 채널 보기
          <span className="text-white/50">@hs_Deulbull</span>
        </a>
      </div>
    </div>
  );
}
