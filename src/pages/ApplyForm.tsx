import { Fragment, useState } from 'react';

// 실제 배포된 백엔드 주소. Vercel 환경변수 VITE_API_BASE_URL을 설정하면 그 값이 우선 적용되고,
// 안 설정했을 때는 지금 쓰고 있는 nip.io 주소로 동작합니다.
// 나중에 가비아 도메인으로 바뀌면 Vercel 환경변수 값만 바꿔주면 됩니다 (코드 수정 불필요).
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://43-202-195-222.nip.io';

type EnrollStatus = '재학' | '휴학';
type Grade = '1학년' | '2학년' | '3학년' | '4학년';
type Part = '보컬' | '기타' | '베이스' | '드럼' | '키보드';
type TutoringWish = '희망' | '미희망';

interface ApplyFormData {
  enrollStatus: EnrollStatus | null;
  name: string;
  phone: [string, string, string];
  studentId: string;
  grade: Grade | null;
  track1: string;
  track2: string;
  motivation: string;
  part: Part[];
  experience: string;
  tutoringWish: TutoringWish | null;
  favorites: string;
  videoUrl: string; // 유튜브 링크로만 받음
  lastWord: string;
  agreePrivacy: boolean;
  agreeNoEdit: boolean;
}

const GRADES: Grade[] = ['1학년', '2학년', '3학년', '4학년'];
const PARTS: Part[] = ['보컬', '기타', '베이스', '드럼', '키보드'];

const initialData: ApplyFormData = {
  enrollStatus: null,
  name: '',
  phone: ['', '', ''],
  studentId: '',
  grade: null,
  track1: '',
  track2: '',
  motivation: '',
  part: [],
  experience: '',
  tutoringWish: null,
  favorites: '',
  videoUrl: '',
  lastWord: '',
  agreePrivacy: false,
  agreeNoEdit: false,
};

// API 명세서(들불 신입부원모집 API 명세서 > 지원서 제출) 기준 요청 바디 타입
interface ApplicationRequestBody {
  name: string;
  phone: string;
  studentId: string;
  track1: string;
  track2: string;
  status: EnrollStatus;
  grade: Grade;
  part: Part[];
  tutoringPref: TutoringWish;
  motivation: string;
  experience: string;
  genrePref: string;
  videoUrl: string;
  lastWord: string;
}

function isFormComplete(data: ApplyFormData) {
  return (
    data.enrollStatus !== null &&
    data.name.trim() !== '' &&
    data.phone.every((p) => p.trim() !== '') &&
    data.studentId.trim() !== '' &&
    data.grade !== null &&
    data.track1.trim() !== '' &&
    data.track2.trim() !== '' &&
    data.motivation.trim() !== '' &&
    data.part.length > 0 &&
    data.experience.trim() !== '' &&
    data.tutoringWish !== null &&
    data.favorites.trim() !== '' &&
    data.agreePrivacy &&
    data.agreeNoEdit
  );
}

