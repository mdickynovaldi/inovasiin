import { NextRequest } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { listPortfolios, createPortfolio } from "@/lib/portfolioApi";
import { ok, fail, badRequest, preflight } from "@/lib/apiResponse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CORS preflight
export function OPTIONS() {
  return preflight();
}

/** GET /api/portfolios — list every portfolio (with relations). Public read. */
export async function GET() {
  try {
    return ok({ data: await listPortfolios() });
  } catch (e) {
    return fail(e);
  }
}

/** POST /api/portfolios — create a portfolio. Requires the API key. */
export async function POST(req: NextRequest) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  try {
    return ok({ data: await createPortfolio(body) }, 201);
  } catch (e) {
    return fail(e);
  }
}
