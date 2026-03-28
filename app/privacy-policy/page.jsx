"use client";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Nunito:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #FFF8F0; }

  .blobs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.22; }
  .b1 { width: 400px; height: 400px; background: #BDE0FE; top: -100px; right: -80px; }
  .b2 { width: 300px; height: 300px; background: #CAFFBF; bottom: -60px; left: -60px; }

  nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px;
    background: rgba(255,248,240,0.88); backdrop-filter: blur(16px);
    border-bottom: 1.5px solid rgba(240,230,211,0.7);
  }
  .nav-logo {
    font-family: 'Gaegu', cursive; font-size: 20px; font-weight: 700; color: #333;
    text-decoration: none; display: flex; align-items: center; gap: 6px;
  }
  .nav-back {
    display: flex; align-items: center; gap: 6px;
    background: white; border: 2px solid #E8DDD0; border-radius: 50px; padding: 7px 16px;
    font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700; color: #888;
    cursor: pointer; transition: all 0.2s; box-shadow: 2px 2px 0 #E8DDD0; text-decoration: none;
  }
  .nav-back:hover { border-color: #4EA8DE; color: #4EA8DE; }

  .container {
    position: relative; z-index: 1;
    max-width: 760px; margin: 0 auto; padding: 56px 24px 100px;
  }

  .page-header { margin-bottom: 44px; }
  .page-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    background: white; border: 2px solid #BDE0FE; border-radius: 50px;
    padding: 6px 16px; font-size: 12px; font-weight: 800; color: #4EA8DE;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px;
    box-shadow: 2px 2px 0 #BDE0FE;
  }
  .page-title {
    font-family: 'Gaegu', cursive; font-size: 42px; font-weight: 700;
    color: #222; margin-bottom: 12px; line-height: 1.2;
  }
  .page-meta { font-size: 14px; font-weight: 600; color: #AAA; }

  /* 요약 카드 */
  .summary-card {
    background: linear-gradient(135deg, #EDF6FF, #F0FFF4);
    border: 2px solid #BDE0FE; border-radius: 20px; padding: 24px 28px;
    margin-bottom: 36px; box-shadow: 4px 4px 0 #BDE0FE;
  }
  .summary-title { font-size: 14px; font-weight: 800; color: #4EA8DE; margin-bottom: 14px; }
  .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .summary-item {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 13px; font-weight: 700; color: #555; line-height: 1.5;
  }
  .summary-emoji { flex-shrink: 0; font-size: 16px; }

  .toc-card {
    background: #FDFAF6; border: 2px solid #F0E6D3; border-radius: 20px;
    padding: 20px 24px; margin-bottom: 36px;
  }
  .toc-title { font-size: 13px; font-weight: 800; color: #BBB; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px; }
  .toc-list { list-style: none; display: flex; flex-direction: column; gap: 7px; }
  .toc-item a {
    font-size: 14px; font-weight: 700; color: #888; text-decoration: none;
    display: flex; align-items: center; gap: 7px; transition: color 0.2s;
  }
  .toc-item a:hover { color: #4EA8DE; }
  .toc-num {
    width: 22px; height: 22px; border-radius: 50%; background: #EDF6FF;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #4EA8DE; flex-shrink: 0;
  }

  .section {
    background: white; border: 2px solid #F0E6D3; border-radius: 24px;
    padding: 32px; margin-bottom: 20px; box-shadow: 4px 4px 0 #F0E6D3;
  }
  .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .section-num {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #4EA8DE, #3182CE);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Gaegu', cursive; font-size: 18px; font-weight: 700; color: white;
  }
  .section-title { font-size: 18px; font-weight: 800; color: #222; }

  .section-body { font-size: 14px; font-weight: 600; color: #555; line-height: 1.85; }
  .section-body p { margin-bottom: 12px; }
  .section-body p:last-child { margin-bottom: 0; }
  .section-body ul { padding-left: 20px; margin: 10px 0; }
  .section-body li { margin-bottom: 7px; }
  .section-body strong { color: #333; font-weight: 800; }

  .info-table {
    width: 100%; border-collapse: collapse; margin: 14px 0;
    font-size: 13px;
  }
  .info-table th {
    background: #F0F8FF; padding: 10px 14px; text-align: left;
    font-weight: 800; color: #4EA8DE; border: 1.5px solid #BDE0FE;
    font-size: 12px; letter-spacing: 0.05em;
  }
  .info-table td {
    padding: 10px 14px; border: 1.5px solid #E8F4FD;
    font-weight: 600; color: #555; vertical-align: top;
  }
  .info-table tr:nth-child(even) td { background: #FAFCFF; }

  .highlight-box {
    background: #EDF6FF; border: 2px solid #BDE0FE; border-radius: 14px;
    padding: 14px 18px; margin: 14px 0;
    font-size: 13px; font-weight: 700; color: #2B6CB0;
    display: flex; align-items: flex-start; gap: 8px;
  }

  .green-box {
    background: #F0FFF4; border: 2px solid #9AE6B4; border-radius: 14px;
    padding: 14px 18px; margin: 14px 0;
    font-size: 13px; font-weight: 700; color: #276749;
    display: flex; align-items: flex-start; gap: 8px;
  }

  .contact-card {
    background: linear-gradient(135deg, #EDF6FF, #F0FFF4);
    border: 2px solid #BDE0FE; border-radius: 20px;
    padding: 24px 28px; margin-top: 8px;
    display: flex; align-items: center; gap: 16px;
  }
  .contact-icon { font-size: 32px; flex-shrink: 0; }
  .contact-title { font-size: 15px; font-weight: 800; color: #333; margin-bottom: 4px; }
  .contact-email { font-size: 14px; font-weight: 700; color: #4EA8DE; }

  footer {
    position: relative; z-index: 1;
    border-top: 2px solid #F0E6D3; padding: 24px 40px;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  }
  .footer-logo { font-family: 'Gaegu', cursive; font-size: 16px; font-weight: 700; color: #AAA; }
  .footer-links { display: flex; gap: 20px; }
  .footer-link { font-size: 13px; font-weight: 700; color: #CCC; text-decoration: none; transition: color 0.2s; }
  .footer-link:hover { color: #4EA8DE; }

  @media (max-width: 500px) {
    nav { padding: 14px 20px; }
    .page-title { font-size: 32px; }
    .section { padding: 22px 18px; }
    .summary-grid { grid-template-columns: 1fr; }
    footer { flex-direction: column; text-align: center; }
  }
`;

const sections = [
  {
    id: "collect",
    title: "수집하는 개인정보",
    content: (
      <>
        <p>EssayMate는 회원가입이 없는 무료 서비스로, 최소한의 정보만 처리합니다.</p>
        <table className="info-table">
          <thead>
            <tr><th>수집 항목</th><th>수집 목적</th><th>보유 기간</th></tr>
          </thead>
          <tbody>
            <tr><td>에세이 생성 요청 내용<br/>(주제, 설정값)</td><td>AI 에세이 생성 서비스 제공</td><td>요청 처리 후 즉시 삭제</td></tr>
            <tr><td>IP 주소</td><td>서비스 악용 방지, 보안</td><td>30일</td></tr>
            <tr><td>브라우저 쿠키 (Google AdSense)</td><td>맞춤형 광고 제공</td><td>Google 정책에 따름</td></tr>
          </tbody>
        </table>
        <div className="green-box">
          ✅ 이름, 이메일, 전화번호 등 식별 가능한 개인정보는 수집하지 않습니다.
        </div>
      </>
    ),
  },
  {
    id: "use",
    title: "개인정보 이용 목적",
    content: (
      <>
        <p>수집된 정보는 다음의 목적으로만 사용됩니다:</p>
        <ul>
          <li>AI 에세이 생성 서비스 제공</li>
          <li>서비스 품질 개선 및 통계 분석 (익명 처리 후)</li>
          <li>서비스 악용 방지 및 보안 유지</li>
          <li>광고 서비스 제공 (Google AdSense)</li>
        </ul>
        <p>수집된 개인정보는 위 목적 외에는 사용하지 않으며, 목적이 변경될 경우 사전에 동의를 구합니다.</p>
      </>
    ),
  },
  {
    id: "third",
    title: "제3자 제공 및 위탁",
    content: (
      <>
        <p>EssayMate는 다음의 제3자 서비스를 사용합니다:</p>
        <table className="info-table">
          <thead>
            <tr><th>업체</th><th>목적</th><th>개인정보처리방침</th></tr>
          </thead>
          <tbody>
            <tr><td>Anthropic (Claude API)</td><td>AI 에세이 생성</td><td>anthropic.com/privacy</td></tr>
            <tr><td>Cloudflare</td><td>서버 인프라, CDN</td><td>cloudflare.com/privacypolicy</td></tr>
            <tr><td>Google AdSense</td><td>광고 서비스</td><td>policies.google.com/privacy</td></tr>
          </tbody>
        </table>
        <div className="highlight-box">
          ℹ️ 에세이 생성을 위해 입력하신 주제 및 설정은 Anthropic API로 전송됩니다. 민감한 개인정보는 입력하지 마세요.
        </div>
      </>
    ),
  },
  {
    id: "cookies",
    title: "쿠키 및 광고",
    content: (
      <>
        <p>본 서비스는 Google AdSense를 통해 광고를 제공합니다. Google은 쿠키를 사용하여 사용자의 관심사 기반 맞춤 광고를 제공할 수 있습니다.</p>
        <p>맞춤 광고를 원하지 않으시는 경우 다음 방법으로 설정을 변경할 수 있습니다:</p>
        <ul>
          <li>Google 광고 설정: <strong>adssettings.google.com</strong></li>
          <li>브라우저 설정에서 쿠키 차단</li>
          <li>광고 차단 확장 프로그램 사용</li>
        </ul>
      </>
    ),
  },
  {
    id: "rights",
    title: "이용자의 권리",
    content: (
      <>
        <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다:</p>
        <ul>
          <li><strong>열람권:</strong> 본인에 관한 개인정보 처리 현황 열람 요청</li>
          <li><strong>정정·삭제권:</strong> 개인정보의 정정 또는 삭제 요청</li>
          <li><strong>처리 정지권:</strong> 개인정보 처리의 정지 요청</li>
        </ul>
        <p>권리 행사는 아래 문의처로 연락하시면 지체 없이 처리해 드립니다.</p>
        <div className="green-box">
          ✅ 본 서비스는 로그인 없이 이용되므로 별도로 저장된 개인정보가 없습니다. 광고 관련 데이터는 Google 계정 설정에서 직접 관리하실 수 있습니다.
        </div>
      </>
    ),
  },
  {
    id: "security",
    title: "개인정보 보호 조치",
    content: (
      <>
        <p>서비스는 개인정보 보호를 위해 다음의 기술적·관리적 조치를 취하고 있습니다:</p>
        <ul>
          <li>모든 데이터 전송 시 HTTPS(TLS) 암호화 적용</li>
          <li>API 키 등 민감 정보는 환경변수로 관리, 소스코드에 미포함</li>
          <li>Cloudflare를 통한 DDoS 방어 및 보안 필터링</li>
          <li>요청 처리 후 입력 데이터 즉시 삭제</li>
        </ul>
      </>
    ),
  },
  {
    id: "contact",
    title: "개인정보 보호 책임자 및 문의",
    content: (
      <>
        <p>개인정보 처리에 관한 문의, 불만 처리, 피해 구제 등은 아래 담당자에게 연락해 주세요.</p>
        <div className="contact-card">
          <div className="contact-icon">🛡️</div>
          <div>
            <div className="contact-title">개인정보 보호 책임자 · EssayMate 운영팀</div>
            <div className="contact-email">privacy@essaymate.co.kr</div>
          </div>
        </div>
        <p style={{ marginTop: 16 }}>
          개인정보 침해 관련 신고나 상담은 아래 기관에도 문의하실 수 있습니다:<br />
          <strong>개인정보침해신고센터</strong> privacy.kisa.or.kr (국번없이 118)<br />
          <strong>현행 방침 시행일: 2026년 1월 1일</strong>
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <style>{styles}</style>
      <div>
        <div className="blobs">
          <div className="blob b1" /><div className="blob b2" />
        </div>

        <nav>
          <a href="/" className="nav-logo">✍️ EssayMate</a>
          <a href="/" className="nav-back">← 홈으로</a>
        </nav>

        <div className="container">
          <div className="page-header">
            <div className="page-eyebrow">🔒 Privacy</div>
            <h1 className="page-title">개인정보처리방침</h1>
            <div className="page-meta">최종 업데이트: 2026년 1월 1일</div>
          </div>

          {/* 요약 카드 */}
          <div className="summary-card">
            <div className="summary-title">🗒️ 한눈에 보는 요약</div>
            <div className="summary-grid">
              <div className="summary-item"><span className="summary-emoji">🚫</span>이름·이메일 등 개인정보 수집 안 함</div>
              <div className="summary-item"><span className="summary-emoji">🔐</span>모든 전송 데이터 HTTPS 암호화</div>
              <div className="summary-item"><span className="summary-emoji">🗑️</span>요청 처리 후 입력 데이터 즉시 삭제</div>
              <div className="summary-item"><span className="summary-emoji">📢</span>Google AdSense 광고 쿠키 사용</div>
            </div>
          </div>

          {/* 목차 */}
          <div className="toc-card">
            <div className="toc-title">목차</div>
            <ul className="toc-list">
              {sections.map((s, i) => (
                <li className="toc-item" key={s.id}>
                  <a href={`#${s.id}`}>
                    <span className="toc-num">{i + 1}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 섹션들 */}
          {sections.map((s, i) => (
            <div className="section" key={s.id} id={s.id}>
              <div className="section-header">
                <div className="section-num">{i + 1}</div>
                <div className="section-title">{s.title}</div>
              </div>
              <div className="section-body">{s.content}</div>
            </div>
          ))}
        </div>

        <footer>
          <div className="footer-logo">✍️ EssayMate</div>
          <div className="footer-links">
            <a href="/privacy-policy" className="footer-link">개인정보처리방침</a>
            <a href="/terms" className="footer-link">이용약관</a>
          </div>
        </footer>
      </div>
    </>
  );
}