export default function ApplyForm() {
  const [data, setData] = useState<ApplyFormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  // 제출 버튼을 한 번이라도 눌러보기 전까지는 필수 항목 안내(빨간 글씨)를 숨겨둡니다.
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const update = <K extends keyof ApplyFormData>(key: K, value: ApplyFormData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const togglePart = (part: Part) => {
    setData((prev) => ({
      ...prev,
      part: prev.part.includes(part) ? prev.part.filter((p) => p !== part) : [...prev.part, part],
    }));
  };

  const handleSubmit = async () => {
    setAttemptedSubmit(true);

    // 전화번호는 010-0000-0000처럼 3자리-4자리-4자리로 정확히 입력됐는지 확인
    const [phone1, phone2, phone3] = data.phone;
    const isPhoneValid = phone1.length === 3 && phone2.length === 4 && phone3.length === 4;
    if (!isPhoneValid) {
      alert('전화번호를 다시 확인해주세요. (010-0000-0000처럼 3자리-4자리-4자리로 입력해주세요)');
      return;
    }

    if (!data.agreePrivacy || !data.agreeNoEdit) {
      alert('필수 동의 항목을 확인해주세요.');
      return;
    }
    if (!isFormComplete(data)) {
      alert('필수 입력 항목(*)을 모두 채워주세요.');
      return;
    }

    const payload: ApplicationRequestBody = {
      name: data.name,
      phone: data.phone.join(''),
      studentId: data.studentId,
      track1: data.track1,
      track2: data.track2,
      status: data.enrollStatus as EnrollStatus,
      grade: data.grade as Grade,
      part: data.part,
      tutoringPref: data.tutoringWish as TutoringWish,
      motivation: data.motivation,
      experience: data.experience,
      genrePref: data.favorites,
      videoUrl: data.videoUrl,
      lastWord: data.lastWord,
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        alert('들불에 지원해주셔서 감사합니다. 원하시는 좋은 결과가 있으시길 진심으로 응원합니다!');
        setData(initialData);
        setAttemptedSubmit(false);
      } else if (res.status === 400) {
        const err = await res.json().catch(() => null);
        alert(`입력값을 다시 확인해주세요.${err?.message ? `\n(${err.message})` : ''}`);
      } else {
        alert('제출 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch {
      alert('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[430px] bg-[#0a0a0c] text-white">
      <div className="px-6 pt-[22px]">
        <p className="font-['Bebas_Neue',_Impact,_sans-serif] text-[30px] tracking-[0.08em] text-white">
          JOIN US
        </p>
      </div>

      {/* 공연 사진(확대·블러 처리) + 포스터(원본 비율 그대로) — 사이트 공통 좌우 여백(px-6, 24px)에 맞춤 */}
      <div className="px-6 pt-[18px]">
        <div
          className="relative h-[230px] w-full overflow-hidden rounded-[3px] bg-[#0a0a0c]"
          style={{
            backgroundImage: 'url(/images/apply/apply_poster_bg_blur.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(0deg, rgba(6,6,8,.92) 0%, rgba(6,6,8,.5) 42%, rgba(6,6,8,.15) 100%)',
            }}
          />
          {/* 포스터 폭(24vw 기준)에 맞춰 텍스트 영역 폭과 글자 크기도 함께 줄어들도록(clamp)
              해서, 화면이 좁은 기기에서도 포스터와 겹치지 않으면서 두 줄 다 한 줄로 표시됨 */}
          <div
            className="absolute bottom-4 left-[22px] flex flex-col gap-1"
            style={{ right: 'clamp(112px, calc(24vw + 28px), 179px)' }}
          >
            <p
              className="whitespace-nowrap tracking-[0.14em] text-white/75"
              style={{ fontSize: 'clamp(9.5px, 3vw, 12px)' }}
            >
              한성대학교 중앙노래패 들불
            </p>
            <p
              className="whitespace-nowrap font-black leading-[1.1] text-white"
              style={{ fontSize: 'clamp(21px, 7vw, 30px)' }}
            >
              신입부원 모집
            </p>
          </div>
          {/* 포스터 원본 비율 그대로(잘리거나 늘어나지 않게) — 폭을 뷰포트에 비례(clamp)하게 줄여
              좁은 화면에서도 왼쪽 텍스트 한 줄과 겹치지 않도록 함 */}
          <img
            src="/images/about/26-2_apply_poster.jpg"
            alt="모집 포스터"
            className="absolute right-[18px] top-3.5 h-auto rounded-[3px] shadow-[0_4px_14px_rgba(0,0,0,.45)]"
            style={{ width: 'clamp(84px, 24vw, 153px)' }}
          />
        </div>
      </div>

      <div className="px-6 pt-5">
        <p className="font-['Bebas_Neue',_Impact,_sans-serif] text-[19px] tracking-[0.1em] text-white/80">
          2026.08.31 — 2026.09.06
        </p>
      </div>

      <div className="flex flex-col gap-[45px] px-6 pt-7">
        <RadioGroup
          title="2026 - 2 재학 상태*"
          options={['재학', '휴학'] as EnrollStatus[]}
          value={data.enrollStatus}
          onChange={(v) => update('enrollStatus', v)}
          required
          requiredMessage="재학 상태를 선택해주세요."
          showErrors={attemptedSubmit}
        />

        <TextField
          title="이름*"
          value={data.name}
          onChange={(v) => update('name', v)}
          placeholder="김들불"
          requiredMessage="이름을 입력해주세요."
          showErrors={attemptedSubmit}
          widthClass="w-[150px]"
        />

        <div className="flex flex-col gap-2.5">
          <p className="text-[19px] font-extrabold text-white">
            <TitleText text="전화번호*" />
          </p>
          <div className="flex items-center gap-2">
            {data.phone.map((part, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="text-white/60">–</span>}
                <input
                  value={part}
                  onChange={(e) => {
                    const next = [...data.phone] as [string, string, string];
                    next[i] = e.target.value.replace(/\D/g, '');
                    update('phone', next);
                  }}
                  maxLength={i === 0 ? 3 : 4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`h-[38px] rounded-lg bg-[#d9d9d9] text-center text-[15px] text-black outline-none placeholder:text-[13px] placeholder:text-[#6d6d6d] placeholder:opacity-100 ${
                    i === 0 ? 'w-[66px]' : 'w-[71px]'
                  }`}
                  placeholder={i === 0 ? '010' : '0000'}
                />
              </Fragment>
            ))}
          </div>
          <RequiredHint show={attemptedSubmit && data.phone.some((p) => !p)} message="전화번호를 입력해주세요." />
        </div>

        <TextField
          title="학번*"
          value={data.studentId}
          onChange={(v) => update('studentId', v.replace(/\D/g, '').slice(0, 7))}
          placeholder="2612345"
          requiredMessage="학번을 입력해주세요."
          showErrors={attemptedSubmit}
          widthClass="w-[90px]"
          center
          numeric
        />

        <RadioGroup
          title="학년*"
          options={GRADES}
          value={data.grade}
          onChange={(v) => update('grade', v)}
          required
          requiredMessage="학년을 선택해주세요."
          showErrors={attemptedSubmit}
        />

        <TextField
          title="1트랙*"
          value={data.track1}
          onChange={(v) => update('track1', v.slice(0, 15))}
          placeholder="부동산트랙"
          hint={[
            '* 1학년의 경우 단과 대학',
            '* 트랙 이름을 정확하게 입력해 주세요.',
            'ex) 모바일소프트웨어트랙, 영미문화콘텐츠트랙',
          ]}
          requiredMessage="트랙(단과대학)을 입력해주세요."
          showErrors={attemptedSubmit}
          widthClass="w-[190px]"
        />

        <TextField
          title="2트랙*"
          value={data.track2}
          onChange={(v) => update('track2', v.slice(0, 15))}
          placeholder="없음"
          hint="* 없을 경우 '없음'이라고 작성해주세요."
          requiredMessage="2트랙을 입력해주세요. 없으면 '없음'이라고 적어주세요."
          showErrors={attemptedSubmit}
          widthClass="w-[190px]"
        />
      </div>

      <div className="mx-6 mt-[64px] h-px bg-white/18" />

      <TextAreaField
        className="px-6 pt-[39px]"
        title="지원 동기*"
        placeholder="자유롭게 작성해주세요. (최대 1000자)"
        value={data.motivation}
        onChange={(v) => update('motivation', v)}
        maxLength={1000}
        height={230}
        requiredMessage="지원 동기를 입력해주세요."
        showErrors={attemptedSubmit}
      />

      <div className="flex flex-col gap-2.5 px-6 pt-[45px]">
        <p className="text-[19px] font-extrabold text-white">
          <TitleText text="지원 파트*" />
        </p>
        <CheckboxGroup options={PARTS} value={data.part} onToggle={togglePart} />
        <p className="text-[13px] leading-[1.6] text-white/62">* 복수 선택 가능</p>
        <RequiredHint show={attemptedSubmit && data.part.length === 0} message="지원 파트를 1개 이상 선택해주세요." />
      </div>

      <TextAreaField
        className="px-6 pt-[45px]"
        title="악기 경력*"
        placeholder="자유롭게 작성해 주세요. ex) 없음 or 밴드부 1년, 기타 3년"
        value={data.experience}
        onChange={(v) => update('experience', v)}
        height={74}
        requiredMessage="악기 경력을 입력해주세요. 없으면 '없음'이라고 적어주세요."
        showErrors={attemptedSubmit}
      />

      <div className="flex flex-col gap-2.5 px-6 pt-[45px]">
        <p className="text-[19px] font-extrabold text-white">
          <TitleText text="튜터링 희망 여부*" />
        </p>
        <RadioGroup
          options={['희망', '미희망'] as TutoringWish[]}
          value={data.tutoringWish}
          onChange={(v) => update('tutoringWish', v)}
          bare
        />
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] leading-[1.7] text-white/62">
            * 악기를 전혀 다뤄보지 않은 분도 무대에 오를 수 있도록 돕는 프로그램입니다.
          </p>
          <p className="text-[13px] leading-[1.7] text-white/62">
            * 악기 경험이 있으신 경우, 상황에 따라 참여가 어려울 수 있습니다.
          </p>
        </div>
        <RequiredHint show={attemptedSubmit && !data.tutoringWish} message="튜터링 희망 여부를 선택해 주세요" />
      </div>

      <TextAreaField
        className="px-6 pt-[45px]"
        title="좋아하는 장르, 노래, 아티스트*"
        placeholder="자유롭게 작성해 주세요."
        value={data.favorites}
        onChange={(v) => update('favorites', v)}
        height={104}
        requiredMessage="좋아하는 장르, 노래, 아티스트를 입력해주세요."
        showErrors={attemptedSubmit}
      />

      <div className="mx-6 mt-[64px] h-px bg-white/18" />

      <div className="flex flex-col gap-2.5 px-6 pt-[39px]">
        <p className="text-[19px] font-extrabold text-white">연주 영상</p>
        <input
          value={data.videoUrl}
          onChange={(e) => update('videoUrl', e.target.value)}
          placeholder="https://youtube.com/..."
          className="h-[38px] w-full max-w-[280px] rounded-lg bg-[#d9d9d9] px-3 text-[15px] text-black outline-none placeholder:text-[13px] placeholder:text-[#6d6d6d] placeholder:opacity-100"
        />
        <p className="text-[13px] text-white/62">
          * 개인 유튜브 계정에 업로드 후 링크(URL) 첨부 (공개 범위/권한 설정을 꼭 확인해 주세요!)
        </p>
      </div>

      <TextAreaField
        className="px-6 pt-[45px]"
        title="마지막으로 하고 싶은 말"
        placeholder="자유롭게 작성해주세요. (최대 1000자)"
        value={data.lastWord}
        onChange={(v) => update('lastWord', v)}
        maxLength={1000}
        height={230}
      />

      <div className="mx-6 mt-[64px] h-px bg-white/18" />

      <div className="flex flex-col gap-4 px-6 pb-14 pt-[39px]">
        <div className="border border-white/18 bg-white/[0.04]">
          <div className="flex items-center justify-between gap-3 border-b border-white/14 px-4.5 py-4">
            <span className="text-[13.5px] font-semibold text-white">
              개인정보 수집 · 이용 동의 <span className="font-medium text-[#e2564a]">(필수)</span>
            </span>
          </div>
          <div className="flex flex-col gap-2.5 px-4.5 py-4">
            <p className="text-[12.5px] leading-[1.75] text-white/72">
              입력하신 개인정보는 한성대학교 중앙노래패 들불 신입부원 모집 및 오디션 안내를 위한 용도로만
              사용되며, 해당 목적 외의 용도로 이용되지 않습니다.
            </p>
            <div className="grid grid-cols-[64px_1fr] gap-x-3 gap-y-1.5 text-[12.5px] leading-[1.6]">
              <span className="text-white/50">수집 항목</span>
              <span className="text-white/85">이름, 전화번호, 학번</span>
              <span className="text-white/50">수집 목적</span>
              <span className="text-white/85">지원자 확인, 오디션 관련 안내</span>
              <span className="text-white/50">보유 기간</span>
              <span className="text-white/85">모집 종료 후 7일 이내 파기</span>
              <span className="text-white/50">수집 주체</span>
              <span className="text-white/85">한성대학교 중앙노래패 들불</span>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-2.5 pl-0.5">
          <input
            type="checkbox"
            checked={data.agreePrivacy}
            onChange={(e) => update('agreePrivacy', e.target.checked)}
            className="mt-0.5 h-[17px] w-[17px] flex-none"
          />
          <span className="text-[12.5px] leading-[1.6] text-white/72">
            개인정보 수집 및 이용에 동의합니다. (필수)
          </span>
        </label>

        <label className="flex items-start gap-2.5 pl-0.5">
          <input
            type="checkbox"
            checked={data.agreeNoEdit}
            onChange={(e) => update('agreeNoEdit', e.target.checked)}
            className="mt-0.5 h-[17px] w-[17px] flex-none"
          />
          <span className="text-[12.5px] leading-[1.6] text-white/72">
            제출 후에는 수정이 불가함을 확인했습니다. (필수)
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-[60px] grid h-[62px] place-items-center rounded-2xl bg-[#f2efe8] text-[18px] font-extrabold text-[#141416] disabled:opacity-60"
        >
          {submitting ? '제출 중...' : '최종 제출'}
        </button>
      </div>
    </div>
  );
}

// 필수 항목 제목 뒤의 '*' 표시를 본문 글자보다 작게 렌더링
function TitleText({ text }: { text: string }) {
  if (!text.endsWith('*')) return <>{text}</>;
  return (
    <>
      {text.slice(0, -1)}
      <span className="ml-0.5 align-top text-[10px] text-[#e2564a]">*</span>
    </>
  );
}

function RequiredHint({ show, message }: { show: boolean; message: string }) {
  if (!show) return null;
  return <p className="text-[11px] text-[#e2564a]">* {message}</p>;
}

function TextField({
  title,
  value,
  onChange,
  requiredMessage,
  placeholder,
  showErrors,
  hint,
  widthClass = 'w-full',
  center,
  numeric,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  requiredMessage?: string;
  placeholder?: string;
  showErrors: boolean;
  hint?: string | string[];
  widthClass?: string;
  center?: boolean;
  // 학번처럼 숫자만 입력받는 필드에서 모바일 키보드를 숫자 자판으로 띄울 때 사용
  numeric?: boolean;
}) {
  const hints = hint == null ? [] : Array.isArray(hint) ? hint : [hint];
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[19px] font-extrabold text-white">
        <TitleText text={title} />
      </p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={numeric ? 'numeric' : undefined}
        pattern={numeric ? '[0-9]*' : undefined}
        className={`h-[38px] ${widthClass} rounded-lg bg-[#d9d9d9] px-3 text-[15px] text-black outline-none placeholder:text-[13px] placeholder:text-[#6d6d6d] placeholder:opacity-100 ${
          center ? 'text-center' : ''
        }`}
      />
      {hints.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {hints.map((h, i) => {
            // '*'로 시작하지 않는 줄은 앞줄의 '* ' 폭만큼 들여써서 텍스트 시작 위치를 맞춥니다.
            const isBullet = h.trimStart().startsWith('*');
            return (
              <p
                key={i}
                className="text-[13px] leading-[1.5] text-white/62"
                style={!isBullet ? { paddingLeft: '1em' } : undefined}
              >
                {h}
              </p>
            );
          })}
        </div>
      )}
      {requiredMessage && <RequiredHint show={showErrors && !value} message={requiredMessage} />}
    </div>
  );
}

function TextAreaField({
  title,
  placeholder,
  value,
  onChange,
  maxLength,
  height,
  className = '',
  requiredMessage,
  showErrors,
}: {
  title: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  height: number;
  className?: string;
  requiredMessage?: string;
  showErrors?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <p className="text-[19px] font-extrabold text-white">
        <TitleText text={title} />
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{ height }}
        className="w-full resize-none rounded-xl bg-[#d9d9d9] p-3.5 text-[15px] leading-[1.7] text-black outline-none placeholder:text-[13px] placeholder:text-[#6d6d6d] placeholder:opacity-100"
      />
      {requiredMessage && <RequiredHint show={!!showErrors && !value.trim()} message={requiredMessage} />}
    </div>
  );
}

