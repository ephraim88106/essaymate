// Cloudflare Workers - Essay Generation API
// 배포: wrangler deploy
// 환경변수: ANTHROPIC_API_KEY (wrangler secret put ANTHROPIC_API_KEY)

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // 배포 후 실제 도메인으로 변경
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ─── 프롬프트 빌더 ───────────────────────────────────────────
function buildSystemPrompt(type, language) {
  if (type === "academic") {
    return `당신은 한국어 학술 논문 전문 작성 AI입니다.
다음 규칙을 반드시 따르세요:
- 서론 / 본론(2~3개 소제목) / 결론 구조로 작성
- 객관적이고 격식 있는 학술 문어체 사용
- 수동태 및 피동 표현 적절히 활용
- 각 섹션은 ## 소제목 형식으로 구분
- 참고문헌이 요청된 경우 마지막에 References 섹션 추가
- 가상의 출처를 사용할 경우 "[주의: 가상 출처입니다]" 표시
- 마크다운 형식으로 출력`;
  }

  if (type === "english") {
    return `You are an expert academic English essay writer.
Follow these rules strictly:
- Structure: Introduction (with clear thesis statement) / Body paragraphs / Conclusion
- Use formal academic English with varied sentence structures
- Include clear topic sentences and transition words
- Each section separated with ## heading format
- Avoid contractions and colloquial expressions
- If citation style is requested, add a References section at the end
- If using hypothetical sources, mark them with "[Note: hypothetical source]"
- Output in markdown format`;
  }

  // fallback
  return `You are a professional essay writer. Write a well-structured essay in markdown format.`;
}

function buildUserPrompt({ topic, type, language, length, citation, field, extraNote }) {
  const langLabel = language === "korean" ? "한국어" : "English";
  const typeLabel = type === "academic" ? "학술/논문형" : "영어 에세이";
  const citationText = citation && citation !== "none" ? `인용 스타일: ${citation.toUpperCase()}` : "인용 스타일 없음";
  const fieldText = field ? `학문 분야: ${field}` : "";
  const extraText = extraNote ? `추가 지시사항: ${extraNote}` : "";

  return `다음 조건으로 에세이를 작성해주세요:

주제: ${topic}
유형: ${typeLabel}
언어: ${langLabel}
목표 길이: 약 ${length}단어
${citationText}
${fieldText}
${extraText}

위 조건에 맞게 완성도 높은 에세이를 작성해주세요.`;
}

// ─── 입력 유효성 검사 ────────────────────────────────────────
function validateInput(body) {
  const { topic, type, language, length } = body;

  if (!topic || topic.trim().length < 3) {
    return "주제를 3자 이상 입력해주세요.";
  }
  if (!["academic", "english"].includes(type)) {
    return "올바른 에세이 유형을 선택해주세요.";
  }
  if (!["korean", "english"].includes(language)) {
    return "올바른 언어를 선택해주세요.";
  }
  if (![500, 1000, 2000, 3000].includes(Number(length))) {
    return "올바른 길이를 선택해주세요.";
  }
  return null;
}

// ─── 메인 핸들러 ─────────────────────────────────────────────
export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // POST만 허용
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // URL 라우팅
    const url = new URL(request.url);
    if (url.pathname !== "/api/generate") {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // 요청 파싱
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // 유효성 검사
    const validationError = validateInput(body);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const { topic, type, language, length, citation, field, extraNote } = body;

    // Claude API 스트리밍 요청
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        stream: true,
        system: buildSystemPrompt(type, language),
        messages: [
          {
            role: "user",
            content: buildUserPrompt({ topic, type, language, length, citation, field, extraNote }),
          },
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error("Anthropic API error:", errText);
      return new Response(JSON.stringify({ error: "AI 생성 중 오류가 발생했습니다." }), {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // SSE 스트림을 그대로 클라이언트에 전달
    return new Response(anthropicResponse.body, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  },
};
