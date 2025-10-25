# 🍅 Pomodoro Todo Timer

원형 파이 차트를 사용한 미니멀한 포모도로 타이머 with Todo 리스트

## ✨ 주요 기능

### 타이머
- **50분 포모도로 타이머** - 원형 파이 차트로 시각화
- **반시계방향 진행** - 10시 방향에서 시작하여 12시 방향(0분)으로
- **25분 추가 시간** - 시간 초과 시 자동 제공
- **실시간 색상 변경** - 작동 중일 때 붉은색으로 표시

### Todo 리스트
- **계층적 구조** - 3단계 들여쓰기 지원 (Tab 키)
- **뽀모도로 카운트** - 각 할 일별 소요 시간 자동 추적
- **완료율 & 총 소요 시간** - 통계 실시간 표시
- **자동 저장** - localStorage를 통한 데이터 보존

### PWA 지원
- **오프라인 작동** - Service Worker 캐싱
- **앱으로 설치** - Chrome, Safari, Edge 등 지원
- **네이티브 앱 경험** - 독립 창 실행

## 🎯 사용법

### 타이머 조작
- **Cmd + Enter** (Mac) / **Ctrl + Enter** (Windows) - 타이머 시작/중지
- 타이머는 현재 포커스된 todo 항목에 연동

### Todo 관리
- **Enter** - 새 todo 추가
- **Tab** - 들여쓰기 (하위 항목으로 변환)
- **Backspace** (빈 입력) - todo 삭제
- **↑/↓** - todo 간 이동
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

- **HTML5** - 시맨틱 마크업
- **CSS3** - Flexbox 레이아웃, 커스텀 체크박스
- **JavaScript (Vanilla)** - 상태 관리 및 UI 업데이트
- **Charts.css** - 파이 차트 시각화
- **PWA** - Service Worker + Web App Manifest

## 📂 파일 구조

```
todo-timer/
├── index.html      # 메인 애플리케이션
├── manifest.json   # PWA 설정
├── sw.js          # Service Worker (오프라인 캐싱)
└── README.md      # 프로젝트 문서
```

## 🎨 디자인 특징

- **다크 테마** - 눈의 피로 최소화
- **미니멀 UI** - 불필요한 요소 제거
- **반응형 레이아웃** - 다양한 화면 크기 지원
- **부드러운 애니메이션** - 색상 전환 및 호버 효과

## 📊 데이터 저장

모든 데이터는 브라우저의 **localStorage**에 저장됩니다:
- Todo 리스트
- 뽀모도로 카운트
- 총 소요 시간

## 🔮 향후 계획

- [ ] 커스텀 타이머 시간 설정
- [ ] 소리 알림 추가
- [ ] 데이터 내보내기/가져오기
- [ ] 통계 대시보드
- [ ] 다크/라이트 테마 토글

## 📝 라이선스

MIT License

## 👨‍💻 개발자

Made with ❤️ by Chris

