"use client";
// pages/result.jsx (또는 app/result/page.jsx)
// essay-input.jsx에서 router.push('/result', { formData }) 로 이동

"use client";
import { useState, useEffect, useRef } from "react";
import { useEssayGenerate } from "../../hooks/useEssayGenerate";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Nunito:wght@400;600;700;800&family=Noto+Serif+KR:wght@400;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #FFF8F0; min-height: 100vh; }

  .page { min-height: 100vh; background: #FFF8F0; position: relative; overflow: hidden; }
  .blob { position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.3; pointer-events: none; z-index: 0; }
  .blob-1 { width: 350px; height: 350px; background: #FFD6A5; top: -80px; right: -60px; }
  .blob-2 { width: 280px; height: 280px; background: #CAFFBF; bottom: -50px; left: -50px; }

  .container { max-width: 780px; margin: 0 auto; padding: 36px 24px 80px; position: relative; z-index: 1; }

  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
  .back-btn {
    display: flex; align-items: center; gap: 6px;
    background: white; border: 2px solid #E8DDD0; border-radius: 50px; padding: 8px 16px;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; color: #888;
    cursor: pointer; transition: all 0.2s; box-shadow: 2px 2px 0 #E8DDD0;
  }
  .back-btn:hover { border-color: #FFB347; color: #FFB347; }
  .logo-small { font-family: 'Gaegu', cursive; font-size: 18px; font-weight: 700; color: #555; }

  .meta-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .meta-tag {
    display: flex; align-items: center; gap: 5px;
    background: white; border: 2px solid #F0E6D3; border-radius: 50px;
    padding: 5px 14px; font-size: 13px; font-weight: 700; color: #888;
  }

  .result-card {
    background: white; border-radius: 28px; border: 2px solid #F0E6D3;
    box-shadow: 6px 6px 0 #F0E6D3; overflow: hidden;
  }

  .card-header {
    background: linear-gradient(135deg, #FFF3E0, #FFF8F0);
    border-bottom: 2px solid #F0E6D3; padding: 24px 32px;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  }

  .essay-label { font-size: 11px; font-weight: 800; color: #FFB347; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
  .essay-title { font-family: 'Gaegu', cursive; font-size: 26px; font-weight: 700; color: #222; line-height: 1.3; }

  /* 로딩 상태 */
  .generating-badge {
    flex-shrink: 0; background: linear-gradient(135deg, #FFB347, #FF6B6B);
    border-radius: 16px; padding: 10px 16px; text-align: center; color: white;
    box-shadow: 0 4px 12px #FF6B6B30; animation: pulse 1.5s ease-in-out infinite;
  }
  .generating-badge.done { animation: none; background: linear-gradient(135deg, #52B788, #38A169); }

  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

  .badge-icon { font-size: 22px; line-height: 1; margin-bottom: 2px; }
  .badge-label { font-size: 10px; font-weight: 800; opacity: 0.9; letter-spacing: 0.05em; white-space: nowrap; }

  .essay-body { padding: 32px; max-height: 480px; overflow-y: auto; }
  .essay-body::-webkit-scrollbar { width: 6px; }
  .essay-body::-webkit-scrollbar-track { background: #FFF8F0; }
  .essay-body::-webkit-scrollbar-thumb { background: #F0D9BE; border-radius: 3px; }

  /* 마크다운 스타일링 */
  .essay-text { font-family: 'Noto Serif KR', serif; font-size: 15px; line-height: 1.95; color: #333; white-space: pre-wrap; }

  /* 커서 깜빡임 */
  .cursor {
    display: inline-block; width: 2px; height: 1em;
    background: #FFB347; margin-left: 2px; vertical-align: text-bottom;
    animation: blink 0.8s step-end infinite;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  /* 에러 상태 */
  .error-box {
    margin: 24px 32px; padding: 16px 20px;
    background: #FFF0F0; border: 2px solid #FFB3B3; border-radius: 16px;
    color: #E53E3E; font-size: 14px; font-weight: 700;
  }

  /* 스켈레톤 로딩 */
  .skeleton-line {
    height: 16px; background: linear-gradient(90deg, #F0E6D3 25%, #FFF8F0 50%, #F0E6D3 75%);
    background-size: 200% 100%; border-radius: 8px; margin-bottom: 12px;
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  .action-bar {
    border-top: 2px solid #F0E6D3; padding: 20px 32px;
    display: flex; gap: 10px; flex-wrap: wrap;
  }

  .action-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 11px 20px; border-radius: 50px; border: 2px solid #E8DDD0;
    background: white; font-family: 'Nunito', sans-serif; font-size: 14px;
    font-weight: 700; color: #777; cursor: pointer; transition: all 0.2s;
  }
  .action-btn:hover { border-color: #FFB347; color: #FFB347; transform: translateY(-1px); }
  .action-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .action-btn.primary {
    background: linear-gradient(135deg, #FFB347, #FF6B6B); border-color: transparent;
    color: white; box-shadow: 0 4px 14px #FF6B6B35;
  }
  .action-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 6px 18px #FF6B6B45; color: white; border-color: transparent; }
  .action-btn.copied { background: #CAFFBF; border-color: #52B788; color: #52B788; }
  .action-btn.stop { background: #FFF0F0; border-color: #FFB3B3; color: #E53E3E; }

  .regen-card {
    margin-top: 20px; background: white; border: 2px solid #F0E6D3; border-radius: 20px;
    padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
    box-shadow: 4px 4px 0 #F0E6D3;
  }
  .regen-title { font-size: 15px; font-weight: 800; color: #333; margin-bottom: 3px; }
  .regen-sub { font-size: 13px; color: #AAA; font-weight: 600; }
  .regen-btn {
    flex-shrink: 0; padding: 11px 22px; border-radius: 50px;
    border: 2px solid #BDE0FE; background: #EDF6FF;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; color: #4EA8DE;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .regen-btn:hover { background: #4EA8DE; color: white; border-color: #4EA8DE; transform: translateY(-1px); }

  .ad-placeholder {
    margin-top: 28px; background: #F8F3ED; border: 2px dashed #E0D5C8;
    border-radius: 16px; padding: 20px; text-align: center;
  }
  .ad-label { font-size: 11px; font-weight: 700; color: #CCC; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
  .ad-box { height: 80px; display: flex; align-items: center; justify-content: center; color: #DDD; font-size: 13px; font-weight: 600; }

  @media (max-width: 500px) {
    .card-header { flex-direction: column; }
    .essay-body { padding: 20px; }
    .action-bar { padding: 16px 20px; }
    .regen-card { flex-direction: column; align-items: flex-start; }
  }
`;

// ─── 메인 컴포넌트 ───────────────────────────────────────────
export default function ResultPage({ formData, onBack }) {
  const { generate, essay, isLoading, isDone, error, reset, stop } = useEssayGenerate();
  const bodyRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // 페이지 진입 시 자동 생성
  useEffect(() => {
    if (formData) generate(formData);
  }, []);

  // 스트리밍 중 자동 스크롤
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [essay]);

  const handleCopy = () => {
    navigator.clipboard.writeText(essay).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([essay], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `essay_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegen = () => {
    reset();
    if (formData) generate(formData);
  };

  const typeLabel = formData?.type === "academic" ? "📚 학술/논문형" : "🌏 영어 에세이";
  const langLabel = formData?.language === "korean" ? "🇰🇷 한국어" : "🇺🇸 English";

  // useState import 누락 방지용 임시 선언
  const [, forceRender] = useState(0);

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="container">
          {/* Top bar */}
          <div className="topbar">
            <button className="back-btn" onClick={onBack}>← 다시 입력</button>
            <div className="logo-small">✍️ EssayMate</div>
            <div style={{ width: 90 }} />
          </div>

          {/* Meta tags */}
          <div className="meta-bar">
            <div className="meta-tag">{typeLabel}</div>
            <div className="meta-tag">{langLabel}</div>
            {formData?.length && <div className="meta-tag">📏 {formData.length}단어 목표</div>}
            {formData?.citation && formData.citation !== "none" && (
              <div className="meta-tag">📎 {formData.citation.toUpperCase()}</div>
            )}
          </div>

          {/* Result card */}
          <div className="result-card">
            <div className="card-header">
              <div>
                <div className="essay-label">
                  {isLoading ? "⏳ 생성 중..." : isDone ? "✨ 생성 완료" : "📄 에세이"}
                </div>
                <div className="essay-title">
                  {formData?.topic || "에세이"}
                </div>
              </div>
              <div className={`generating-badge ${isDone ? "done" : ""}`}>
                <div className="badge-icon">{isLoading ? "⚡" : isDone ? "✓" : "📝"}</div>
                <div className="badge-label">{isLoading ? "생성 중" : isDone ? "완료!" : "대기"}</div>
              </div>
            </div>

            <div className="essay-body" ref={bodyRef}>
              {/* 에러 */}
              {error && <div className="error-box">⚠️ {error}</div>}

              {/* 스켈레톤 (시작 전) */}
              {isLoading && !essay && (
                <div>
                  {[100, 85, 90, 70, 95, 60].map((w, i) => (
                    <div key={i} className="skeleton-line" style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              )}

              {/* 에세이 텍스트 + 커서 */}
              {essay && (
                <div className="essay-text">
                  {essay}
                  {isLoading && <span className="cursor" />}
                </div>
              )}
            </div>

            {/* Action bar */}
            <div className="action-bar">
              {isLoading ? (
                <button className="action-btn stop" onClick={stop}>⏹ 중단</button>
              ) : (
                <>
                  <button
                    className={`action-btn ${copied ? "copied" : "primary"}`}
                    onClick={handleCopy}
                    disabled={!essay}
                  >
                    {copied ? "✓ 복사됨!" : "📋 전체 복사"}
                  </button>
                  <button className="action-btn" onClick={handleDownload} disabled={!essay}>
                    📄 TXT 저장
                  </button>
                  <button className="action-btn" onClick={() => window.print()} disabled={!essay}>
                    🖨️ 인쇄
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Regenerate */}
          {isDone && !isLoading && (
            <div className="regen-card">
              <div>
                <div className="regen-title">마음에 안 드세요?</div>
                <div className="regen-sub">같은 주제로 다시 생성할 수 있어요</div>
              </div>
              <button className="regen-btn" onClick={handleRegen}>🔄 다시 생성하기</button>
            </div>
          )}

          {/* Coupa Partners Banner */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "40px auto",
            padding: "20px",
            background: "white",
            border: "2px solid #F0E6D3",
            borderRadius: "24px",
            maxWidth: "320px",
            boxShadow: "4px 4px 0 #F0E6D3"
          }}>
            <iframe 
              src="https://coupa.ng/cl73XG" 
              width="120" 
              height="240" 
              frameBorder="0" 
              scrolling="no" 
              referrerPolicy="unsafe-url" 
              browsingtopics
            ></iframe>
            <p style={{
              fontSize: "11px",
              color: "#888",
              textAlign: "center",
              marginTop: "12px",
              lineHeight: "1.4",
              wordBreak: "keep-all"
            }}>
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
