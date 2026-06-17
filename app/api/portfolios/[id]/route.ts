import { NextRequest } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import {
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "@/lib/portfolioApi";
import { ok, fail, badRequest, notFound, preflight } from "@/lib/apiResponse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export function OPTIONS() {
  return preflight();
}

/** GET /api/portfolios/:id — one portfolio with relations. Public read. */
export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const data = await getPortfolio(id);
    if (!data) return notFound();
    return ok({ data });
  } catch (e) {
    return fail(e);
  }
}

/**
 * PATCH/PUT /api/portfolios/:id — update a portfolio. Requires the API key.
 * Only fields present in the body are changed; any relation array present
 * (tags, technologies, stats, media, testimonial) fully replaces that relation.
 */
async function handleUpdate(req: NextRequest, { params }: Ctx) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  try {
    const data = await updatePortfolio(id, body);
    if (!data) return notFound();
    return ok({ data });
  } catch (e) {
    return fail(e);
  }
}

export const PATCH = handleUpdate;
export const PUT = handleUpdate;

/** DELETE /api/portfolios/:id — delete a portfolio (cascades relations).
 *  Requires the API key. */
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const deleted = await deletePortfolio(id);
    if (!deleted) return notFound();
    return ok({ data: { id, deleted: true } });
  } catch (e) {
    return fail(e);
  }
}
