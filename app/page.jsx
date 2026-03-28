"use client";
import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Nunito:wght@400;600;700;800;900&display=swap');

  :root {
    --orange: #FFB347;
    --coral: #FF6B6B;
    --green: #52B788;
    --blue: #4EA8DE;
    --bg: #FFF8F0;
    --white: #FFFFFF;
    --text: #222222;
    --muted: #888888;
    --border: #F0E6D3;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Nunito', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
  }

  /* ── 배경 블롭 ── */
  .blobs {
    position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
  }
  .blob {
    position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.28;
  }
  .b1 { width: 500px; height: 500px; background: #FFD6A5; top: -150px; right: -100px; animation: drift1 12s ease-in-out infinite alternate; }
  .b2 { width: 380px; height: 380px; background: #CAFFBF; bottom: 10%; left: -80px; animation: drift2 15s ease-in-out infinite alternate; }
  .b3 { width: 250px; height: 250px; background: #BDE0FE; top: 40%; left: 45%; animation: drift1 10s ease-in-out infinite alternate-reverse; }
  @keyframes drift1 { from { transform: translate(0,0) scale(1); } to { transform: translate(30px, 40px) scale(1.1); } }
  @keyframes drift2 { from { transform: translate(0,0); } to { transform: translate(-20px, -30px) scale(1.05); } }

  /* ── 네비게이션 ── */
  nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px;
    background: rgba(255,248,240,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1.5px solid rgba(240,230,211,0.6);
    animation: fadeDown 0.5s ease both;
  }

  .nav-logo {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Gaegu', cursive; font-size: 22px; font-weight: 700; color: var(--text);
    text-decoration: none;
  }

  .nav-links {
    display: flex; align-items: center; gap: 28px;
  }

  .nav-link {
    font-size: 14px; font-weight: 700; color: var(--muted);
    text-decoration: none; transition: color 0.2s;
  }
  .nav-link:hover { color: var(--orange); }

  .nav-cta {
    padding: 10px 22px; border-radius: 50px;
    background: linear-gradient(135deg, var(--orange), var(--coral));
    color: white; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    border: none; cursor: pointer;
    box-shadow: 0 4px 14px rgba(255,107,107,0.3);
    transition: all 0.2s;
  }
  .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,107,107,0.4); }

  /* ── 히어로 섹션 ── */
  .hero {
    position: relative; z-index: 1;
    max-width: 900px; margin: 0 auto;
    padding: 100px 24px 80px;
    text-align: center;
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: white; border: 2px solid var(--border);
    border-radius: 50px; padding: 8px 20px;
    font-size: 13px; font-weight: 800; color: var(--muted);
    box-shadow: 3px 3px 0 var(--border);
    margin-bottom: 28px;
    animation: fadeDown 0.6s ease both; animation-delay: 0.05s;
  }
  .hero-badge span { color: var(--orange); }

  .hero-title {
    font-family: 'Gaegu', cursive;
    font-size: clamp(44px, 8vw, 80px);
    font-weight: 700;
    line-height: 1.15;
    color: var(--text);
    margin-bottom: 24px;
    animation: fadeUp 0.7s ease both; animation-delay: 0.1s;
  }

  .hero-title .highlight {
    position: relative; display: inline-block;
    background: linear-gradient(120deg, var(--orange), var(--coral));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .hero-title .underline-wrap {
    position: relative; display: inline-block;
  }
  .hero-title .underline-wrap::after {
    content: ''; position: absolute; bottom: 2px; left: 0; right: 0;
    height: 6px; background: #CAFFBF; border-radius: 3px; z-index: -1;
    animation: expandWidth 0.8s ease both; animation-delay: 0.6s;
    transform-origin: left;
  }
  @keyframes expandWidth { from { transform: scaleX(0); } to { transform: scaleX(1); } }

  .hero-sub {
    font-size: 18px; font-weight: 600; color: var(--muted);
    line-height: 1.7; max-width: 560px; margin: 0 auto 44px;
    animation: fadeUp 0.7s ease both; animation-delay: 0.18s;
  }

  .hero-btns {
    display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap;
    animation: fadeUp 0.7s ease both; animation-delay: 0.25s;
  }

  .btn-primary {
    display: flex; align-items: center; gap: 8px;
    padding: 16px 36px; border-radius: 50px;
    background: linear-gradient(135deg, var(--orange), var(--coral));
    color: white; font-family: 'Gaegu', cursive; font-size: 20px; font-weight: 700;
    border: none; cursor: pointer;
    box-shadow: 0 6px 24px rgba(255,107,107,0.35);
    transition: all 0.25s;
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(255,107,107,0.45); }

  .btn-secondary {
    display: flex; align-items: center; gap: 8px;
    padding: 16px 28px; border-radius: 50px;
    background: white; border: 2px solid var(--border);
    color: var(--muted); font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; box-shadow: 3px 3px 0 var(--border);
    transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: var(--orange); color: var(--orange); transform: translateY(-2px); }

  /* ── 소셜 프루프 ── */
  .social-proof {
    margin-top: 52px;
    display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap;
    animation: fadeUp 0.7s ease both; animation-delay: 0.35s;
  }

  .proof-item {
    display: flex; align-items: center; gap: 7px;
    font-size: 14px; font-weight: 700; color: var(--muted);
  }
  .proof-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); }

  /* ── 미리보기 카드 ── */
  .preview-section {
    position: relative; z-index: 1;
    max-width: 820px; margin: 0 auto 100px;
    padding: 0 24px;
    animation: fadeUp 0.8s ease both; animation-delay: 0.4s;
  }

  .preview-card {
    background: white; border-radius: 28px;
    border: 2px solid var(--border);
    box-shadow: 8px 8px 0 var(--border), 0 20px 60px rgba(0,0,0,0.06);
    overflow: hidden;
  }

  .preview-bar {
    background: linear-gradient(135deg, #FFF3E0, #FFF8F0);
    border-bottom: 2px solid var(--border);
    padding: 14px 24px;
    display: flex; align-items: center; gap: 8px;
  }

  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot-r { background: #FF6B6B; }
  .dot-y { background: #FFB347; }
  .dot-g { background: #52B788; }

  .preview-title-bar {
    margin-left: 12px;
    font-family: 'Gaegu', cursive; font-size: 15px; color: #AAA;
  }

  .preview-body {
    padding: 28px 32px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  }

  .preview-input-col {}
  .preview-label { font-size: 11px; font-weight: 800; color: #CCC; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }
  .preview-field {
    background: #FDFAF6; border: 2px solid var(--border); border-radius: 12px;
    padding: 11px 14px; font-size: 13px; font-weight: 600; color: #888;
    margin-bottom: 10px;
  }
  .preview-field.active { border-color: var(--orange); background: white; color: var(--text); }
  .preview-tags { display: flex; gap: 7px; flex-wrap: wrap; }
  .preview-tag {
    padding: 5px 13px; border-radius: 50px; font-size: 12px; font-weight: 700;
    border: 2px solid var(--border); color: #AAA; background: white;
  }
  .preview-tag.sel { background: var(--orange); border-color: var(--orange); color: white; }
  .preview-tag.sel2 { background: var(--green); border-color: var(--green); color: white; }

  .preview-output-col {
    border-left: 2px dashed var(--border); padding-left: 24px;
  }
  .preview-essay-line {
    height: 10px; border-radius: 5px; background: #F0E6D3; margin-bottom: 9px;
    position: relative; overflow: hidden;
  }
  .preview-essay-line::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%);
    animation: shimmer 2s infinite;
  }
  @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

  .preview-essay-line.h { height: 14px; background: #FFD6A5; width: 60% !important; }

  /* ── 기능 섹션 ── */
  .features-section {
    position: relative; z-index: 1;
    max-width: 900px; margin: 0 auto 100px; padding: 0 24px;
  }

  .section-eyebrow {
    text-align: center; font-size: 12px; font-weight: 800; color: var(--orange);
    letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px;
  }

  .section-title {
    font-family: 'Gaegu', cursive; font-size: clamp(28px, 5vw, 42px); font-weight: 700;
    text-align: center; margin-bottom: 48px; line-height: 1.2;
  }

  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
  }

  .feature-card {
    background: white; border: 2px solid var(--border); border-radius: 24px;
    padding: 28px 24px;
    box-shadow: 4px 4px 0 var(--border);
    transition: all 0.25s;
  }
  .feature-card:hover { transform: translateY(-4px); box-shadow: 6px 8px 0 var(--border); }

  .feature-icon {
    width: 52px; height: 52px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; margin-bottom: 16px;
  }
  .fi-orange { background: #FFF3E0; }
  .fi-green { background: #E8F8F0; }
  .fi-blue { background: #EDF6FF; }
  .fi-pink { background: #FFF0F5; }
  .fi-yellow { background: #FFFBE6; }
  .fi-purple { background: #F3EEFF; }

  .feature-title { font-size: 16px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
  .feature-desc { font-size: 14px; font-weight: 600; color: var(--muted); line-height: 1.6; }

  /* ── 사용 방법 ── */
  .how-section {
    position: relative; z-index: 1;
    max-width: 820px; margin: 0 auto 100px; padding: 0 24px;
  }

  .steps-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;
    position: relative;
  }

  .steps-row::before {
    content: ''; position: absolute;
    top: 36px; left: calc(16.6% + 16px); right: calc(16.6% + 16px);
    height: 2px; background: linear-gradient(90deg, var(--orange), var(--coral));
    z-index: 0;
  }

  .how-step { text-align: center; padding: 0 16px; position: relative; z-index: 1; }

  .how-num {
    width: 72px; height: 72px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Gaegu', cursive; font-size: 28px; font-weight: 700;
    margin: 0 auto 18px;
    border: 3px solid white;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }
  .hn-1 { background: linear-gradient(135deg, #FFB347, #FF6B6B); color: white; }
  .hn-2 { background: linear-gradient(135deg, #52B788, #38A169); color: white; }
  .hn-3 { background: linear-gradient(135deg, #4EA8DE, #3182CE); color: white; }

  .how-title { font-size: 16px; font-weight: 800; margin-bottom: 8px; }
  .how-desc { font-size: 14px; font-weight: 600; color: var(--muted); line-height: 1.6; }

  /* ── CTA 섹션 ── */
  .cta-section {
    position: relative; z-index: 1;
    max-width: 700px; margin: 0 auto 80px; padding: 0 24px;
  }

  .cta-card {
    background: linear-gradient(135deg, #FFF3E0, #FFE8E8);
    border: 2px solid #FFD6A5; border-radius: 32px;
    padding: 56px 48px; text-align: center;
    box-shadow: 8px 8px 0 #FFD6A5;
  }

  .cta-emoji { font-size: 52px; margin-bottom: 16px; display: block; }
  .cta-title {
    font-family: 'Gaegu', cursive; font-size: clamp(28px, 5vw, 40px); font-weight: 700;
    margin-bottom: 14px;
  }
  .cta-sub { font-size: 16px; font-weight: 600; color: var(--muted); margin-bottom: 32px; }

  /* ── 푸터 ── */
  footer {
    position: relative; z-index: 1;
    border-top: 2px solid var(--border);
    padding: 28px 40px;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  }

  .footer-logo { font-family: 'Gaegu', cursive; font-size: 16px; font-weight: 700; color: var(--muted); }
  .footer-links { display: flex; gap: 20px; }
  .footer-link { font-size: 13px; font-weight: 700; color: #CCC; text-decoration: none; transition: color 0.2s; }
  .footer-link:hover { color: var(--orange); }
  .footer-copy { font-size: 12px; color: #CCC; font-weight: 600; }

  /* ── 애니메이션 ── */
  @keyframes fadeDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  /* ── 반응형 ── */
  @media (max-width: 640px) {
    nav { padding: 14px 20px; }
    .nav-links { display: none; }
    .hero { padding: 60px 20px 50px; }
    .preview-body { grid-template-columns: 1fr; }
    .preview-output-col { border-left: none; border-top: 2px dashed var(--border); padding-left: 0; padding-top: 20px; }
    .features-grid { grid-template-columns: 1fr; }
    .steps-row { grid-template-columns: 1fr; gap: 32px; }
    .steps-row::before { display: none; }
    .cta-card { padding: 36px 24px; }
    footer { flex-direction: column; text-align: center; }
  }
  @media (max-width: 820px) and (min-width: 641px) {
    .features-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

const features = [
  { icon: "⚡", bg: "fi-orange", title: "30초 만에 완성", desc: "주제만 입력하면 AI가 즉시 완성도 높은 에세이를 생성해드려요." },
  { icon: "📚", bg: "fi-green", title: "학술/논문형 특화", desc: "서론-본론-결론 구조, APA·MLA·Chicago 인용 스타일을 자동 적용해요." },
  { icon: "🌏", bg: "fi-blue", title: "영어 에세이 지원", desc: "Thesis statement, 전환 표현, 학술 어조로 영어 에세이를 작성해요." },
  { icon: "🎛️", bg: "fi-pink", title: "세밀한 커스터마이징", desc: "길이, 학문 분야, 인용 스타일, 추가 지시사항까지 자유롭게 설정해요." },
  { icon: "📋", bg: "fi-yellow", title: "쉬운 내보내기", desc: "한 클릭으로 전체 복사, TXT 저장, 인쇄까지 바로 할 수 있어요." },
  { icon: "🔄", bg: "fi-purple", title: "무한 재생성", desc: "마음에 안 들면 같은 주제로 다른 에세이를 바로 다시 만들어요." },
];

const essayLines = [85, 100, 72, 95, 60, 88, 45, 78, 100, 55, 90, 30];

export default function LandingPage({ onStart }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 100);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div>
        {/* 배경 블롭 */}
        <div className="blobs">
          <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
        </div>

        {/* 네비게이션 */}
        <nav>
          <a href="/" className="nav-logo">✍️ EssayMate</a>
          <div className="nav-links">
            <a href="#features" className="nav-link">기능</a>
            <a href="#how" className="nav-link">사용법</a>
            <a href="/privacy-policy" className="nav-link">개인정보처리방침</a>
          </div>
          <button className="nav-cta" onClick={onStart}>무료로 시작하기 →</button>
        </nav>

        {/* 히어로 */}
        <section className="hero">
          <div className="hero-badge">🎓 학술 에세이 전문 AI <span>· 완전 무료</span></div>
          <h1 className="hero-title">
            에세이,<br />
            <span className="highlight">AI</span>한테{" "}
            <span className="underline-wrap">맡겨봐요</span>
          </h1>
          <p className="hero-sub">
            주제만 입력하면 30초 안에<br />
            학술 논문형·영어 에세이를 완성해드려요 ✨
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={onStart}>
              ✍️ 지금 바로 써보기
            </button>
            <button className="btn-secondary">
              ▶ 샘플 보기
            </button>
          </div>
          <div className="social-proof">
            <div className="proof-item">🆓 완전 무료</div>
            <div className="proof-dot" />
            <div className="proof-item">⚡ 30초 생성</div>
            <div className="proof-dot" />
            <div className="proof-item">📝 학술·영어 특화</div>
            <div className="proof-dot" />
            <div className="proof-item">🔒 로그인 불필요</div>
          </div>
        </section>

        {/* 미리보기 카드 */}
        <div className="preview-section">
          <div className="preview-card">
            <div className="preview-bar">
              <div className="dot dot-r" /><div className="dot dot-y" /><div className="dot dot-g" />
              <span className="preview-title-bar">EssayMate — 에세이 생성 중...</span>
            </div>
            <div className="preview-body">
              <div className="preview-input-col">
                <div className="preview-label">📄 입력</div>
                <div className="preview-field active">기후변화가 한국 농업에 미치는 영향</div>
                <div className="preview-tags" style={{ marginBottom: 10 }}>
                  <div className="preview-tag sel">📚 학술형</div>
                  <div className="preview-tag sel2">🇰🇷 한국어</div>
                  <div className="preview-tag">1,000단어</div>
                </div>
                <div className="preview-field">인용 스타일: APA</div>
                <div className="preview-field">학문 분야: 사회과학</div>
              </div>
              <div className="preview-output-col">
                <div className="preview-label">✨ 생성 결과</div>
                {essayLines.map((w, i) => (
                  <div
                    key={i}
                    className={`preview-essay-line ${i === 0 || i === 4 || i === 9 ? "h" : ""}`}
                    style={{ width: `${w}%`, animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 기능 섹션 */}
        <section className="features-section" id="features">
          <div className="section-eyebrow">✨ 왜 EssayMate인가요?</div>
          <h2 className="section-title">에세이 작성의 모든 것을<br />한 곳에서</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={`feature-icon ${f.bg}`}>{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 사용 방법 */}
        <section className="how-section" id="how">
          <div className="section-eyebrow">🚀 사용 방법</div>
          <h2 className="section-title">딱 3단계면 끝!</h2>
          <div className="steps-row">
            <div className="how-step">
              <div className="how-num hn-1">1</div>
              <div className="how-title">주제 입력</div>
              <div className="how-desc">에세이 주제, 유형, 길이를 선택해요</div>
            </div>
            <div className="how-step">
              <div className="how-num hn-2">2</div>
              <div className="how-title">AI 생성</div>
              <div className="how-desc">30초 안에 완성도 높은 에세이가 완성돼요</div>
            </div>
            <div className="how-step">
              <div className="how-num hn-3">3</div>
              <div className="how-title">복사 & 활용</div>
              <div className="how-desc">복사하거나 TXT로 저장해서 바로 사용해요</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-card">
            <span className="cta-emoji">✍️</span>
            <div className="cta-title">지금 바로 시작해보세요!</div>
            <div className="cta-sub">로그인 없이, 무료로, 바로 사용할 수 있어요</div>
            <button className="btn-primary" onClick={onStart} style={{ margin: "0 auto" }}>
              🚀 무료로 에세이 쓰기
            </button>
          </div>
        </section>

        {/* 푸터 */}
        <footer>
          <div className="footer-logo">✍️ EssayMate</div>
          <div className="footer-links">
            <a href="/privacy-policy" className="footer-link">개인정보처리방침</a>
            <a href="/terms" className="footer-link">이용약관</a>
          </div>
          <div className="footer-copy">© 2026 EssayMate. All rights reserved.</div>
        </footer>
      </div>
    </>
  );
}