function RadioGroup<T extends string>({
  title,
  options,
  value,
  onChange,
  required,
  requiredMessage,
  bare,
  showErrors,
}: {
  title?: string;
  options: T[];
  value: T | null;
  onChange: (v: T) => void;
  required?: boolean;
  requiredMessage?: string;
  bare?: boolean;
  showErrors?: boolean;
}) {
  return (
    <div className={bare ? '' : 'flex flex-col gap-2.5'}>
      {title && (
        <p className="text-[19px] font-extrabold text-white">
          <TitleText text={title} />
        </p>
      )}
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onChange(opt)}
              className="flex items-center gap-2.5 text-left"
            >
              <span
                className={`grid h-[15px] w-[15px] flex-none place-items-center rounded-full border-2 ${
                  selected ? 'border-white' : 'border-white/45'
                }`}
              >
                {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className={`text-[16px] ${selected ? 'text-white/90' : 'text-white/70'}`}>{opt}</span>
            </button>
          );
        })}
      </div>
      {required && <RequiredHint show={!!showErrors && !value} message={requiredMessage ?? ''} />}
    </div>
  );
}

// 지원 파트처럼 여러 개 동시 선택이 필요한 항목용 (백엔드가 part를 배열로 받음)
function CheckboxGroup<T extends string>({
  options,
  value,
  onToggle,
}: {
  options: T[];
  value: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => {
        const selected = value.includes(opt);
        return (
          <button
            type="button"
            key={opt}
            onClick={() => onToggle(opt)}
            className="flex items-center gap-2.5 text-left"
          >
            <span
              className={`grid h-[15px] w-[15px] flex-none place-items-center rounded-[4px] border-2 ${
                selected ? 'border-white bg-white' : 'border-white/45'
              }`}
            >
              {selected && <span className="h-1.5 w-1.5 rounded-[1px] bg-[#141416]" />}
            </span>
            <span className={`text-[16px] ${selected ? 'text-white/90' : 'text-white/70'}`}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
