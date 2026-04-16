// ── 상태 ──
let state = {
  type: 'academic',
  lang: 'korean',
  len: 1000,
  topic: '',
  citation: '',
  field: '',
  extra: ''
};
let abortCtrl = null;
let essayText = '';
let isLoading = false;

const GEMMA_MODEL = 'gemma-4-26b-a4b-it';

// ── API 키 관리 ──
function openApiKeyModal() {
  const modal = document.getElementById('api-key-modal');
  modal.style.display = 'block';
  const input = document.getElementById('api-key-input');
  input.value = localStorage.getItem('gemini_api_key') || '';
}

function closeApiKeyModal() {
  document.getElementById('api-key-modal').style.display = 'none';
}

// 모달 배경 클릭 시 닫기
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('api-key-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeApiKeyModal();
    });
  }
});

function saveApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if (!key) {
    alert('API 키를 입력해주세요.');
    return;
  }
  localStorage.setItem('gemini_api_key', key);
  closeApiKeyModal();
  alert('API 키가 저장되었습니다!');
}

function getApiKey() {
  return localStorage.getItem('gemini_api_key');
}

// ── 페이지 전환 ──
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

// ── 토글 선택 ──
function selToggle(groupId, btn, cls) {
  const group = document.getElementById(groupId);
  group.querySelectorAll('.tog').forEach(b => b.className = 'tog');
  btn.className = 'tog ' + cls;
  if (groupId === 'tg-type') state.type = btn.dataset.val;
  if (groupId === 'tg-lang') state.lang = btn.dataset.val;
}

function selLen(el) {
  document.querySelectorAll('.len-card').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
  state.len = parseInt(el.dataset.val);
}

function toggleOpt() {
  const c = document.getElementById('opt-content');
  const a = document.getElementById('opt-arrow');
  c.classList.toggle('show');
  a.classList.toggle('open');
}

// ── 에세이 생성 시작 ──
function startGenerate() {
  const apiKey = getApiKey();
  if (!apiKey) {
    alert('먼저 API 키를 설정해주세요. 상단의 🔑 API 키 버튼을 클릭하세요.');
    openApiKeyModal();
    return;
  }

  const topic = document.getElementById('topic').value.trim();
  if (!topic || topic.length < 3) {
    alert('주제를 3자 이상 입력해주세요.');
    return;
  }
  state.topic = topic;
  state.citation = document.getElementById('citation').value;
  state.field = document.getElementById('field').value;
  state.extra = document.getElementById('extra').value;

  showPage('result');
  runGenerate();
}

function regenEssay() {
  document.getElementById('regen-card').style.display = 'none';
  runGenerate();
}

function goBack() {
  if (abortCtrl) abortCtrl.abort();
  essayText = '';
  showPage('form');
}

// ── 프롬프트 ──
function buildPrompts() {
  let system;
  if (state.type === 'academic') {
    system = `당신은 한국어 학술 논문 전문 작성 AI입니다. 반드시 서론/본론(2~3개 소제목)/결론 구조로 작성하고, 객관적 학술 문어체를 사용하세요. 각 섹션은 ## 소제목 형식으로 구분하세요. 가상 출처 사용 시 "[가상 출처]" 표시를 반드시 붙이세요.`;
  } else if (state.type === 'blog') {
    system = `당신은 전문 블로그 글 작성 AI입니다. 다음 규칙을 반드시 따르세요:
- 독자의 관심을 끄는 매력적인 제목(# 제목)으로 시작
- 도입부에서 독자의 공감을 이끌어내는 친근한 문체 사용
- 본문은 ## 소제목으로 2~4개 섹션으로 구분
- 핵심 내용은 **굵은 글씨**로 강조
- 중요한 포인트는 번호 목록이나 불릿 목록으로 정리
- 실용적인 팁, 예시, 경험담을 포함하여 가독성 높게 작성
- 마지막에 독자 참여를 유도하는 마무리 문장 포함
- SEO에 유리한 자연스러운 키워드 배치
- 마크다운 형식으로 출력
- 블로그 플랫폼(네이버, 티스토리 등)에 바로 복사 붙여넣기 할 수 있도록 깔끔하게 작성`;
  } else {
    system = `You are an expert academic English essay writer. Structure: Introduction (with clear thesis statement) / Body paragraphs (2-3 sections with ## headings) / Conclusion. Use formal academic English, varied sentence structures, and proper transitions. Mark any hypothetical sources with "[hypothetical source]".`;
  }

  const typeLabels = { academic: '학술/논문형', english: '영어 에세이', blog: '블로그' };
  const parts = [`주제: ${state.topic}`, `유형: ${typeLabels[state.type] || state.type}`, `언어: ${state.lang === 'korean' ? '한국어' : 'English'}`, `목표 길이: 약 ${state.len}단어`];
  if (state.citation) parts.push(`인용 스타일: ${state.citation}`);
  if (state.field) parts.push(`학문 분야: ${state.field}`);
  if (state.extra) parts.push(`추가 지시: ${state.extra}`);

  return { system, user: parts.join('\n') + '\n\n위 조건에 맞게 완성도 높은 에세이를 작성해주세요.' };
}

