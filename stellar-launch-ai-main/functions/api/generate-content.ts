import { json, preflight, readJSON } from "../_lib/http";
import { generateASO, generateSocial, type SocialPost } from "../_lib/engine";
import { chatJSON, type Env } from "../_lib/openrouter";

export const onRequestOptions = () => preflight();

interface GenerateBody {
  name?: string;
  category?: string;
  description?: string;
}

interface GeneratePayload {
  aso: { title: string; subtitle: string; keywords: string[]; longDescription?: string };
  social: SocialPost[];
  source: "openrouter" | "engine";
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const body = await readJSON<GenerateBody>(request);
  const ctx = { name: body.name, category: body.category, description: body.description };

  // Deterministic baseline — always valid, used as fallback and to fill LLM gaps.
  const fallbackASO = generateASO(ctx);
  const fallbackSocial = generateSocial(ctx);

  const llm = await chatJSON<GeneratePayload>(
    env,
    [
      {
        role: "system",
        content:
          "You are LaunchPilot's launch-copy generator. Return ONLY JSON matching: " +
          '{"aso":{"title":string(<=30 chars),"subtitle":string(<=30 chars),"keywords":string[10],' +
          '"longDescription":string},"social":[{"platform":"Twitter"|"LinkedIn"|"Reddit","text":string}]}. ' +
          "Write punchy, specific, on-brand copy. The Twitter post should be a numbered thread, the " +
          "LinkedIn post a founder story with hashtags, the Reddit post a genuine, non-salesy narrative.",
      },
      {
        role: "user",
        content: `App name: ${body.name}\nCategory: ${body.category}\nDescription: ${body.description}`,
      },
    ],
    { temperature: 0.8, maxTokens: 1500 },
  );

  if (llm?.aso && Array.isArray(llm.social) && llm.social.length) {
    const payload: GeneratePayload = {
      aso: {
        title: (llm.aso.title || fallbackASO.title).slice(0, 30),
        subtitle: (llm.aso.subtitle || fallbackASO.subtitle).slice(0, 30),
        keywords:
          Array.isArray(llm.aso.keywords) && llm.aso.keywords.length
            ? llm.aso.keywords.slice(0, 10)
            : fallbackASO.keywords,
        longDescription: llm.aso.longDescription || fallbackASO.longDescription,
      },
      social: llm.social
        .filter((s) => s && s.platform && s.text)
        .slice(0, 3)
        .map((s) => ({ platform: s.platform, text: s.text })),
      source: "openrouter",
    };
    if (payload.social.length === 0) payload.social = fallbackSocial;
    return json(payload);
  }

  return json({
    aso: fallbackASO,
    social: fallbackSocial,
    source: "engine",
  } satisfies GeneratePayload);
};
