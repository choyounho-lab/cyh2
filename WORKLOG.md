# Work Log

이 파일은 이 프로젝트에서 진행한 작업 이력을 기록한다.

기록 규칙
- 날짜와 시간을 남긴다.
- 무슨 작업을 했는지 구체적으로 적는다.
- 수정한 파일을 적는다.
- 커밋, 푸시, 배포 여부를 적는다.

## 2026-04-18

### 12:21 KST

작업 요약
- 프로젝트 내부에서 엔드포인트와 배포 설정 위치를 확인했다.
- 실제 Git 저장소가 현재 폴더가 아니라 [../cyh2](/Users/choyh8/Downloads/cyh2) 라는 점을 확인했다.
- `../cyh2` 저장소를 `origin/main` 최신 상태로 동기화했다.
- 현재 작업 폴더 내용을 `../cyh2` 저장소로 반영했다.
- 로컬 정적 서버 실행 문제를 확인하고 권한 승격으로 `yarn start`를 정상 기동했다.
- `Disqus` 댓글 기능을 추가했다.
- 댓글 기능 포함 변경사항을 GitHub 저장소에 커밋, 푸시했고 GitHub Pages 배포를 트리거했다.

세부 작업
- Formspree 엔드포인트 2개 위치 확인
  - `index.html`
  - `main.js`
- GitHub Pages 배포 설정 위치 확인
  - `.github/workflows/deploy.yml`
- 저장소 동기화 및 배포 반영
  - `git pull --rebase origin main`
  - 파일 동기화 후 커밋 및 푸시
- 댓글 기능 추가
  - `index.html`에 `#portal-comments`, `#disqus_thread` 섹션 추가
  - `main.js`에 `Disqus` 스크립트 로더와 댓글 섹션 이동 로직 추가
  - `style.css`에 댓글 섹션 스타일 추가

수정 파일
- `index.html`
- `main.js`
- `style.css`
- `WORKLOG.md`

### 19:01 KST

작업 요약
- 환율 차트 비교 기준을 절대 환율값에서 첫날 대비 변동률(%) 기준으로 변경했다.
- 단위가 다른 통화를 한 축에 같이 두면서 생기던 시각 왜곡을 줄였다.

세부 작업
- `main.js`
  - 환율 시리즈를 변동률로 정규화하는 로직 추가
  - Y축 레이블을 `%` 기준으로 변경
  - 툴팁에 실제 값과 변동률을 함께 표시
- `index.html`
  - 환율 차트 설명 문구를 변동률 기준에 맞게 수정

수정 파일
- `index.html`
- `main.js`
- `WORKLOG.md`

### 18:51 KST

작업 요약
- 환율 차트에 hover 툴팁을 추가했다.
- 캘린더 날짜 메모를 localStorage에 저장할 수 있게 만들었다.
- 상단 고정 검색 바가 스크롤 구간에 따라 compact 상태로 반응하도록 보강했다.

세부 작업
- `main.js`
  - 차트 포인트 hover 툴팁 바인딩 추가
  - 날짜별 메모 저장/복원 로직 추가
  - 스티키 검색 바 compact 상태 토글 추가
- `index.html`
  - 환율 차트 툴팁 영역 추가
- `style.css`
  - compact 검색 바, 툴팁, 클릭형 메모 저장 스타일 추가

수정 파일
- `index.html`
- `main.js`
- `style.css`
- `WORKLOG.md`

### 17:54 KST

작업 요약
- 환율 그래프를 실제 공개 API 기반으로 가져오도록 구조를 변경했다.
- 캘린더는 이전/다음 달 이동, 날짜 클릭, 선택 날짜 상세 패널이 있는 형태로 고급화했다.

세부 작업
- `main.js`
  - Frankfurter 공개 환율 API 기반 최근 7일 환율 fetch 로직 추가
  - 실패 시 샘플 데이터로 되돌아가는 fallback 처리 추가
  - 캘린더 월 이동, 날짜 선택, 상세 안내 로직 추가
- `index.html`
  - 캘린더 이전/다음 버튼과 상세 패널 추가
  - 환율 그래프 설명 문구와 데이터 기준 노트 영역 추가
- `style.css`
  - 캘린더 선택 상태, 네비게이션 버튼, 상세 패널 스타일 추가
  - 환율 API 상태 문구 스타일 추가

메모
- 네이버 오픈 API는 공개 날짜/공휴일 조회용 범용 API를 제공하지 않아, 캘린더 자체는 브라우저 날짜 기반으로 고급화했다.
- 환율은 Frankfurter 공개 API를 사용하도록 변경했다.

### 18:02 KST

작업 요약
- `운영 원칙`과 `운영자 정보` 섹션을 페이지 아래쪽으로 이동했다.