// ── 실제 생성 (Gemma 4 via Google AI Studio API) ──
async function runGenerate() {
  if (abortCtrl) abortCtrl.abort();
  abortCtrl = new AbortController();
  isLoading = true;
  essayText = '';

  // 메타 태그
  const typeLabel = state.type === 'academic' ? '📚 학술/논문형' : state.type === 'blog' ? '📝 블로그' : '🌏 영어 에세이';
  const langLabel = state.lang === 'korean' ? '🇰🇷 한국어' : '🇺🇸 English';
  let metaHtml = `<span class="meta-tag">${typeLabel}</span><span class="meta-tag">${langLabel}</span><span class="meta-tag">📏 ${state.len}단어 목표</span>`;
  if (state.citation) metaHtml += `<span class="meta-tag">📎 ${state.citation}</span>`;
  document.getElementById('meta-bar').innerHTML = metaHtml;
  document.getElementById('r-topic-title').textContent = state.topic;

  // 초기 UI
  setStatus('loading');
  document.getElementById('skeleton-area').style.display = '';
  document.getElementById('essay-body').style.display = 'none';
  document.getElementById('error-area').innerHTML = '';
  document.getElementById('regen-card').style.display = 'none';
  document.getElementById('action-bar').innerHTML = `<button class="act-btn stop-btn" onclick="stopGen()">⏹ 중단</button>`;

  const { system, user } = buildPrompts();
  const apiKey = getApiKey();

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMMA_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: system }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: user }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 4096
        }
      }),
      signal: abortCtrl.signal
    });

    if (!resp.ok) {
      const errData = await resp.text();
      if (resp.status === 400 || resp.status === 403) {
        throw new Error('API 키가 올바르지 않습니다. 🔑 API 키 버튼에서 다시 설정해주세요.');
      }
      throw new Error('API 오류 (상태: ' + resp.status + ')');
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    let started = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (raw === '[DONE]') continue;
        try {
          const parsed = JSON.parse(raw);
          const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (chunk) {
            if (!started) {
              document.getElementById('skeleton-area').style.display = 'none';
              document.getElementById('essay-body').style.display = '';
              started = true;
            }
            essayText += chunk;
            const el = document.getElementById('essay-text');
            el.innerHTML = esc(essayText) + '<span class="cursor"></span>';
            const body = document.getElementById('essay-body');
            body.scrollTop = body.scrollHeight;
          }
        } catch(e) {}
      }
    }
    onDone();
  } catch(err) {
    if (err.name === 'AbortError') { onDone(); return; }
    document.getElementById('skeleton-area').style.display = 'none';
    document.getElementById('error-area').innerHTML = `<div class="error-box">⚠️ ${err.message || '오류가 발생했습니다. 다시 시도해주세요.'}</div>`;
    document.getElementById('action-bar').innerHTML = '';
    setStatus('error');
  }
  isLoading = false;
}

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function stopGen() {
  if (abortCtrl) abortCtrl.abort();
  onDone();
}

function onDone() {
  isLoading = false;
  document.getElementById('skeleton-area').style.display = 'none';
  document.getElementById('essay-body').style.display = '';
  document.getElementById('essay-text').innerHTML = esc(essayText);
  setStatus('done');
  document.getElementById('action-bar').innerHTML = `
    <button class="act-btn prim" id="copy-btn" onclick="copyEssay()" ${!essayText ? 'disabled' : ''}>📋 전체 복사</button>
    <button class="act-btn" onclick="downloadTxt()" ${!essayText ? 'disabled' : ''}>📄 TXT 저장</button>
    <button class="act-btn" onclick="window.print()" ${!essayText ? 'disabled' : ''}>🖨️ 인쇄</button>
  `;
  if (essayText) document.getElementById('regen-card').style.display = '';
}

function setStatus(s) {
  const lbl = document.getElementById('r-status-lbl');
  const badge = document.getElementById('r-badge');
  const icon = document.getElementById('r-badge-icon');
  const blbl = document.getElementById('r-badge-lbl');
  if (s === 'loading') { lbl.textContent = '⏳ 생성 중...'; icon.textContent = '⚡'; blbl.textContent = '생성 중'; badge.classList.remove('done'); }
  if (s === 'done') { lbl.textContent = '✨ 생성 완료'; icon.textContent = '✓'; blbl.textContent = '완료!'; badge.classList.add('done'); }
  if (s === 'error') { lbl.textContent = '❌ 오류 발생'; icon.textContent = '!'; blbl.textContent = '오류'; badge.classList.remove('done'); }
}

function copyEssay() {
  navigator.clipboard.writeText(essayText).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = essayText; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
  });
  const btn = document.getElementById('copy-btn');
  btn.textContent = '✓ 복사됨!'; btn.className = 'act-btn copied';
  setTimeout(() => { btn.textContent = '📋 전체 복사'; btn.className = 'act-btn prim'; }, 2000);
}

function downloadTxt() {
  const blob = new Blob([essayText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'essay_' + Date.now() + '.txt'; a.click();
  URL.revokeObjectURL(url);
}
