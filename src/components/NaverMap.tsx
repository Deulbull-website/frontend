import { useEffect, useRef, useState } from 'react';

// 네이버 클라우드 플랫폼(NCP)에서 발급받은 Maps용 Client ID.
// .env.local 파일에 VITE_NAVER_MAP_CLIENT_ID=발급받은값 형태로 넣어주세요.
const NAVER_MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID as string | undefined;

// 지도에 표시할 주소 (지오코딩으로 위/경도를 자동으로 찾습니다)
const ADDRESS = '서울특별시 성북구 삼선교로16길 116 한성대학교 창의관';
const MARKER_TITLE = '한성대학교 창의관';

let scriptLoadingPromise: Promise<void> | null = null;

// 네이버 지도 스크립트를 한 번만 로드하도록 보장
function loadNaverMapsScript(clientId: string) {
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    if (window.naver?.maps) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    // geocoder 서브모듈을 함께 로드해야 주소 → 좌표 변환(geocode)을 쓸 수 있습니다.
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('네이버 지도 스크립트를 불러오지 못했습니다.'));
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export default function NaverMap({ className = '' }: { className?: string }) {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!NAVER_MAP_CLIENT_ID) {
      setError('네이버 지도 Client ID가 설정되지 않았습니다.');
      return;
    }

    let cancelled = false;

    loadNaverMapsScript(NAVER_MAP_CLIENT_ID)
      .then(() => {
        if (cancelled || !mapElRef.current) return;
        const { naver } = window;
        if (!naver?.maps) return;

        // 기본 중심(주소 지오코딩 실패 시 대비용) — 한성대학교 대략 위치
        const fallbackCenter = new naver.maps.LatLng(37.5827, 127.0091);

        const map = new naver.maps.Map(mapElRef.current, {
          center: fallbackCenter,
          zoom: 17,
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
        });

        // 주소 → 좌표 변환 후 정확한 위치로 지도 중심 이동 + 마커 표시
        naver.maps.Service.geocode({ query: ADDRESS }, (status: number, response: NaverGeocodeResponse) => {
          if (status !== naver.maps.Service.Status.OK) return;
          const items = response.v2?.addresses;
          if (!items || items.length === 0) return;

          const { x, y } = items[0];
          const location = new naver.maps.LatLng(Number(y), Number(x));
          map.setCenter(location);

          new naver.maps.Marker({
            position: location,
            map,
            title: MARKER_TITLE,
          });
        });
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className={`grid place-items-center bg-white/10 text-center text-xs text-white/40 ${className}`}>
        {error}
        <br />
        (.env.local에 VITE_NAVER_MAP_CLIENT_ID 설정 필요)
      </div>
    );
  }

  return <div ref={mapElRef} className={className} />;
}

// 네이버 지도 스크립트가 만드는 전역 window.naver 타입 최소 선언
declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (el: HTMLElement, options: Record<string, unknown>) => NaverMapInstance;
        LatLng: new (lat: number, lng: number) => unknown;
        Marker: new (options: Record<string, unknown>) => unknown;
        Service: {
          geocode: (
            options: { query: string },
            callback: (status: number, response: NaverGeocodeResponse) => void,
          ) => void;
          Status: { OK: number };
        };
      };
    };
  }
}

interface NaverMapInstance {
  setCenter: (latlng: unknown) => void;
}

interface NaverGeocodeResponse {
  v2?: {
    addresses?: { x: string; y: string }[];
  };
}
