import "server-only";
import { supabaseAdmin } from "./supabaseAdmin";
import type { PortfolioWithRelations } from "@/types/database";

/* The Supabase typed client is awkward to chain with generated Insert/Update
   types here, so — matching lib/portfolioService.ts — we cast `.from(...)` to
   any for the write paths. */
/* eslint-disable @typescript-eslint/no-explicit-any */

/** Error carrying an HTTP status so route handlers can map it to a response. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Columns the client may set on the main portfolios row. `id`/timestamps are
 *  managed by the DB and intentionally excluded. */
const PORTFOLIO_FIELDS = [
  "title", "subtitle", "description", "thumbnail_url", "category", "industry",
  "year", "client", "duration", "challenge", "solution", "result",
  "project_url", "project_url_label", "is_featured",
] as const;

// Columns stored as NULL (not "") when empty.
const NULLABLE = new Set<string>(["thumbnail_url", "project_url", "project_url_label"]);

const str = (v: unknown): string => (v == null ? "" : String(v));

function pickColumns(body: any, partial: boolean): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of PORTFOLIO_FIELDS) {
    if (f in body) {
      if (f === "is_featured") out[f] = Boolean(body[f]);
      else if (NULLABLE.has(f)) out[f] = body[f] == null || body[f] === "" ? null : String(body[f]);
      else out[f] = str(body[f]);
    } else if (!partial) {
      // create: fill missing optional columns with sensible defaults
      if (f === "is_featured") out[f] = false;
      else if (NULLABLE.has(f)) out[f] = null;
      else out[f] = "";
    }
  }
  return out;
}

async function withRelations(portfolio: any): Promise<PortfolioWithRelations> {
  const id = portfolio.id;
  const [media, stats, tags, tech, testimonial] = await Promise.all([
    supabaseAdmin.from("portfolio_media").select("*").eq("portfolio_id", id).order("order_index"),
    supabaseAdmin.from("portfolio_stats").select("*").eq("portfolio_id", id).order("order_index"),
    supabaseAdmin.from("portfolio_tags").select("*").eq("portfolio_id", id),
    supabaseAdmin.from("portfolio_technologies").select("*").eq("portfolio_id", id),
    supabaseAdmin.from("portfolio_testimonials").select("*").eq("portfolio_id", id).maybeSingle(),
  ]);
  return {
    ...portfolio,
    media: media.data || [],
    stats: stats.data || [],
    tags: tags.data || [],
    technologies: tech.data || [],
    testimonial: testimonial.data || null,
  };
}

// ---------- relation writers ----------

async function insertRows(table: string, rows: unknown[]) {
  if (!rows.length) return;
  const { error } = await (supabaseAdmin.from(table) as any).insert(rows);
  if (error) throw new ApiError(`Failed writing ${table}: ${error.message}`, 500);
}

async function clearRelation(table: string, portfolioId: string) {
  const { error } = await (supabaseAdmin.from(table) as any).delete().eq("portfolio_id", portfolioId);
  if (error) throw new ApiError(`Failed clearing ${table}: ${error.message}`, 500);
}

async function setNameList(table: string, id: string, value: any) {
  if (!Array.isArray(value)) throw new ApiError(`\`${table === "portfolio_tags" ? "tags" : "technologies"}\` must be an array of strings.`);
  await insertRows(table, value.map((v) => str(v).trim()).filter(Boolean).map((name) => ({ portfolio_id: id, name })));
}

async function setStats(id: string, value: any) {
  if (!Array.isArray(value)) throw new ApiError("`stats` must be an array of objects.");
  await insertRows("portfolio_stats", value.map((s: any, i: number) => ({
    portfolio_id: id, icon: str(s?.icon), value: str(s?.value), label: str(s?.label),
    order_index: Number.isFinite(s?.order_index) ? s.order_index : i,
  })));
}

