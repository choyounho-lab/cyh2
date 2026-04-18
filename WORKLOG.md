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
