"use client";
import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Nunito:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Nunito', sans-serif;
    background: #FFF8F0;
    min-height: 100vh;
  }

  .page {
    min-height: 100vh;
    background: #FFF8F0;
    position: relative;
    overflow: hidden;
  }

  /* Decorative blobs */
  .blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
  }
  .blob-1 { width: 400px; height: 400px; background: #FFD6A5; top: -100px; right: -80px; }
  .blob-2 { width: 300px; height: 300px; background: #CAFFBF; bottom: -60px; left: -60px; }
  .blob-3 { width: 200px; height: 200px; background: #BDE0FE; top: 40%; left: 30%; }

  .container {
    max-width: 720px;
    margin: 0 auto;
    padding: 40px 24px 80px;
    position: relative;
    z-index: 1;
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 40px;
    animation: fadeDown 0.6s ease both;
  }

  .logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: white;
    border: 2px solid #FFB347;
    border-radius: 50px;
    padding: 8px 20px;
    margin-bottom: 20px;
    box-shadow: 3px 3px 0 #FFB347;
  }

  .logo-emoji { font-size: 22px; }
  .logo-text {
    font-family: 'Gaegu', cursive;
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }

  .title {
    font-family: 'Gaegu', cursive;
    font-size: 42px;
    font-weight: 700;
    color: #222;
    line-height: 1.2;
    margin-bottom: 10px;
  }

  .title span {
    background: linear-gradient(120deg, #FFB347, #FF6B6B);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 16px;
    color: #777;
    font-weight: 600;
  }

  /* Card */
  .card {
    background: white;
    border-radius: 28px;
    border: 2px solid #F0E6D3;
    padding: 36px;
    box-shadow: 6px 6px 0 #F0E6D3;
    animation: fadeUp 0.7s ease both;
    animation-delay: 0.1s;
  }

  /* Step indicator */
  .steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 32px;
  }

  .step {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 800;
    border: 2px solid #E0D5C8;
    color: #BBB;
    background: white;
    transition: all 0.3s;
  }

  .step.active {
    background: #FFB347;
    border-color: #FFB347;
    color: white;
    box-shadow: 0 0 0 4px #FFB34730;
  }

  .step.done {
    background: #CAFFBF;
    border-color: #52B788;
    color: #52B788;
  }

  .step-line {
    width: 40px;
    height: 2px;
    background: #E0D5C8;
    border-radius: 2px;
  }

  .step-label {
    font-size: 12px;
    color: #AAA;
    font-weight: 700;
    text-align: center;
    margin-top: 6px;
  }

  /* Section */
  .section {
    margin-bottom: 28px;
  }

  .section-label {
    font-size: 13px;
    font-weight: 800;
    color: #AAA;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  /* Toggle buttons */
  .toggle-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .toggle-btn {
    padding: 10px 20px;
    border-radius: 50px;
    border: 2px solid #E8DDD0;
    background: white;
    font-family: 'Nunito', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #888;
    cursor: pointer;
    transition: all 0.2s;
  }

  .toggle-btn:hover {
    border-color: #FFB347;
    color: #FFB347;
    transform: translateY(-1px);
  }

  .toggle-btn.selected {
    background: #FFB347;
    border-color: #FFB347;
    color: white;
    box-shadow: 0 3px 10px #FFB34750;
    transform: translateY(-1px);
  }

  .toggle-btn.selected.green {
    background: #52B788;
    border-color: #52B788;
    box-shadow: 0 3px 10px #52B78850;
  }

  .toggle-btn.selected.blue {
    background: #4EA8DE;
    border-color: #4EA8DE;
    box-shadow: 0 3px 10px #4EA8DE50;
  }

  /* Text input */
  .text-input {
    width: 100%;
    padding: 16px 20px;
    border-radius: 16px;
    border: 2px solid #E8DDD0;
    font-family: 'Nunito', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #333;
    background: #FDFAF6;
    outline: none;
    transition: all 0.2s;
    resize: none;
  }

  .text-input:focus {
    border-color: #FFB347;
    background: white;
    box-shadow: 0 0 0 4px #FFB34720;
  }

  .text-input::placeholder { color: #CCC; }

  /* Length selector */
  .length-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .length-card {
    border: 2px solid #E8DDD0;
    border-radius: 16px;
    padding: 14px 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
  }

  .length-card:hover {
    border-color: #FFB347;
    transform: translateY(-2px);
  }

  .length-card.selected {
    border-color: #FF6B6B;
    background: #FFF0F0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px #FF6B6B30;
  }

  .length-num {
    font-family: 'Gaegu', cursive;
    font-size: 22px;
    font-weight: 700;
    color: #333;
  }

  .length-card.selected .length-num { color: #FF6B6B; }

  .length-unit {
    font-size: 11px;
    color: #AAA;
    font-weight: 700;
  }

  /* Optional section */
  .optional-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    margin-bottom: 16px;
    width: fit-content;
  }

  .optional-toggle span {
    font-size: 13px;
    font-weight: 800;
    color: #AAA;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .arrow {
    font-size: 11px;
    color: #CCC;
    transition: transform 0.2s;
  }

  .arrow.open { transform: rotate(90deg); }

  .optional-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    overflow: hidden;
    transition: all 0.3s;
  }

  .select-wrap {
    position: relative;
  }

  .styled-select {
    width: 100%;
    padding: 12px 36px 12px 16px;
    border-radius: 14px;
    border: 2px solid #E8DDD0;
    font-family: 'Nunito', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #555;
    background: #FDFAF6;
    appearance: none;
    cursor: pointer;
    outline: none;
    transition: all 0.2s;
  }

  .styled-select:focus {
    border-color: #FFB347;
    background: white;
  }

  .select-arrow {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 12px;
    color: #BBB;
  }

  /* Submit button */
  .submit-btn {
    width: 100%;
    padding: 18px;
    border-radius: 18px;
    border: none;
    background: linear-gradient(135deg, #FFB347, #FF6B6B);
    color: white;
    font-family: 'Gaegu', cursive;
    font-size: 22px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: 0 4px 20px #FF6B6B40;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 8px;
  }

  .submit-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px #FF6B6B50;
  }

  .submit-btn:active { transform: translateY(0); }

  .divider {
    height: 1px;
    background: #F0E6D3;
    margin: 24px 0;
  }

  /* Animations */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 500px) {
    .length-grid { grid-template-columns: repeat(2, 1fr); }
    .optional-content { grid-template-columns: 1fr; }
    .title { font-size: 32px; }
  }
`;

export default function EssayInputPage() {
  const [essayType, setEssayType] = useState("academic");
  const [language, setLanguage] = useState("korean");
  const [length, setLength] = useState(1000);
  const [topic, setTopic] = useState("");
  const [extraNote, setExtraNote] = useState("");
  const [showOptional, setShowOptional] = useState(false);
  const [citation, setCitation] = useState("");
  const [field, setField] = useState("");

  const lengths = [500, 1000, 2000, 3000];

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="container">
          {/* Header */}
          <div className="header">
            <div className="logo">
              <span className="logo-emoji">✍️</span>
              <span className="logo-text">EssayMate</span>
            </div>
            <div className="title">
              AI가 써주는<br /><span>완벽한 에세이</span>
            </div>
            <div className="subtitle">주제만 입력하면 30초 안에 완성돼요 🎉</div>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
            <div className="steps">
              <div className="step active">1</div>
              <div className="step-line" />
              <div className="step">2</div>
            </div>
            <div style={{ display: "flex", gap: "56px" }}>
              <div className="step-label" style={{ color: "#FFB347" }}>입력</div>
              <div className="step-label">결과</div>
            </div>
          </div>

          {/* Form Card */}
          <div className="card">

            {/* Essay Type */}
            <div className="section">
              <div className="section-label">📄 에세이 유형</div>
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${essayType === "academic" ? "selected" : ""}`}
                  onClick={() => setEssayType("academic")}
                >📚 학술/논문형</button>
                <button
                  className={`toggle-btn ${essayType === "english" ? "selected blue" : ""}`}
                  onClick={() => setEssayType("english")}
                >🌏 영어 에세이</button>
              </div>
            </div>

            {/* Language */}
            <div className="section">
              <div className="section-label">🌐 언어</div>
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${language === "korean" ? "selected green" : ""}`}
                  onClick={() => setLanguage("korean")}
                >🇰🇷 한국어</button>
                <button
                  className={`toggle-btn ${language === "english" ? "selected blue" : ""}`}
                  onClick={() => setLanguage("english")}
                >🇺🇸 English</button>
              </div>
            </div>

            <div className="divider" />

            {/* Topic */}
            <div className="section">
              <div className="section-label">💡 주제 입력</div>
              <textarea
                className="text-input"
                rows={3}
                placeholder={
                  essayType === "academic"
                    ? "예) 기후변화가 한국 농업에 미치는 영향"
                    : "예) The impact of social media on mental health"
                }
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>

            {/* Length */}
            <div className="section">
              <div className="section-label">📏 에세이 길이</div>
              <div className="length-grid">
                {lengths.map(l => (
                  <div
                    key={l}
                    className={`length-card ${length === l ? "selected" : ""}`}
                    onClick={() => setLength(l)}
                  >
                    <div className="length-num">{l.toLocaleString()}</div>
                    <div className="length-unit">단어</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider" />

            {/* Optional */}
            <div
              className="optional-toggle"
              onClick={() => setShowOptional(!showOptional)}
            >
              <span>⚙️ 추가 설정 (선택)</span>
              <span className={`arrow ${showOptional ? "open" : ""}`}>▶</span>
            </div>

            {showOptional && (
              <div className="optional-content" style={{ marginBottom: "20px" }}>
                <div className="select-wrap">
                  <select
                    className="styled-select"
                    value={citation}
                    onChange={e => setCitation(e.target.value)}
                  >
                    <option value="">인용 스타일 선택</option>
                    <option value="apa">APA</option>
                    <option value="mla">MLA</option>
                    <option value="chicago">Chicago</option>
                    <option value="none">없음</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
                <div className="select-wrap">
                  <select
                    className="styled-select"
                    value={field}
                    onChange={e => setField(e.target.value)}
                  >
                    <option value="">학문 분야 선택</option>
                    <option value="humanities">인문학</option>
                    <option value="social">사회과학</option>
                    <option value="science">자연과학</option>
                    <option value="engineering">공학</option>
                    <option value="arts">예술</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
                <div className="select-wrap" style={{ gridColumn: "1 / -1" }}>
                  <textarea
                    className="text-input"
                    rows={2}
                    placeholder="추가 지시사항 (예: 비판적 관점으로 작성해줘, 각주 포함 등)"
                    value={extraNote}
                    onChange={e => setExtraNote(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button className="submit-btn">
              <span>✨</span>
              <span>에세이 생성하기</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
