import Nav from '../components/Nav';
import AshBackground from '../components/AshBackground';

const INSTAGRAM_URL = 'https://www.instagram.com/hs_deulbull/';
const YOUTUBE_URL = 'https://www.youtube.com/@hs_Deulbull';

// TODO: 실제 주소 확정되면 여기만 바꾸면 지도앱 링크가 자동으로 갱신됩니다.
const LOCATION_QUERY = '한성대학교 인성관 208호';
const MAP_URL = `https://map.naver.com/p/search/${encodeURIComponent(LOCATION_QUERY)}`;

export default function About() {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#0a0a0c] text-white">
      <AshBackground />
      <Nav />

      {/* ABOUT 타이틀 */}
      <div className="px-6 pt-16">
        <p className="font-['Bebas_Neue',_Impact,_sans-serif] text-[26px] tracking-[0.1em] text-white">
          ABOUT
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 px-6 pt-8">
        <h2 className="text-[42px] font-black tracking-tight text-white">들불</h2>
        <p className="text-sm font-light tracking-[0.14em] text-white/72">
          한성대학교 중앙노래패
        </p>
      </div>

      {/* 공연 사진 3장 */}
      <div className="mt-6 grid grid-cols-3 gap-1.5 px-5">
        {['공연 1', '공연 2', '공연 3'].map((label) => (
          <div key={label} className="grid h-24 place-items-center bg-white/10 text-xs text-white/40">
            {label}
          </div>
        ))}
      </div>

      {/* 소개 문구 */}
      <div className="flex flex-col gap-[18px] px-[26px] pt-[30px]">
        <p className="text-sm leading-[1.85] text-white/86">
          한성대학교 중앙노래패 <strong className="font-bold">들불</strong>은 "들판의 불"처럼 자유롭고 열정적인
          음악을 선보이는 동아리입니다.
        </p>
        <p className="text-sm leading-[1.85] text-white/86">
          매 학기 신입 부원을 모집하며, 80여 명의 부원들이 활동하고 있어 다양한 장르를 넘나드는 다채로운 무대를
          완성합니다.
        </p>
        <p className="text-sm leading-[1.85] text-white/86">
          모든 부원에게 한 학기당 최소 한 곡 이상의 공연 기회를 드리고 있습니다. 경험이 없어도 괜찮습니다.
          튜터링도 진행하고 있으니 음악을 향한 뜨거운 열정만 있다면 누구나 들불의 주인공이 될 수 있습니다!
        </p>
      </div>

      {/* 활동 소개 2단 */}
      <div className="flex flex-col gap-5 px-[26px] pt-[34px]">
        <div className="grid grid-cols-[150px_1fr] items-start gap-[18px]">
          <div className="grid h-28 place-items-center bg-white/10 text-xs text-white/40">정기공연</div>
          <p className="text-[13.5px] leading-[1.8] text-white/84">
            학기당 한 번 정기공연과 연합공연을 직접 주최하며, 대동제·체육대회·버스킹 등 다양한 교내 행사에도
            적극적으로 참여하고 있습니다.
          </p>
        </div>
        <div className="grid grid-cols-[150px_1fr] items-start gap-[18px]">
          <div className="grid h-28 place-items-center bg-white/10 text-xs text-white/40">MT / 소모임</div>
          <p className="text-[13.5px] leading-[1.8] text-white/84">
            공연 외에도 다양한 소모임, MT, 개강파티 등 다채로운 활동을 함께하고 있습니다.
          </p>
        </div>
      </div>

      {/* POSTER */}
      <div className="px-6 pt-[70px]">
        <p className="font-['Bebas_Neue',_Impact,_sans-serif] text-[26px] tracking-[0.1em] text-white">
          POSTER
        </p>
      </div>
      <div className="px-[60px] pt-[22px]">
        <div className="grid h-[430px] w-full place-items-center bg-white/10 text-sm text-white/40">
          모집 포스터
        </div>
      </div>

      {/* LOCATION */}
      <div className="px-6 pt-[70px]">
        <p className="font-['Bebas_Neue',_Impact,_sans-serif] text-[26px] tracking-[0.1em] text-white">
          LOCATION
        </p>
      </div>
      <div className="flex flex-col gap-1.5 px-6 pt-5">
        <div className="flex items-center gap-2.5">
          <PinIcon />
          <p className="text-base font-bold text-white">
            인성관 208호 <span className="font-normal text-white/72">(창의관 2.5층)</span>
          </p>
        </div>
        <p className="ml-[25px] text-xs leading-[1.7] text-white/60">
          자세한 경로는 들불 인스타그램 하이라이트에서 확인하실 수 있습니다.
        </p>
      </div>
      {/* 지도 클릭 시 실제 지도앱(네이버지도)으로 연결 */}
      <a href={MAP_URL} target="_blank" rel="noreferrer" className="block px-6 pt-[18px]">
        <div className="grid h-[250px] w-full place-items-center bg-white/10 text-sm text-white/40">
          지도 (클릭 시 지도앱으로 이동)
        </div>
      </a>

      {/* Contact us 푸터 */}
      <div className="mt-[70px] flex items-start justify-between gap-[18px] bg-[#08080a] px-6 pb-10 pt-[150px]">
        <div className="flex flex-col gap-2.5">
          <p className="text-base font-bold text-white">Contact us</p>
          <p className="text-xs text-white/62">한성대학교 중앙노래패 들불</p>
          <div className="mt-1 flex flex-col gap-1.5">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-white/86">
              insta. @hs_deulbull
            </a>
            <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-white/86">
              youtube. @hs_Deulbull
            </a>
          </div>
        </div>
        <div className="mt-8 flex gap-[22px] text-center text-[11px] text-white/60">
          <div className="flex flex-col items-center gap-1.5">
            <span>Design</span>
            <span className="text-white">김명진</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span>Develope</span>
            <span className="text-white">임종욱</span>
            <span className="text-white">이진현</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