세부 작업
- `index.html`
  - `portal-standards` 섹션을 FAQ 아래로 재배치

수정 파일
- `index.html`
- `WORKLOG.md`

### 18:02 KST

작업 요약
- 첫 화면을 네이버/토스 스타일에 가깝게 보강하기 위해 실시간 요약 바, 미니 데이터 위젯, 추천 피드, 스티키 검색, 퀵패널, 카드 비중 차등 구조를 추가했다.

세부 작업
- `index.html`
  - 상단 고정 검색 바, 우측 하단 퀵패널 추가
  - 히어로 상단 실시간 요약 카드와 미니 데이터 위젯 추가
  - 실시간 바로가기 배지 추가
  - 추천 피드 섹션 추가
  - 도구 위젯 섹션을 비대칭 레이아웃으로 강화
  - 신뢰 영역을 `서비스 안내 센터` 형태로 정리
- `main.js`
  - 현재 시각 갱신 로직 추가
  - 서울 날씨 한 줄 요약 fetch 추가
  - 고정 검색 바와 메인 검색창 동기화
  - 한국 공휴일 조회 기반 캘린더 표시 강화
  - 실시간 요약 카드와 미니 데이터 숫자 갱신 추가
- `style.css`
  - 섹션별 미세한 배경 톤 분리
  - 라이브 카드, 미니 위젯, 피드 카드, 퀵패널, 고정 검색 바 스타일 추가
  - 도구 섹션 핵심 카드 강조 레이아웃 추가

수정 파일
- `index.html`
- `main.js`
- `style.css`
- `WORKLOG.md`

### 17:54 KST

작업 요약
- 환율 그래프를 더 구체적인 차트 형태로 다시 구성했다.
- 하나의 큰 차트 안에 세 통화를 함께 표시하고, 축과 가이드라인, 포인트, 최근값 요약 카드를 추가했다.

세부 작업
- `index.html`
  - 환율 차트 영역을 단일 보드형 레이아웃으로 변경
  - Y축 영역과 최근값 요약 카드 영역 추가
- `main.js`
  - 다중 시리즈 차트 렌더링 로직으로 변경
  - Y축 레이블, 포인트, 최근 7일 등락 계산 추가
- `style.css`
  - 대형 차트 보드, 축, 요약 카드, 상태 색상 스타일 추가

수정 파일
- `index.html`
- `main.js`
- `style.css`
- `WORKLOG.md`

## 2026-04-19

### 14:10 KST

작업 요약
- 모든 HTML 문서에 Google Analytics `gtag.js` 추적 태그를 추가했다.
- 동일한 측정 ID `G-K3983SRBJQ`를 공통 적용해 각 페이지 접근을 추적할 수 있게 맞췄다.

세부 작업
- 다음 파일의 `head`에 Google tag 스니펫 추가
  - `index.html`
  - `about.html`
  - `content-policy.html`
  - `privacy.html`
  - `terms.html`

수정 파일
- `index.html`
- `about.html`
- `content-policy.html`
- `privacy.html`
- `terms.html`
- `WORKLOG.md`

### 20:57 KST

작업 요약
- 최근 작업 내용을 홈 화면에서 바로 볼 수 있도록 `최근 작업 이력` 섹션을 추가했다.
- 날짜, 시간, 작업명, 배포 완료 상태를 카드 형태로 노출하도록 구성했다.

세부 작업
- `index.html`
  - 상단 내비게이션에 `작업이력` 링크 추가
  - 홈 본문에 `최근 작업 이력` 섹션 추가
- `style.css`
  - 작업 이력 카드, 상태 배지, 메타 정보 스타일 추가

수정 파일
- `index.html`
- `style.css`
- `WORKLOG.md`

### 17:50 KST

작업 요약
- 홈 화면에 월별 캘린더 위젯과 환율 그래프 섹션을 추가했다.
- 캘린더는 현재 월 기준으로 자동 렌더링되게 만들었고, 환율은 최근 7일 추이 샘플 데이터를 시각화했다.

세부 작업
- `index.html`
  - `월별 캘린더`, `환율 그래프` 패널 추가
- `main.js`
  - 현재 월 캘린더 렌더링 함수 추가
  - 환율 추이 SVG 그래프 렌더링 함수 추가
- `style.css`
  - 캘린더 셀, 요일 행, 환율 범례, 그래프 카드 스타일 추가

수정 파일
- `index.html`
- `main.js`
- `style.css`
- `WORKLOG.md`

## 2026-04-20

### 00:28 KST

작업 요약
- 홈 화면에 노출되던 `최근 작업 이력` 섹션을 제거했다.
- 작업 로그 파일 `WORKLOG.md`는 그대로 유지해 내부 이력 기록은 계속 남도록 했다.

