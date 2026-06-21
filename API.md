# Portfolio API

A small REST API to create / read / update / delete portfolio entries
programmatically (e.g. from an automation tool like openclaw). It writes to the
same Supabase tables the admin dashboard uses, so changes appear on the site
immediately.

## Base URL

```
http://localhost:3000/api/portfolios      # local dev
https://YOUR-DOMAIN/api/portfolios         # production
```

## Authentication

Reads (`GET`) are open. **Writes (`POST`, `PATCH`/`PUT`, `DELETE`) require the
API key**, sent as either header:

```
Authorization: Bearer <PORTFOLIO_API_KEY>
x-api-key: <PORTFOLIO_API_KEY>
```

The key is set in `.env` as `PORTFOLIO_API_KEY` (and must be set in your
production environment too). A missing/invalid key returns `401`.

## Endpoints

| Method | Path                  | Auth | Description                          |
| ------ | --------------------- | ---- | ------------------------------------ |
| GET    | `/api/portfolios`     | —    | List all portfolios (with relations) |
| POST   | `/api/portfolios`     | key  | Create a portfolio                   |
| GET    | `/api/portfolios/:id` | —    | Get one portfolio (with relations)   |
| PATCH  | `/api/portfolios/:id` | key  | Update fields / relations            |
| PUT    | `/api/portfolios/:id` | key  | Same as PATCH                        |
| DELETE | `/api/portfolios/:id` | key  | Delete a portfolio (cascades)        |

Responses are JSON: success is `{ "data": ... }`, errors are
`{ "error": "message" }` with an appropriate status (`400` / `401` / `404` / `500`).

## Request body (create / update)

```jsonc
{
  "title": "VR Training Simulation",   // required on create
  "category": "Virtual Reality",        // required on create
  "subtitle": "...",
  "description": "...",                  // can be HTML (shown via the detail page)
  "thumbnail_url": "https://.../img.jpg",
  "industry": "Manufacturing Industry",
  "year": "2024",
  "client": "Acme Corp",
  "duration": "3 months",
  "challenge": "...",
  "solution": "...",
  "result": "...",
  "project_url": "https://demo.example.com",  // live site / game URL / GDrive link; "" or null clears it
  "project_url_label": "Mainkan Game",        // optional CTA label (defaults to "Kunjungi Project")
  "is_featured": true,

  // relations — optional. On UPDATE, any array you send REPLACES that relation.
  "tags": ["Unity", "VR Headset", "Real-time 3D"],
  "technologies": ["WebXR", "3D Simulation"],
  "stats": [
    { "icon": "TrendingUp", "value": "+40%", "label": "Training Efficiency" },
    { "icon": "Clock", "value": "-60%", "label": "Training Time" }
  ],
  "media": [
    { "type": "image", "url": "https://.../1.jpg" },
    { "type": "youtube", "url": "dQw4w9WgXcQ" }      // type is "image" | "youtube"
  ],
  "testimonial": { "quote": "...", "author": "Jane Doe", "role": "CTO" }
}
```

On **update**, fields you omit stay unchanged. Send a relation array (even
`[]`) to replace it; omit it to leave it as-is.

## Examples

Create:

```bash
curl -X POST http://localhost:3000/api/portfolios \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "VR Training Simulation",
    "category": "Virtual Reality",
    "industry": "Manufacturing",
    "year": "2024",
    "is_featured": true,
    "tags": ["Unity", "VR"],
    "stats": [{ "icon": "TrendingUp", "value": "+40%", "label": "Efficiency" }]
  }'
```

Update (mark featured + replace tags):

```bash
curl -X PATCH http://localhost:3000/api/portfolios/<id> \
  -H "x-api-key: $PORTFOLIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "is_featured": false, "tags": ["WebXR", "LMS"] }'
```

Update (attach a live/game/download link shown on the detail page):

```bash
curl -X PATCH http://localhost:3000/api/portfolios/<id> \
  -H "x-api-key: $PORTFOLIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "project_url": "https://drive.google.com/file/d/…", "project_url_label": "Download Master File" }'
```

Delete:

```bash
curl -X DELETE http://localhost:3000/api/portfolios/<id> \
  -H "x-api-key: $PORTFOLIO_API_KEY"
```

List / get (no key):

```bash
curl http://localhost:3000/api/portfolios
curl http://localhost:3000/api/portfolios/<id>
```

## Security notes

- The DB currently has **permissive RLS** (the public anon key can already
  read/write). The API works today with that. For production, it's recommended
  to (1) tighten the Supabase RLS write policies and (2) set
  `SUPABASE_SERVICE_ROLE_KEY` in `.env` so this API writes with the service role
  instead of the public anon key.
- Keep `PORTFOLIO_API_KEY` secret and rotate it if leaked.
- Because writes are gated by the key, prefer calling this API **server-to-server**
  (don't embed the key in a public web page).
