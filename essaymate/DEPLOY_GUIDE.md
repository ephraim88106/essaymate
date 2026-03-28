# EssayMate 배포 가이드
# Cloudflare Pages + Workers 완전 배포 매뉴얼

---

## 📋 사전 준비물

- Node.js 18 이상 설치
- GitHub 계정
- Cloudflare 계정 (무료) → cloudflare.com
- Anthropic API 키 → console.anthropic.com

---

## STEP 1. 프로젝트 초기 셋업

```bash
# 1-1. Next.js 프로젝트 생성
npx create-next-app@latest essaymate
# 옵션 선택:
# TypeScript → No
# ESLint → Yes
# Tailwind → No (이미 커스텀 CSS 사용)
# src/ directory → No
# App Router → Yes
# import alias → No

cd essaymate

# 1-2. 파일 배치
# 아래 구조대로 파일을 복사해 넣기:
#
# essaymate/
# ├── app/
# │   ├── page.jsx          ← landing-page.jsx 내용
# │   ├── generate/
# │   │   └── page.jsx      ← essay-input.jsx 내용
# │   ├── result/
# │   │   └── page.jsx      ← result-page.jsx 내용
# │   ├── terms/
# │   │   └── page.jsx      ← terms-page.jsx 내용
# │   └── privacy-policy/
# │       └── page.jsx      ← privacy-page.jsx 내용
# ├── hooks/
# │   └── useEssayGenerate.js
# ├── worker.js
# ├── wrangler.toml
# ├── .env.local
# └── .gitignore

# 1-3. 각 page.jsx 파일 상단에 추가 (App Router 필수)
# "use client";
```

---

## STEP 2. Wrangler 설치 및 로그인

```bash
# 2-1. Wrangler CLI 전역 설치
npm install -g wrangler

# 2-2. Cloudflare 계정 로그인 (브라우저 열림)
wrangler login

# 2-3. 로그인 확인
wrangler whoami
```

---

## STEP 3. Anthropic API 키 등록

```bash
# Cloudflare Workers 시크릿으로 등록 (절대 코드에 직접 입력 금지!)
wrangler secret put ANTHROPIC_API_KEY
# 프롬프트가 나오면 API 키 붙여넣기 → Enter

# 등록 확인
wrangler secret list
```

---

## STEP 4. Workers 로컬 테스트

```bash
# 4-1. 로컬 개발 서버 실행 (터미널 1)
wrangler dev worker.js --port 8787

# 4-2. Next.js 로컬 실행 (터미널 2)
npm run dev

# 4-3. 브라우저에서 확인
# http://localhost:3000 → 랜딩 페이지
# http://localhost:3000/generate → 입력 폼

# 4-4. API 직접 테스트 (터미널 3)
curl -X POST http://localhost:8787/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "기후변화의 영향",
    "type": "academic",
    "language": "korean",
    "length": 500
  }'
# 스트리밍 텍스트가 터미널에 출력되면 성공!
```

---

## STEP 5. Workers 배포

```bash
# 5-1. 프로덕션 배포
wrangler deploy worker.js

# 배포 완료 시 URL 출력:
# https://essaymate-api.{your-subdomain}.workers.dev

# 5-2. .env.local 수정
# NEXT_PUBLIC_WORKER_URL=https://essaymate-api.{your-subdomain}.workers.dev

# 5-3. worker.js의 CORS 도메인도 수정 (배포 후)
# "Access-Control-Allow-Origin": "https://essaymate.pages.dev"
```

---

## STEP 6. GitHub에 코드 올리기

```bash
# 6-1. Git 초기화
git init
git add .
git commit -m "feat: initial EssayMate setup"

# 6-2. GitHub 새 저장소 생성 후 연결
# github.com → New repository → essaymate (Private 권장)
git remote add origin https://github.com/{username}/essaymate.git
git branch -M main
git push -u origin main
```

---

## STEP 7. Cloudflare Pages 배포

```
1. cloudflare.com 로그인
2. 좌측 메뉴 → Workers & Pages → Create
3. Pages 탭 → Connect to Git
4. GitHub 계정 연결 → essaymate 저장소 선택
5. 빌드 설정:
   - Framework preset: Next.js
   - Build command: npm run build
   - Build output directory: .next
6. 환경 변수 추가 (중요!):
   - 변수명: NEXT_PUBLIC_WORKER_URL
   - 값: https://essaymate-api.{your-subdomain}.workers.dev
7. Save and Deploy 클릭
```

배포 완료 시 URL:
`https://essaymate.pages.dev`

---

## STEP 8. 커스텀 도메인 연결 (선택)

```
1. Cloudflare Pages → essaymate → Custom domains
2. Set up a custom domain 클릭
3. 도메인 입력 (예: essaymate.co.kr)
4. Cloudflare DNS에서 자동 설정됨

※ 도메인이 Cloudflare에 등록된 경우 자동 설정
※ 타 업체 도메인은 CNAME 레코드 수동 설정 필요
   CNAME essaymate → essaymate.pages.dev
```

---

## STEP 9. Google AdSense 신청

```
사전 조건 (모두 충족해야 함):
✅ 서비스가 실제 배포되어 접근 가능한 상태
✅ 개인정보처리방침 페이지 존재 (/privacy-policy)
✅ 이용약관 페이지 존재 (/terms)
✅ 충분한 콘텐츠 (랜딩 페이지 + 가이드 글 권장)

신청 방법:
1. adsense.google.com 접속
2. 사이트 URL 입력 (essaymate.pages.dev 또는 커스텀 도메인)
3. 심사 코드를 <head>에 추가
4. Next.js app/layout.jsx의 <head>에 삽입:
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXX" crossorigin="anonymous"></script>
5. 심사 기간: 보통 1~2주 소요
```

---

## STEP 10. 배포 후 체크리스트

```
□ 랜딩 페이지 정상 표시
□ 에세이 생성 (학술형 한국어) 테스트
□ 에세이 생성 (영어 에세이) 테스트
□ 스트리밍 실시간 출력 확인
□ 복사 버튼 동작 확인
□ TXT 저장 동작 확인
□ 다시 생성하기 동작 확인
□ 이용약관 페이지 접근 확인
□ 개인정보처리방침 페이지 접근 확인
□ 모바일 반응형 확인
□ CORS 오류 없는지 브라우저 콘솔 확인
```

---

## 🔧 자주 발생하는 오류 해결

### CORS 오류
```javascript
// worker.js의 CORS_HEADERS 수정
"Access-Control-Allow-Origin": "https://essaymate.pages.dev"
// 개발 중에는 "*" 허용, 배포 후 도메인 지정
```

### Workers 환경변수 오류
```bash
# API 키 재등록
wrangler secret put ANTHROPIC_API_KEY
wrangler deploy worker.js
```

### Next.js 빌드 오류 (App Router)
```jsx
// 각 page.jsx 최상단에 반드시 추가
"use client";
```

### 스트리밍이 안 될 때
```
Cloudflare Workers는 스트리밍을 기본 지원함
단, wrangler.toml에 아래 설정 확인:
compatibility_flags = ["nodejs_compat"]
```

---

## 💰 비용 정리

| 서비스 | 무료 범위 | 초과 시 |
|--------|-----------|---------|
| Cloudflare Pages | 무제한 요청 | 무료 |
| Cloudflare Workers | 10만 req/일 | $5/월 |
| Anthropic API | 없음 (종량제) | 약 $0.003/에세이 |
| Google AdSense | 무료 | 광고 수익 발생 |

※ Anthropic API는 무료 티어 없음. 초기에는 $5~10 크레딧으로 충분히 테스트 가능.
```
