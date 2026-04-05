// hooks/useEssayGenerate.js
// 사용법: const { generate, essay, isLoading, error, reset } = useEssayGenerate();

import { useState, useRef, useCallback } from "react";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8787";

export function useEssayGenerate() {
  const [essay, setEssay] = useState("");         // 생성된 에세이 텍스트
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);                  // 중단 제어

  const reset = useCallback(() => {
    setEssay("");
    setIsLoading(false);
    setIsDone(false);
    setError(null);
  }, []);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  const generate = useCallback(async (formData) => {
    // 이전 요청 중단
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    reset();
    setIsLoading(true);

    try {
      const response = await fetch(`${WORKER_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "생성 중 오류가 발생했습니다.");
      }

      // SSE 스트림 파싱
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // 마지막 불완전한 줄은 버퍼에 유지

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);

            // Gemini SSE 이벤트 처리
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (text) {
              setEssay((prev) => prev + text);
            }

            // 생성 완료 체크
            const finishReason = parsed.candidates?.[0]?.finishReason;
            if (finishReason && finishReason !== "FINISH_REASON_UNSPECIFIED") {
              setIsDone(true);
            }
          } catch {
            // JSON 파싱 실패 무시 (ping 등 비데이터 이벤트)
          }
        }
      }

      setIsDone(true);
    } catch (err) {
      if (err.name === "AbortError") {
        // 사용자가 중단한 경우
        setIsDone(true);
      } else {
        setError(err.message || "알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  return { generate, essay, isLoading, isDone, error, reset, stop };
}
