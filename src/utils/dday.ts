// 모집 마감일 기준 D-day를 자동 계산하는 유틸
// 사용 예: getDDay(new Date('2026-09-07T23:59:59'))

export function getDDay(deadline: Date, today: Date = new Date()): string {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return 'D-DAY';
  return `마감`; // 마감일이 지난 경우
}
