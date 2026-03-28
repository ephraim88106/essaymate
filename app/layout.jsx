export const metadata = {
  title: 'EssayMate - AI 에세이 자동 생성',
  description: '주제만 입력하면 30초 안에 학술 논문형·영어 에세이를 완성해드려요. 완전 무료!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* Google AdSense - 승인 후 아래 주석 해제하고 ca-pub-XXXXX 변경 */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