async function setMedia(id: string, value: any) {
  if (!Array.isArray(value)) throw new ApiError("`media` must be an array of objects.");
  const rows = value.map((m: any, i: number) => {
    const type = str(m?.type);
    if (type !== "image" && type !== "youtube") throw new ApiError("Each media item needs `type` of 'image' or 'youtube'.");
    if (!str(m?.url).trim()) throw new ApiError("Each media item needs a `url`.");
    return { portfolio_id: id, type, url: str(m.url), order_index: Number.isFinite(m?.order_index) ? m.order_index : i };
  });
  await insertRows("portfolio_media", rows);
}

async function setTestimonial(id: string, value: any) {
  if (!value) return;
  if (typeof value !== "object" || Array.isArray(value)) throw new ApiError("`testimonial` must be an object.");
  await insertRows("portfolio_testimonials", [{
    portfolio_id: id, quote: str(value.quote), author: str(value.author), role: str(value.role),
  }]);
}

async function writeRelations(id: string, body: any, replace: boolean) {
  const apply = async (key: string, table: string, fn: () => Promise<void>) => {
    if (!(key in body)) return;
    if (replace) await clearRelation(table, id);
    await fn();
  };
  await apply("tags", "portfolio_tags", () => setNameList("portfolio_tags", id, body.tags));
  await apply("technologies", "portfolio_technologies", () => setNameList("portfolio_technologies", id, body.technologies));
  await apply("stats", "portfolio_stats", () => setStats(id, body.stats));
  await apply("media", "portfolio_media", () => setMedia(id, body.media));
  await apply("testimonial", "portfolio_testimonials", () => setTestimonial(id, body.testimonial));
}

// ---------- public service ----------

export async function listPortfolios(): Promise<PortfolioWithRelations[]> {
  const { data, error } = await supabaseAdmin.from("portfolios").select("*").order("created_at", { ascending: false });
  if (error) throw new ApiError(error.message, 500);
  return Promise.all((data || []).map(withRelations));
}

export async function getPortfolio(id: string): Promise<PortfolioWithRelations | null> {
  const { data, error } = await supabaseAdmin.from("portfolios").select("*").eq("id", id).maybeSingle();
  if (error) throw new ApiError(error.message, 500);
  if (!data) return null;
  return withRelations(data);
}

export async function createPortfolio(body: any): Promise<PortfolioWithRelations> {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new ApiError("Request body must be a JSON object.");
  if (!str(body.title).trim()) throw new ApiError("`title` is required.");
  if (!str(body.category).trim()) throw new ApiError("`category` is required.");

  const { data, error } = await (supabaseAdmin.from("portfolios") as any)
    .insert(pickColumns(body, false))
    .select()
    .single();
  if (error) throw new ApiError(error.message, 500);

  await writeRelations(data.id, body, false);
  return (await getPortfolio(data.id))!;
}

export async function updatePortfolio(id: string, body: any): Promise<PortfolioWithRelations | null> {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new ApiError("Request body must be a JSON object.");

  const existing = await supabaseAdmin.from("portfolios").select("id").eq("id", id).maybeSingle();
  if (existing.error) throw new ApiError(existing.error.message, 500);
  if (!existing.data) return null;

  const cols = pickColumns(body, true);
  if (Object.keys(cols).length) {
    const { error } = await (supabaseAdmin.from("portfolios") as any).update(cols).eq("id", id);
    if (error) throw new ApiError(error.message, 500);
  }
  // Any relation present in the body fully replaces that relation.
  await writeRelations(id, body, true);
  return getPortfolio(id);
}

export async function deletePortfolio(id: string): Promise<boolean> {
  const existing = await supabaseAdmin.from("portfolios").select("id").eq("id", id).maybeSingle();
  if (existing.error) throw new ApiError(existing.error.message, 500);
  if (!existing.data) return false;
  // Related rows are removed by the ON DELETE CASCADE foreign keys.
  const { error } = await (supabaseAdmin.from("portfolios") as any).delete().eq("id", id);
  if (error) throw new ApiError(error.message, 500);
  return true;
}
