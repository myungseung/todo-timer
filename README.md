# ⏱️ Daily Time Tracker

하루 동안 시간을 어떻게 썼는지 상세하게 기록하는 Habit Tracker

## 💡 핵심 개념

이 앱은 **단순한 시간 추적기**입니다:
- 타이머를 시작하면 그 순간부터 **초 단위로 시간을 기록**
- ESC나 Cmd+Enter로 중단해도, 끝까지 완료해도 **항상 경과 시간 기록**
- 각 작업에 실제로 투입한 시간을 정확하게 추적
- 프로그램적인 "완료" 기능은 없음 - 완료는 사용자가 체크박스를 클릭할 때만

## ✨ 주요 기능

### 시간 추적
- **50분 타이머** - 원형 파이 차트로 시각화 (초기값일 뿐)
- **초 단위 정확한 기록** - 언제 중단하든 정확히 경과한 시간만 기록
- **반시계방향 진행** - 10시 방향에서 시작하여 12시 방향(0분)으로
- **실시간 기록** - ESC나 Cmd+Enter로 중단 시에도 경과 시간 자동 저장
- **실시간 색상 변경** - 작동 중일 때 붉은색으로 표시

### 작업 관리
- **계층적 구조** - 3단계 들여쓰기 지원 (Tab 키)
- **실시간 시간 표시** - 각 작업별 누적 소요 시간 (초 단위)
- **총 소요 시간** - 하루 동안 기록된 총 시간
- **단순 기록** - 완료는 체크박스로만, 프로그램은 시간만 추적
- **자동 저장** - localStorage를 통한 날짜별 데이터 보존

### PWA 지원
- **오프라인 작동** - Service Worker 캐싱
- **앱으로 설치** - Chrome, Safari, Edge 등 지원
- **네이티브 앱 경험** - 독립 창 실행

## 🎯 사용법

### 시간 추적
- **Cmd + Enter** (Mac) / **Ctrl + Enter** (Windows) - 타이머 시작/중지
- **ESC** - 타이머 중단 (경과 시간 자동 기록)
- 타이머는 현재 포커스된 작업 항목에 연동
- 중간에 멈추든, 끝까지 완료하든 **항상 경과 시간이 기록됨**

### 작업 관리
- **Enter** - 새 작업 추가
- **Tab** - 들여쓰기 (하위 항목으로 변환)
- **Shift + Tab** - 들여쓰기 해제
- **Backspace** (빈 입력) - 작업 삭제
- **↑/↓** - 작업 간 이동
- **Checkbox** - 완료 처리

## 🚀 배포

**Live Demo:** [https://todo-timer-kj0fnhhws-chris-projects-493131d9.vercel.app](https://todo-timer-kj0fnhhws-chris-projects-493131d9.vercel.app)

### 자동 배포 (Vercel)
GitHub 저장소와 Vercel이 연동되어 있어 **자동 배포**가 진행됩니다:
- `master` 브랜치에 push 시 자동으로 프로덕션 빌드 & 배포
- 별도로 `npm run build` 명령어를 실행할 필요 없음
- 배포 상태는 [Vercel Dashboard](https://vercel.com/dashboard)에서 확인

### 로컬 개발
```bash
# 개발 서버 실행 (Hot Module Replacement)
npm run dev

# 브라우저에서 접속
# http://localhost:5173
```

### 로컬 빌드 테스트 (선택사항)
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📱 PWA 설치

### 데스크톱 (Chrome/Edge)
1. 앱 URL 접속
2. 주소창 오른쪽 **설치 아이콘** (⊕) 클릭
3. "설치" 버튼 클릭

### 모바일 (iOS Safari)
1. 앱 URL 접속
2. **공유** 버튼 → **홈 화면에 추가**

### 모바일 (Android Chrome)
1. 앱 URL 접속
2. 메뉴 → **앱 설치** 또는 **홈 화면에 추가**

## 🛠 기술 스택

- **React 19** - UI 컴포넌트 및 상태 관리
- **Vite** - 빌드 도구 및 개발 서버
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **PWA** - Service Worker + Web App Manifest

## 📂 파일 구조

```
todo-timer/
├── src/
│   ├── components/
│   │   ├── Timer.jsx      # 원형 타이머 컴포넌트
│   │   └── TodoList.jsx   # 작업 목록 컴포넌트
│   ├── hooks/
│   │   ├── useTimer.js    # 타이머 로직 및 시간 기록
│   │   └── useTodos.js    # 작업 관리 로직
│   ├── utils/
│   │   └── storage.js     # localStorage 관리
│   ├── App.jsx            # 메인 애플리케이션
│   └── main.jsx           # 진입점
├── public/
│   ├── manifest.json      # PWA 설정
│   └── sw.js             # Service Worker
└── README.md             # 프로젝트 문서
```

## 🎨 디자인 특징

- **다크 테마** - 눈의 피로 최소화
- **미니멀 UI** - 불필요한 요소 제거
- **반응형 레이아웃** - 다양한 화면 크기 지원
- **부드러운 애니메이션** - 색상 전환 및 호버 효과

## 📊 데이터 구조

단순하고 명확한 데이터 구조:

```javascript
{
  "2024-01-01": {
    todos: [
      { id: 1, text: "작업", level: 0, completed: false, timeSpent: 3000 },
      { id: 2, text: "하위", level: 1, completed: true, timeSpent: 1800 }
    ]
  }
}
```

**핵심 규칙:**
- 날짜별로 데이터가 분리됨
- 각 todo는 `text` (제목)와 `timeSpent` (초 단위 시간)만 기록
- `completed`는 사용자가 체크박스를 클릭할 때만 업데이트됨
- 프로그램적인 "완료" 개념은 존재하지 않음 - 단순 시간 추적기

모든 데이터는 브라우저의 **localStorage**에 자동 저장됩니다.

## 🔮 향후 계획

- [ ] 주간/월간 시간 사용 통계
- [ ] 작업별 시간 분석 차트
- [ ] 데이터 내보내기/가져오기 (CSV, JSON)
- [ ] 시간대별 활동 히트맵
- [ ] 다크/라이트 테마 토글

## 📝 라이선스

MIT License

## 👨‍💻 개발자

Made with ❤️ by Chris

