import { useEffect, useRef, useState } from 'react';

// 사이트 첫 진입 시 뜨는 영상 팝업.
// 처음엔 음소거 자동재생, 버튼 클릭 시 소리 켜짐.
// videoSrc는 나중에 실제 영상 파일(S3+CloudFront URL 등)로 교체하면 됩니다.
export default function HeroVideoModal({ videoSrc }: { videoSrc: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      videoRef.current?.play().catch(() => {});
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const unmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setMuted(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
      <div className="relative w-full max-w-[430px]">
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="w-full"
        />
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
          {muted && (
            <button
              onClick={unmute}
              className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-black"
            >
              🔊 소리 켜기
            </button>
          )}
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="닫기"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
