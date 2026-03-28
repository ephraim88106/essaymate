# ✍️ EssayMate

AI가 자동으로 에세이를 써주는 무료 웹서비스

## 기술 스택
- **프론트엔드**: Next.js 14 (App Router)
- **백엔드**: Cloudflare Workers
- **AI**: Anthropic Claude API
- **배포**: Cloudflare Pages
- **광고**: Google AdSense

## 폴더 구조
```
essaymate/
├── app/
│   ├── layout.jsx          # 공통 레이아웃
│   ├── page.jsx            # 메인 랜딩 페이지
│   ├── generate/page.jsx   # 에세이 입력 폼
│   ├── result/page.jsx     # 에세이 결과 (스트리밍)
│   ├── terms/page.jsx      # 이용약관
│   └── privacy-policy/page.jsx  # 개인정보처리방침
├── hooks/
│   └── useEssayGenerate.js # 스트리밍 훅
├── worker.js               # Cloudflare Workers API
├── wrangler.toml           # Workers 배포 설정
├── .env.local              # 환경 변수 (git 제외)
└── DEPLOY_GUIDE.md         # 📖 배포 가이드 (여기서 시작!)
```

## 시작하기

**👉 DEPLOY_GUIDE.md 파일을 먼저 읽으세요!**

### 빠른 시작
```bash
npm install
npm run dev
```

### 환경 변수 설정
`.env.local` 파일에서 Worker URL 설정:
```
NEXT_PUBLIC_WORKER_URL=http://localhost:8787
```

### API 키 등록
```bash
wrangler secret put ANTHROPIC_API_KEY
```
