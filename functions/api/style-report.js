const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}

function sanitizeText(value, maxLength = 600) {
  return String(value || "").trim().slice(0, maxLength);
}

function isValidImageDataUrl(value) {
  return /^data:image\/(png|jpe?g|webp);base64,[a-z0-9+/=\s]+$/i.test(String(value || ""));
}

function extractOutputText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const message = data?.output?.find((item) => item.type === "message");
  const text = message?.content?.find((item) => item.type === "output_text")?.text;
  return typeof text === "string" ? text.trim() : "";
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.OPENAI_API_KEY) {
    return jsonResponse({ error: "OPENAI_API_KEY 환경 변수가 필요합니다." }, 500);
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "요청 형식이 올바르지 않습니다." }, 400);
  }

  const height = Number(payload.height);
  const weight = Number(payload.weight);
  const style = sanitizeText(payload.style, 80) || "편한 캐주얼";
  const purpose = sanitizeText(payload.purpose, 80) || "데일리";
  const memo = sanitizeText(payload.memo, 800);
  const photoDataUrl = isValidImageDataUrl(payload.photoDataUrl) ? payload.photoDataUrl : "";

  if (!height || !weight || height < 120 || height > 230 || weight < 30 || weight > 200) {
    return jsonResponse({ error: "키와 몸무게 범위를 확인해주세요." }, 400);
  }

  const content = [
    {
      type: "input_text",
      text: [
        "사용자의 입력을 바탕으로 한국어 퍼스널 스타일 컨설팅 보고서를 작성해줘.",
        "외모 평가, 매력 점수, 체형 비하, 의료/다이어트 조언은 하지 말고, 옷의 핏과 실루엣 중심으로 실용적으로 말해줘.",
        "보고서 형식:",
        "1. 한 줄 스타일 방향",
        "2. 추천 실루엣",
        "3. 상의/하의/아우터 추천",
        "4. 피하면 좋은 선택",
        "5. 바로 입기 좋은 코디 3가지",
        "6. 쇼핑 키워드",
        "",
        `키: ${height}cm`,
        `몸무게: ${weight}kg`,
        `원하는 무드: ${style}`,
        `사용 목적: ${purpose}`,
        memo ? `취향 메모: ${memo}` : "취향 메모: 없음",
      ].join("\n"),
    },
  ];

  if (photoDataUrl) {
    content.push({
      type: "input_image",
      image_url: photoDataUrl,
      detail: "low",
    });
  }

  const model = env.OPENAI_MODEL || "gpt-5.4-mini";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions:
        "You are a practical Korean personal stylist. Give warm, specific, non-judgmental clothing advice. Do not identify the person in an image or infer sensitive traits.",
      input: [
        {
          role: "user",
          content,
        },
      ],
      max_output_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return jsonResponse(
      {
        error: "스타일 보고서를 생성하지 못했습니다.",
        detail: errorText.slice(0, 500),
      },
      response.status
    );
  }

  const data = await response.json();
  const report = extractOutputText(data);

  if (!report) {
    return jsonResponse({ error: "보고서 응답이 비어 있습니다." }, 502);
  }

  return jsonResponse({ report, model });
}
