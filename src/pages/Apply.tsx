import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDDay } from '../utils/dday';

// 모집 마감일: 2026-09-07. 날짜만 바뀌면 여기 한 곳만 수정하면 됩니다.
const DEADLINE = new Date('2026-09-07T23:59:59');

export default function Apply() {
  const [dday, setDday] = useState(() => getDDay(DEADLINE));

  // 자정 넘어가면 D-day가 자동으로 갱신되도록 1분마다 재계산
  useEffect(() => {
    const id = setInterval(() => setDday(getDDay(DEADLINE)), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[430px] bg-[#0a0a0c] text-white">
      <div className="px-6 pt-[22px]">
        <p className="font-['Bebas_Neue',_Impact,_sans-serif] text-[30px] tracking-[0.08em] text-white">
          JOIN US
        </p>
      </div>

      <div className="flex flex-col gap-1.5 px-6 pt-[26px]">
        <p className="text-[13px] font-light tracking-[0.14em] text-white/60">
          한성대학교 중앙노래패 들불
        </p>
        <h1 className="text-[36px] font-black tracking-tight text-white">신입부원 모집</h1>
      </div>

      <div className="grid grid-cols-[132px_1fr] items-start gap-[18px] px-6 pt-[26px]">
        <div className="grid h-[186px] place-items-center bg-white/10 text-xs text-white/40">
          모집 포스터
        </div>
        <div className="flex flex-col gap-3.5">
          <InfoRow title="신입부원 모집 기간" value="2026.09.01 ~ 2026.09.07" />
          <InfoRow title="모집분야" value={<>보컬 · 기타 · 베이스 · 드럼 · 키보드<br />· 각 파트별 튜터링</>} />
          <InfoRow title="오디션 일정" value="신입부원 모집 마감 후 카카오톡 개별 공지" />
          <InfoRow title="동아리 회비" value="35,000원" />
        </div>
      </div>

      <div className="mx-6 mt-8 h-px bg-white/18" />

      <div className="flex flex-col gap-3.5 px-6 pt-6">
        <p className="text-[17px] font-extrabold text-white">안내사항</p>
        <ul className="flex list-disc flex-col gap-2.5 pl-[18px]">
          {NOTICES.map((n) => (
            <li key={n} className="text-[13px] leading-[1.75] text-white/82">
              {n}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[34px] flex flex-col gap-3 border-t border-white/14 bg-[rgba(16,16,19,0.96)] px-4 pb-[26px] pt-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">모집 마감까지</span>
          <span className="font-['Bebas_Neue',_Impact,_sans-serif] text-[17px] tracking-[0.1em] text-white">
            {dday}
          </span>
        </div>
        <div className="flex gap-2.5">
          <a
            href="/contact"
            className="grid h-14 w-[58px] place-items-center rounded-2xl bg-white/10 text-white"
            aria-label="문의하기"
          >
            💬
          </a>
          <Link
            to="/apply/form"
            className="grid h-14 flex-1 place-items-center rounded-2xl bg-[#f2efe8] text-base font-extrabold text-[#141416]"
          >
            지원하기
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-bold text-white">{title}</p>
      <p className="text-[12.5px] leading-[1.6] text-white/72">{value}</p>
    </div>
  );
}

const NOTICES = [
  '9/9까지 오디션 공지가 오지 않을 경우 들불 인스타그램 DM 혹은 홈페이지로 문의 부탁드립니다.',
  '모든 항목을 오타 없이 잘 기입해주시기 바랍니다.',
  '연주 영상은 필수 항목은 아니지만, 미제출 시 일부 불이익이 있을 수 있습니다.',
  '지원자가 너무 많을 시 신청서 내용 및 연주 영상으로 1차 선발 후 합격자만 2차 대면 오디션 진행 예정입니다.',
  '오디션 시 마이크, 스피커, 기타, 베이스, 앰프, 케이블, 드럼, 드럼스틱, 키보드 등이 준비되어 있으며 MR 사용도 가능합니다. 원하시는 분은 개인 악기 지참하셔도 무방합니다.',
  '악기나 밴드 경험이 없는 분들도 선발하고 있습니다.',
  '모든 문의사항은 인스타그램 @hs_deulbull 또는 홈페이지 문의 탭을 이용해주시기 바랍니다.',
  '원하시는 결과 꼭 얻으시길 응원하겠습니다!!!',
];
