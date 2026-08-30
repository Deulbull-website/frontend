import Nav from '../components/Nav';
import AshBackground from '../components/AshBackground';
import NaverMap from '../components/NaverMap';
import Reveal from '../components/Reveal';

const INSTAGRAM_URL = 'https://www.instagram.com/hs_deulbull/';
const YOUTUBE_URL = 'https://www.youtube.com/@hs_Deulbull';

// 지도 클릭 시 이동할 네이버지도 링크
const MAP_URL = 'https://naver.me/5IfsIZxT';

// 본문(About) 각 블록에 Reveal(아래에서 위로 올라오며 나타나는 애니메이션)을 다시 적용함.
// 예전에 스크롤이 버벅였던 원인은 scroll-snap CSS였던 것으로 확인되어 제거했고,
// Reveal 자체는 rootMargin으로 미리 트리거해서 화면에 보이기 전에 애니메이션이
// 끝나도록 되어 있어 다시 사용해도 버벅임이 재발하지 않음. 섹션 단위로 통째로
// 슬라이드하던 예전 useRevealIn 방식은 되살리지 않고, 블록마다 개별 Reveal만 사용함
export default function About() {
  return (
    <div className="relative isolate mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#0a0a0c] text-white">
      <AshBackground />
      <Nav />

      {/* ABOUT 섹션 */}
      <section data-snap-section className="flex flex-col justify-start pb-[110px]">
        <Reveal delay={0} className="px-6 pt-8">
          <p className="font-['Bebas_Neue',_Impact,_sans-serif] text-[26px] tracking-[0.1em] text-white">
            ABOUT
          </p>
        </Reveal>
        <Reveal delay={80} className="flex flex-col items-center gap-2 px-6 pt-8">
          <h2 className="text-[42px] font-black tracking-tight text-white">들불</h2>
          <p className="text-sm font-light tracking-[0.14em] text-white/72">
            한성대학교 중앙노래패
          </p>
        </Reveal>

        {/* 공연 사진 3장 */}
        <Reveal delay={140} className="mt-6 grid grid-cols-3 gap-1.5 px-5">
          {[
            { src: '/images/about/home_concert1.jpg', alt: '공연 사진 1' },
            { src: '/images/about/26-1_regular_concert.jpg', alt: '공연 사진 2' },
            { src: '/images/about/home_concert3.jpg', alt: '공연 사진 3' },
          ].map((img) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className="h-24 w-full rounded-[3px] object-cover"
            />
          ))}
        </Reveal>

        {/* 소개 문구 — 가독성 조정: 행간(leading)을 살짝 넓히고, 자간(tracking)을 살짝
            좁히고, 문단 사이 간격(gap)을 살짝 넓힘. textWrap: 'pretty'는 문장 마지막 줄에
            한두 글자만 애매하게 넘어가는 것(orphan)을 브라우저가 자동으로 피해서 줄바꿈하게 함 */}
        <Reveal delay={180} className="flex flex-col gap-[22px] px-[26px] pt-[30px]">
          <p
            className="text-left text-sm leading-[2] tracking-[-0.2px] text-white/86"
            style={{ textWrap: 'pretty' }}
          >
            한성대학교 중앙노래패 <strong className="font-bold">들불</strong>은 "들판의 불"처럼 자유롭고 열정적인
            음악을 선보이는 동아리입니다.
          </p>
          <p
            className="text-left text-sm leading-[2] tracking-[-0.2px] text-white/86"
            style={{ textWrap: 'pretty' }}
          >
            매 학기 신입 부원을 모집하며, 80명 이상의 부원들이 활동하고 있어 다양한 장르를 넘나드는 다채로운 무대를
            완성합니다.
          </p>
          <p
            className="text-left text-sm leading-[2] tracking-[-0.2px] text-white/86"
            style={{ textWrap: 'pretty' }}
          >
            <strong className="font-bold">들불</strong>에서는 누구나 무대의 주인공이 될 수 있습니다. 모든 부원에게
            매 학기 최소 한 곡 이상의 공연 기회를 보장하며, 튜터링을 통해 악기를 처음 접하는 분들도 매번 멋진
            무대를 만들어가고 있습니다. <strong className="font-bold">들불</strong>에서 여러분의 멋진 무대를
            기다리고 있겠습니다!
          </p>
        </Reveal>

        {/* 활동 소개 2단 */}
        <div className="flex flex-col gap-5 px-[26px] pt-[34px]">
          <Reveal delay={220} className="grid grid-cols-[150px_1fr] items-center gap-[18px]">
            <img
              src="/images/about/regular_concert.jpg"
              alt="정기공연"
              className="h-28 w-full rounded-[3px] object-cover"
            />
            <p className="text-[13.5px] leading-[1.8] text-white/84">
              학기마다 정기공연과 연합공연을 직접 주최하며, 대동제·버스킹 등 교내 행사에도 참여하고 있습니다.
            </p>
          </Reveal>
          <Reveal delay={280} className="grid grid-cols-[150px_1fr] items-center gap-[18px]">
            <img
              src="/images/about/home_mt.jpg"
              alt="MT / 소모임"
              className="h-28 w-full rounded-[3px] object-cover"
            />
            <p className="text-[13.5px] leading-[1.8] text-white/84">
              공연뿐만 아니라 소모임, MT, 개강파티 등 다양한 활동을 함께하며 소소한 추억도 쌓아가고 있습니다.
            </p>
          </Reveal>
        </div>
      </section>

      {/* POSTER 섹션 */}
      <section className="flex flex-col pt-[110px] pb-[110px]">
        <Reveal delay={0} className="px-6">
          <p className="font-['Bebas_Neue',_Impact,_sans-serif] text-[26px] tracking-[0.1em] text-white">
            POSTER
          </p>
        </Reveal>
        <Reveal delay={100} className="flex justify-center px-6 pt-[22px]">
          {/* 포스터 원본 비율 그대로(잘리지 않게), 폭만 310px로 맞추고 높이는 자동 계산.
              부모를 flex justify-center로 감싸서 가운데 정렬 */}
          <img
            src="/images/about/26-2_apply_poster.jpg"
            alt="모집 포스터"
            className="h-auto w-[310px] rounded-[3px]"
          />
        </Reveal>
      </section>

      {/* LOCATION 섹션 */}
      <section className="flex flex-col pt-[110px]">
        <Reveal delay={0} className="px-6">
          <p className="font-['Bebas_Neue',_Impact,_sans-serif] text-[26px] tracking-[0.1em] text-white">
            LOCATION
          </p>
        </Reveal>
        <Reveal delay={100} className="flex flex-col gap-1.5 px-6 pt-5">
          <div className="flex items-center gap-2.5">
            <PinIcon />
            <p className="text-base font-bold text-white">
              인성관 208호 <span className="font-normal text-white/72">(창의관 2.5층)</span>
            </p>
          </div>
          <p className="ml-[25px] text-xs leading-[1.7] text-white/60">
            자세한 경로는 들불 인스타그램 하이라이트에서 확인하실 수 있습니다.
          </p>
        </Reveal>
        {/* 실제 네이버 지도를 그대로 임베드(드래그·확대/축소 가능). 우측 하단 버튼을 누르면
            실제 네이버 지도 앱/웹으로 연결됩니다. */}
        <Reveal delay={180} className="px-6 pt-[18px]">
          <div className="relative h-[250px] w-full overflow-hidden rounded-[3px]">
            <NaverMap className="h-full w-full" />
            <a
              href={MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-2.5 right-2.5 rounded bg-black/70 px-2.5 py-1.5 text-[11px] text-white/90 backdrop-blur-sm"
            >
              지도 앱에서 보기
            </a>
          </div>
        </Reveal>
      </section>

      {/* LOCATION 지도와 Contact us 사이 여백 — 원본 시안과 동일하게 150px 정도 띄우고,
          그 사이는 카드 전체를 덮는 AshBackground가 자연스럽게 이어서 보여줍니다. */}
      <div className="h-[80px] mt-[70px]" />

      {/* Contact us 푸터 — 원본 시안(개발 전달용 HTML)의 배경 합성 방식을 그대로 재현:
          검정 바닥띠 + 관객 실루엣 사진 + 위(투명)→아래(주황) 그라데이션을
          background-image 세 겹으로 쌓고, 그 위에 텍스트를 얹는 구조입니다. */}
      <div className="relative overflow-hidden px-6 pb-10 pt-[150px]">
        {/* 배경(검정 바닥띠 + 관객 실루엣 사진 + 그라데이션) — 반드시 텍스트보다 뒤에 위치 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'linear-gradient(#08080a, #08080a), url(/images/home_people.png), linear-gradient(180deg, rgba(10,10,12,0) 0%, rgba(52,22,10,.6) 30%, rgba(140,66,32,.7) 62%, rgba(198,110,62,.62) 100%)',
            backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
            // 검정 바닥띠를 사진보다 살짝 더 크게(60→68px) 겹쳐서, 모바일에서 서브픽셀
            // 반올림 오차로 사진과 바닥띠 사이에 1px짜리 빈틈(그 아래 그라데이션 색이 비치는
            // 빨간/주황 실선)이 생기지 않도록 함
            backgroundPosition: 'center bottom, center bottom 60px, center bottom',
            backgroundSize: '100% 68px, 100% auto, 100% 100%',
          }}
        />

        {/* 텍스트 — 배경 바로 앞(제일 앞)에 위치 */}
        <Reveal delay={0} className="relative z-10 flex items-start justify-between gap-[18px]">
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
          <div className="mt-[33px] flex gap-[22px] text-center text-[11px] text-white/60">
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
        </Reveal>
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
