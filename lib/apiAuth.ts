import { NextRequest, NextResponse } from "next/server";

/** Constant-time string comparison to avoid leaking the key via timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Guards a write route with the portfolio API key.
 *
 * The caller must send the key as `Authorization: Bearer <key>` or `x-api-key:
 * <key>`. Returns a 401/500 NextResponse when the request should be rejected,
 * or `null` when it is authorized (continue handling the request).
 */
export function requireApiKey(req: NextRequest): NextResponse | null {
  const expected = process.env.PORTFOLIO_API_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: "Server misconfigured: PORTFOLIO_API_KEY is not set." },
      { status: 500 }
    );
  }

  const auth = req.headers.get("authorization") ?? "";
  const bearer = /^bearer\s+/i.test(auth) ? auth.replace(/^bearer\s+/i, "").trim() : "";
  const provided = bearer || req.headers.get("x-api-key") || "";

  if (!provided || !safeEqual(provided, expected)) {
    return NextResponse.json(
      { error: "Unauthorized: invalid or missing API key." },
      { status: 401 }
    );
  }
  return null;
}