세부 작업
- `index.html`
  - 상단 내비게이션의 `작업이력` 링크 제거
  - 홈 본문의 `최근 작업 이력` 섹션 제거
- `style.css`
  - 화면용 작업 이력 카드 스타일 제거

수정 파일
- `index.html`
- `style.css`
- `WORKLOG.md`

### 20:53 KST

작업 요약
- 모든 HTML 문서에 Microsoft Clarity 추적 태그를 추가했다.
- Clarity 프로젝트 ID `we490lbbcm`를 공통 적용해 페이지 사용 흐름을 기록할 수 있게 맞췄다.

세부 작업
- 다음 파일의 `head`에 Microsoft Clarity 스니펫 추가
  - `index.html`
  - `about.html`
  - `content-policy.html`
  - `privacy.html`
  - `terms.html`

수정 파일
- `index.html`
- `about.html`
- `content-policy.html`
- `privacy.html`
- `terms.html`
- `WORKLOG.md`

커밋 이력
- `3ff4f51` `Deploy static site update`
- `634953b` `Add Disqus comments section`

배포 상태
- GitHub 저장소로 푸시 완료
- GitHub Pages 배포 트리거 완료
- 공개 주소: `https://choyounho-lab.github.io/cyh2/`

로컬 실행 정보
- 실행 시각 기준 로컬 서버 주소: `http://localhost:4173`
- 네트워크 주소: `http://192.168.4.187:4173`

메모
- 현재 작업 폴더는 Git 저장소가 아니므로 실제 커밋과 푸시는 `../cyh2`에서 진행했다.
- 이후 작업도 이 파일에 계속 누적 기록하면 된다.

### 12:21 KST

작업 요약
- Google AdSense 기본 연동 구성을 추가했다.
- 사이트 소유 및 계정 인식을 위한 메타 태그를 `head`에 추가했다.
- AdSense 스크립트를 `head`에 추가했다.
- 루트 경로에서 제공될 `ads.txt` 파일을 생성했다.

세부 작업
- `index.html`
  - `<meta name="google-adsense-account" content="ca-pub-6851008593822106">` 추가
  - AdSense 스크립트 추가
- `ads.txt`
  - `google.com, pub-6851008593822106, DIRECT, f08c47fec0942fa0` 생성

수정 파일
- `index.html`
- `ads.txt`
- `WORKLOG.md`

### 12:41 KST

작업 요약
- 애드센스 승인 친화성을 높이기 위해 홈 화면을 정보형 구조로 확장했다.
- 독창적인 설명 콘텐츠, 운영 원칙, FAQ, 정책 링크, 운영자 정보 섹션을 추가했다.
- 정책과 신뢰 정보를 분리하기 위해 별도 문서 페이지를 생성했다.

세부 작업
- `index.html`
  - `핵심 가이드`, `운영 원칙`, `운영자 정보`, `FAQ`, `정책 및 안내`, 푸터 추가
  - 상단 내비게이션에 가이드/운영원칙 링크 추가
  - 홈 소개 문구를 정보형 사이트 방향에 맞게 재작성
- 신규 문서 페이지 생성
  - `about.html`
  - `content-policy.html`
  - `privacy.html`
  - `terms.html`
- `style.css`
  - 신규 정보형 섹션과 문서형 페이지 레이아웃 스타일 추가

수정 파일
- `index.html`
- `style.css`
- `about.html`
- `content-policy.html`
- `privacy.html`
- `terms.html`
- `WORKLOG.md`

메모
- 애드센스 공식 블로그의 고품질 사이트 조언을 참고해 독창적 콘텐츠, 쉬운 탐색, 명확한 운영 정보, 정책 문서 공개 방향으로 구조를 보강했다.
- 승인 가능성을 높이는 방향으로 최적화한 것이며, 애드센스 승인 자체를 보장할 수는 없다.

### 12:59 KST

작업 요약
- 검색창 제출 후 검색 엔진을 선택할 수 있는 흐름을 추가했다.
- 사용자가 `네이버` 또는 `구글` 버튼을 누르면 해당 검색엔진 결과 페이지로 바로 이동하도록 구현했다.

세부 작업
- `index.html`
  - 검색창 아래에 검색 엔진 선택 박스 추가
- `main.js`
  - 검색 엔진 선택 박스 열기/닫기 로직 추가
  - `네이버`, `구글` 검색 URL로 이동하는 함수 추가
  - 추천 검색어 버튼을 눌렀을 때도 동일하게 선택 박스가 뜨도록 연결
- `style.css`
  - 검색 엔진 선택 박스와 버튼 스타일 추가

수정 파일
- `index.html`
- `main.js`
- `style.css`
- `WORKLOG.md`
