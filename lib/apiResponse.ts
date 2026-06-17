import { NextResponse } from "next/server";

/** Permissive CORS so any client (server-to-server or browser tool) can call
 *  the API. Writes are still gated by the API key, so CORS is not the guard. */
export const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

export function ok(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: CORS });
}

export function preflight(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400, headers: CORS });
}

export function notFound(message = "Portfolio not found."): NextResponse {
  return NextResponse.json({ error: message }, { status: 404, headers: CORS });
}

/** Maps a thrown error to a JSON response, honoring an attached `status`. */
export function fail(e: unknown): NextResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const status = typeof (e as any)?.status === "number" ? (e as any).status : 500;
  const error = e instanceof Error ? e.message : "Unexpected server error.";
  return NextResponse.json({ error }, { status, headers: CORS });
}
