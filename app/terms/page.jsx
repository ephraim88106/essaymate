"use client";
import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Nunito:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #FFF8F0; }

  .blobs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.22; }
  .b1 { width: 400px; height: 400px; background: #FFD6A5; top: -100px; right: -80px; }
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
  .nav-back:hover { border-color: #FFB347; color: #FFB347; }

  .container {
    position: relative; z-index: 1;
    max-width: 760px; margin: 0 auto; padding: 56px 24px 100px;
  }

  .page-header { margin-bottom: 44px; }
  .page-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    background: white; border: 2px solid #F0E6D3; border-radius: 50px;
    padding: 6px 16px; font-size: 12px; font-weight: 800; color: #FFB347;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px;
    box-shadow: 2px 2px 0 #F0E6D3;
  }
  .page-title {
    font-family: 'Gaegu', cursive; font-size: 42px; font-weight: 700;
    color: #222; margin-bottom: 12px; line-height: 1.2;
  }
  .page-meta { font-size: 14px; font-weight: 600; color: #AAA; }

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
  .toc-item a:hover { color: #FFB347; }
  .toc-num {
    width: 22px; height: 22px; border-radius: 50%; background: #F0E6D3;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #BBB; flex-shrink: 0;
  }

  .section {
    background: white; border: 2px solid #F0E6D3; border-radius: 24px;
    padding: 32px; margin-bottom: 20px;
    box-shadow: 4px 4px 0 #F0E6D3;
  }
  .section-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
  }
  .section-num {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #FFB347, #FF6B6B);
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

  .highlight-box {
    background: #FFF8E8; border: 2px solid #FFD6A5; border-radius: 14px;
    padding: 14px 18px; margin: 14px 0;
    font-size: 13px; font-weight: 700; color: #B7791F;
    display: flex; align-items: flex-start; gap: 8px;
  }

  .contact-card {
    background: linear-gradient(135deg, #FFF3E0, #FFF8F0);
    border: 2px solid #FFD6A5; border-radius: 20px;
    padding: 24px 28px; margin-top: 8px;
    display: flex; align-items: center; gap: 16px;
  }
  .contact-icon { font-size: 32px; flex-shrink: 0; }
  .contact-title { font-size: 15px; font-weight: 800; color: #333; margin-bottom: 4px; }
  .contact-email { font-size: 14px; font-weight: 700; color: #FFB347; }

  footer {
    position: relative; z-index: 1;
    border-top: 2px solid #F0E6D3; padding: 24px 40px;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  }
  .footer-logo { font-family: 'Gaegu', cursive; font-size: 16px; font-weight: 700; color: #AAA; }
  .footer-links { display: flex; gap: 20px; }
  .footer-link { font-size: 13px; font-weight: 700; color: #CCC; text-decoration: none; transition: color 0.2s; }
  .footer-link:hover { color: #FFB347; }

  @media (max-width: 500px) {
    nav { padding: 14px 20px; }
    .page-title { font-size: 32px; }
    .section { padding: 22px 18px; }
    footer { flex-direction: column; text-align: center; }
  }
`;

const sections = [
  {
    id: "service",
    title: "서비스 개요",
    content: (
      <>
        <p>EssayMate(이하 "서비스")는 인공지능 기술을 활용하여 사용자의 요청에 따라 에세이를 자동 생성하는 무료 웹 서비스입니다.</p>
        <p>본 이용약관은 서비스 이용에 관한 조건 및 절차, 이용자와 운영자 간의 권리·의무 관계를 규정합니다. 서비스를 이용함으로써 본 약관에 동의하는 것으로 간주합니다.</p>
      </>
    ),
  },
  {
    id: "usage",
    title: "서비스 이용 조건",
    content: (
      <>
        <p>서비스는 만 14세 이상 누구나 무료로 이용할 수 있으며, 별도의 회원가입 없이 사용 가능합니다.</p>
        <p>다음의 행위는 엄격히 금지됩니다:</p>
        <ul>
          <li>타인의 저작권, 초상권, 개인정보를 침해하는 내용의 에세이 생성 요청</li>
          <li>허위 사실 유포, 명예훼손, 혐오 표현을 포함한 콘텐츠 생성 요청</li>
          <li>서비스의 자동화된 대량 요청 (크롤링, 스크래핑 등)</li>
          <li>서비스 시스템에 대한 해킹, 무단 접근 시도</li>
          <li>학교·기관의 제출 규정을 위반하여 생성된 에세이를 본인의 창작물로 제출하는 행위</li>
        </ul>
        <div className="highlight-box">
          ⚠️ AI가 생성한 에세이를 학교 과제나 논문으로 제출할 경우, 해당 기관의 규정 위반 여부는 이용자 본인이 확인하고 책임져야 합니다.
        </div>
      </>
    ),
  },
  {
    id: "ip",
    title: "지적재산권",
    content: (
      <>
        <p>서비스의 로고, 디자인, 소스코드, 상표 등 일체의 지적재산권은 운영자에게 귀속됩니다.</p>
        <p>AI가 생성한 에세이 결과물에 대한 저작권은 현행 법률에 따라 명확하지 않을 수 있습니다. 생성된 결과물의 활용에 따른 법적 책임은 이용자 본인에게 있습니다.</p>
        <p>서비스는 이용자가 입력한 주제 및 설정 정보를 서비스 품질 향상 목적으로 익명 처리하여 활용할 수 있습니다.</p>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "면책 조항",
    content: (
      <>
        <p>서비스가 생성하는 에세이는 AI 모델에 의해 자동 생성되며, 다음 사항을 보장하지 않습니다:</p>
        <ul>
          <li>생성된 내용의 정확성, 사실성, 완전성</li>
          <li>인용된 출처 및 참고문헌의 실제 존재 여부</li>
          <li>표절 검사 통과 여부</li>
          <li>특정 학교·기관의 제출 기준 충족 여부</li>
        </ul>
        <div className="highlight-box">
          ⚠️ 생성된 에세이에 포함된 참고문헌은 가상의 출처일 수 있습니다. 실제 제출 전 반드시 내용을 검토하고 사실 확인을 하시기 바랍니다.
        </div>
        <p>서비스 이용으로 인해 발생하는 직·간접적 손해에 대해 운영자는 법률이 허용하는 최대 범위 내에서 책임을 지지 않습니다.</p>
      </>
    ),
  },
  {
    id: "ads",
    title: "광고 및 제3자 서비스",
    content: (
      <>
        <p>본 서비스는 Google AdSense를 통해 광고를 게재합니다. 광고는 Google의 개인화 광고 정책에 따라 표시될 수 있으며, 이에 대한 자세한 사항은 Google 개인정보처리방침을 참고하시기 바랍니다.</p>
        <p>서비스 내 제3자 링크 또는 광고를 통해 이동한 외부 사이트의 콘텐츠 및 개인정보 처리에 대해 운영자는 책임을 지지 않습니다.</p>
      </>
    ),
  },
  {
    id: "change",
    title: "약관 변경",
    content: (
      <>
        <p>운영자는 필요에 따라 본 약관을 변경할 수 있으며, 변경 시 서비스 내 공지사항을 통해 사전 안내합니다.</p>
        <p>변경된 약관은 공지 후 7일이 경과한 시점부터 효력이 발생합니다. 변경 후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.</p>
        <p><strong>현행 약관 시행일: 2026년 1월 1일</strong></p>
      </>
    ),
  },
  {
    id: "contact",
    title: "문의",
    content: (
      <>
        <p>약관과 관련한 문의사항은 아래로 연락해 주세요.</p>
        <div className="contact-card">
          <div className="contact-icon">📮</div>
          <div>
            <div className="contact-title">EssayMate 운영팀</div>
            <div className="contact-email">contact@essaymate.co.kr</div>
          </div>
        </div>
      </>
    ),
  },
];

export default function TermsPage() {
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
            <div className="page-eyebrow">📋 Legal</div>
            <h1 className="page-title">이용약관</h1>
            <div className="page-meta">최종 업데이트: 2026년 1월 1일</div>
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
