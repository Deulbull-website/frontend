import { useState } from 'react';

type EnrollStatus = '재학' | '휴학';
type Part = '보컬' | '기타' | '베이스' | '드럼' | '키보드';
type TutoringWish = '희망' | '미희망';

interface ApplyFormData {
  enrollStatus: EnrollStatus | null;
  name: string;
  phone: [string, string, string];
  studentId: string;
  track: string;
  motivation: string;
  part: Part | null;
  experience: string;
  tutoringWish: TutoringWish | null;
  favorites: string;
  videoUrl: string; // 유튜브 링크로만 받음
  lastWord: string;
  agreePrivacy: boolean;
  agreeNoEdit: boolean;
}

const PARTS: Part[] = ['보컬', '기타', '베이스', '드럼', '키보드'];

const initialData: ApplyFormData = {
  enrollStatus: null,
  name: '',
  phone: ['', '', ''],
  studentId: '',
  track: '',
  motivation: '',
  part: null,
  experience: '',
  tutoringWish: null,
  favorites: '',
  videoUrl: '',
  lastWord: '',
  agreePrivacy: false,
  agreeNoEdit: false,
};

export default function ApplyForm() {
  const [data, setData] = useState<ApplyFormData>(initialData);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof ApplyFormData>(key: K, value: ApplyFormData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!data.agreePrivacy || !data.agreeNoEdit) {
      alert('필수 동의 항목을 확인해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      // TODO: 백엔드 API 완성되면 여기서 실제 제출 요청으로 교체
      // await fetch('/api/applications', { method: 'POST', body: JSON.stringify(data) })
      console.log('지원서 제출 데이터', data);
      alert('제출이 완료되었습니다. (백엔드 연결 전 임시 동작입니다)');
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

      <div className="flex flex-col gap-7 px-6 pt-7">
        <RadioGroup
          title="2026 - 2 재학 상태"
          options={['재학', '휴학'] as EnrollStatus[]}
          value={data.enrollStatus}
          onChange={(v) => update('enrollStatus', v)}
          required
          requiredMessage="재학 상태를 선택해주세요."
        />

        <TextField
          title="이름"
          value={data.name}
          onChange={(v) => update('name', v)}
          requiredMessage="이름을 입력해주세요."
        />

        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-bold text-white">전화번호</p>
          <div className="flex items-center gap-2">
            {data.phone.map((part, i) => (
              <input
                key={i}
                value={part}
                onChange={(e) => {
                  const next = [...data.phone] as [string, string, string];
                  next[i] = e.target.value.replace(/\D/g, '');
                  update('phone', next);
                }}
                maxLength={i === 0 ? 3 : 4}
                className="h-[38px] w-[66px] rounded-lg bg-[#d9d9d9] text-center text-sm text-[#6d6d6d] outline-none"
                placeholder={i === 0 ? '010' : '0000'}
              />
            ))}
          </div>
          <RequiredHint show={data.phone.some((p) => !p)} message="전화번호를 입력해주세요." />
        </div>

        <TextField
          title="학번"
          value={data.studentId}
          onChange={(v) => update('studentId', v)}
          requiredMessage="학번을 입력해주세요."
        />

        <TextField
          title="1트랙 (1학년의 경우 단과 대학)"
          value={data.track}
          onChange={(v) => update('track', v)}
          requiredMessage="트랙(단과대학)을 입력해주세요."
        />
      </div>

      <TextAreaField
        className="px-6 pt-[34px]"
        title="지원 동기"
        placeholder="자유롭게 작성해주세요. (최대 1000자)"
        value={data.motivation}
        onChange={(v) => update('motivation', v)}
        maxLength={1000}
        height={230}
      />

      <div className="flex flex-col gap-2.5 px-6 pt-[30px]">
        <p className="text-[19px] font-extrabold text-white">지원 파트</p>
        <RadioGroup options={PARTS} value={data.part} onChange={(v) => update('part', v)} bare />
        <RequiredHint show={!data.part} message="지원 파트를 선택해주세요." />
      </div>

      <TextAreaField
        className="px-6 pt-[30px]"
        title="악기 경력"
        placeholder="자유롭게 작성해 주세요. ex) 없음 or 밴드부 1년, 기타 3년"
        value={data.experience}
        onChange={(v) => update('experience', v)}
        height={74}
      />

      <div className="flex flex-col gap-2.5 px-6 pt-[30px]">
        <p className="text-[19px] font-extrabold text-white">튜터링 희망 여부</p>
        <RadioGroup
          options={['희망', '미희망'] as TutoringWish[]}
          value={data.tutoringWish}
          onChange={(v) => update('tutoringWish', v)}
          bare
        />
        <p className="text-xs leading-[1.7] text-white/62">
          * 수요 조사입니다. 무경험자가 아닌 분들은 상황에 따라 튜터링을 받을 수 있습니다
        </p>
        <RequiredHint show={!data.tutoringWish} message="튜터링 희망 여부를 선택해 주세요" />
      </div>

      <TextAreaField
        className="px-6 pt-[30px]"
        title="좋아하는 장르, 노래, 아티스트"
        placeholder="자유롭게 작성해 주세요."
        value={data.favorites}
        onChange={(v) => update('favorites', v)}
        height={104}
      />

      <div className="flex flex-col gap-2.5 px-6 pt-[30px]">
        <div className="flex items-baseline gap-2.5">
          <p className="text-[19px] font-extrabold text-white">연주 영상</p>
          <p className="text-xs text-white/62">* 유튜브 링크로 제출해주세요</p>
        </div>
        <input
          value={data.videoUrl}
          onChange={(e) => update('videoUrl', e.target.value)}
          placeholder="https://youtube.com/..."
          className="h-[38px] w-full max-w-[280px] rounded-lg bg-[#d9d9d9] px-3 text-sm text-[#6d6d6d] outline-none"
        />
      </div>

      <TextAreaField
        className="px-6 pt-[30px]"
        title="마지막으로 하고 싶은 말"
        placeholder="자유롭게 작성해주세요. (최대 1000자)"
        value={data.lastWord}
        onChange={(v) => update('lastWord', v)}
        maxLength={1000}
        height={230}
      />

      <div className="px-6 pt-11">
        <ul className="flex list-disc flex-col gap-2.5 pl-[18px]">
          <li className="text-[13.5px] leading-[1.75] text-white/86">
            개인정보를 오타 없이 정확하게 입력하셨는지 확인해 주세요!
          </li>
          <li className="text-[13.5px] leading-[1.75] text-white/86">
            제출 후에는 수정이 불가하니 한번 더 검토해주세요!!
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-4 px-6 pb-14 pt-6">
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
            제출 후에는 수정이 불가함을 확인했습니다.
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="grid h-[62px] place-items-center rounded-2xl bg-[#f2efe8] text-[18px] font-extrabold text-[#141416] disabled:opacity-60"
        >
          {submitting ? '제출 중...' : '동의하고 최종 제출'}
        </button>
      </div>
    </div>
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
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  requiredMessage: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-bold text-white">{title}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[38px] w-[200px] rounded-lg bg-[#d9d9d9] px-3 text-sm text-[#6d6d6d] outline-none"
      />
      <RequiredHint show={!value} message={requiredMessage} />
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
}: {
  title: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  height: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <p className="text-[19px] font-extrabold text-white">{title}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{ height }}
        className="w-full resize-none rounded-xl bg-[#d9d9d9] p-3.5 text-[13px] leading-[1.7] text-[#6d6d6d] outline-none"
      />
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
}: {
  title?: string;
  options: T[];
  value: T | null;
  onChange: (v: T) => void;
  required?: boolean;
  requiredMessage?: string;
  bare?: boolean;
}) {
  return (
    <div className={bare ? '' : 'flex flex-col gap-2.5'}>
      {title && <p className="text-[13px] font-bold text-white">{title}</p>}
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
              <span className={`text-[13px] ${selected ? 'text-white/90' : 'text-white/70'}`}>{opt}</span>
            </button>
          );
        })}
      </div>
      {required && <RequiredHint show={!value} message={requiredMessage ?? ''} />}
    </div>
  );
}
