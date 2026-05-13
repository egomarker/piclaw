/** Web handlers for session recording lifecycle, export, and trace playback data. */

import { getTimeline } from "../../../db.js";
import {
  deleteSessionRecording,
  getActiveSessionRecording,
  getSessionRecording,
  listActiveSessionRecordings,
  listSessionRecordings,
  previewSessionRecordingRedaction,
  recordSessionFixtureNote,
  recordTimelineInteraction,
  startSessionRecording,
  stopSessionRecording,
} from "../../../session-recordings/session-recordings.js";

export interface SessionRecordingJsonResponder {
  (payload: unknown, status?: number): Response;
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  const body = await req.json().catch(() => ({}));
  return body && typeof body === "object" ? body as Record<string, unknown> : {};
}

function resolveIdFromPath(pathname: string): string {
  const prefix = "/agent/recordings/";
  if (!pathname.startsWith(prefix)) return "";
  return decodeURIComponent(pathname.slice(prefix.length).split("/")[0] || "").trim();
}

function safeDownloadName(value: string): string {
  return String(value || "recording").replace(/[^a-zA-Z0-9_.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 96) || "recording";
}

function attachmentResponse(body: string, filename: string, contentType: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename=\"${safeDownloadName(filename)}\"`,
    },
  });
}

function scriptJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

function recordingPlaybackHtml(embeddedTrace?: unknown): string {
  const embeddedScript = embeddedTrace === undefined ? "null" : scriptJson(embeddedTrace);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Piclaw Recording Playback</title>
  <style>
    :root { color-scheme: dark; --bg:#0b1020; --panel:#121a2f; --muted:#94a3b8; --text:#e5edf9; --accent:#7dd3fc; --user:#1e3a8a; --agent:#172554; --tool:#422006; --status:#312e81; }
    * { box-sizing: border-box; }
    body { margin:0; font:14px/1.45 Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; color:var(--text); background: radial-gradient(circle at 20% -10%, #1e3a8a55, transparent 34rem), var(--bg); }
    header { position:sticky; top:0; z-index:2; display:flex; align-items:center; gap:.75rem; padding:.8rem 1rem; background:#080d1bcc; backdrop-filter: blur(14px); border-bottom:1px solid #24304d; }
    h1 { font-size:1rem; margin:0; font-weight:650; }
    button, select, input { color:var(--text); background:#172033; border:1px solid #334155; border-radius:.55rem; padding:.45rem .65rem; }
    button { cursor:pointer; }
    button:hover { border-color:var(--accent); }
    .spacer { flex:1; }
    .wrap { max-width:980px; margin:0 auto; padding:1.25rem; }
    .meta { color:var(--muted); margin-bottom:1rem; display:flex; gap:1rem; flex-wrap:wrap; }
    .timeline { display:flex; flex-direction:column; gap:.7rem; }
    .event { border:1px solid #24304d; background:var(--panel); border-radius:1rem; padding:.8rem .9rem; box-shadow:0 8px 28px #0005; animation:pop .18s ease-out; }
    .event.user_input { margin-left:16%; background:linear-gradient(135deg, var(--user), #1d4ed8); }
    .event.assistant_output { margin-right:16%; background:linear-gradient(135deg, var(--agent), #1e293b); }
    .event.tool_activity { background:linear-gradient(135deg, var(--tool), #292524); border-color:#854d0e; }
    .event.status { background:linear-gradient(135deg, var(--status), #1e1b4b); border-color:#6366f1; }
    .kind { color:var(--accent); font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; font-weight:700; }
    .time { color:var(--muted); font-size:.75rem; float:right; }
    .content { white-space:pre-wrap; margin-top:.35rem; overflow-wrap:anywhere; }
    details { margin-top:.45rem; color:var(--muted); }
    pre { max-height:18rem; overflow:auto; padding:.7rem; background:#020617; border-radius:.7rem; color:#cbd5e1; }
    .drop { border:1px dashed #475569; border-radius:1rem; padding:1rem; color:var(--muted); margin-bottom:1rem; }
    @keyframes pop { from { transform:translateY(4px); opacity:.4 } to { transform:none; opacity:1 } }
  </style>
</head>
<body>
  <header>
    <h1>Session Playback</h1>
    <button id="play">Play</button><button id="pause">Pause</button><button id="step">Step</button><button id="reset">Reset</button>
    <label>Speed <select id="speed"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option><option value="20">20×</option></select></label>
    <span class="spacer"></span><span id="counter" class="meta"></span>
  </header>
  <main class="wrap">
    <div class="drop">Playback-only. Load with <code>?id=&lt;recording-id&gt;</code>, <code>?src=&lt;trace-json-url&gt;</code>, export HTML, or drag/drop a JSON/JSONL trace file here.</div>
    <div id="meta" class="meta"></div>
    <section id="timeline" class="timeline"></section>
  </main>
<script>
const embeddedTrace = ${embeddedScript};
const fixture = { meta:{ id:'fixture', title:'Fixture playback', chatJid:'web:demo', startedAt:new Date().toISOString(), mode:'redacted', status:'stopped' }, events:[
  {kind:'recording_started', t_ms:0, at:new Date().toISOString(), data:{title:'Fixture playback'}},
  {kind:'user_input', t_ms:450, at:new Date().toISOString(), data:{data:{content:'Generate a tiny project status summary.'}}},
  {kind:'status', t_ms:900, at:new Date().toISOString(), data:{payload:{type:'thinking', title:'Thinking...'}}},
  {kind:'tool_activity', t_ms:1700, at:new Date().toISOString(), data:{event_type:'agent_status', payload:{type:'tool_call', tool_name:'grep', title:'Searching files'}}},
  {kind:'assistant_output', t_ms:3200, at:new Date().toISOString(), data:{data:{content:'Implemented the requested slice and validated it with targeted tests.'}}},
  {kind:'recording_stopped', t_ms:3800, at:new Date().toISOString(), data:{reason:'fixture'}}
]};
let trace = embeddedTrace || fixture, index = 0, timer = null;
const timeline = document.getElementById('timeline'), meta = document.getElementById('meta'), counter = document.getElementById('counter');
function textFrom(data){
  const d=data && typeof data==='object' ? data : {};
  return d.data?.content || d.payload?.title || d.payload?.content || d.payload?.tool_name || d.event_type || JSON.stringify(d, null, 2);
}
function renderMeta(){ const m=trace.meta||{}; meta.textContent = (m.title||m.id||'Recording') + ' · ' + (m.chatJid||m.chat_jid||'') + ' · ' + trace.events.length + ' events'; counter.textContent=String(index)+'/'+String(trace.events.length); }
function renderEvent(ev){ const el=document.createElement('article'); el.className='event '+(ev.kind||'event'); el.innerHTML='<span class="kind"></span><span class="time"></span><div class="content"></div><details><summary>raw</summary><pre></pre></details>'; el.querySelector('.kind').textContent=ev.kind||'event'; el.querySelector('.time').textContent=((ev.t_ms||0)/1000).toFixed(1)+'s'; el.querySelector('.content').textContent=textFrom(ev.data); el.querySelector('pre').textContent=JSON.stringify(ev,null,2); timeline.appendChild(el); el.scrollIntoView({block:'end', behavior:'smooth'}); }
function reset(){ pause(); index=0; timeline.textContent=''; renderMeta(); }
function step(){ if(index>=trace.events.length){ pause(); return; } renderEvent(trace.events[index++]); renderMeta(); }
function delayForNext(){ if(index<=0 || index>=trace.events.length) return 400; const prev=trace.events[index-1]?.t_ms||0, next=trace.events[index]?.t_ms||prev+400; return Math.max(60, (next-prev)/(Number(document.getElementById('speed').value)||1)); }
function play(){ if(timer) return; const loop=()=>{ step(); if(index<trace.events.length) timer=setTimeout(loop, delayForNext()); else pause(); }; loop(); }
function pause(){ if(timer) clearTimeout(timer); timer=null; }
async function load(){ if(embeddedTrace){ reset(); return; } const u=new URL(location.href); if(u.searchParams.get('id')){ const r=await fetch('/agent/recordings/'+encodeURIComponent(u.searchParams.get('id'))); if(r.ok) trace=await r.json(); } else if(u.searchParams.get('src')){ const r=await fetch(u.searchParams.get('src')); const txt=await r.text(); trace=parseTrace(txt); } else { const r=await fetch('/agent/recordings'); if(r.ok){ const list=await r.json(); const latest=(list.recordings||[])[0]; if(latest?.id){ const rr=await fetch('/agent/recordings/'+encodeURIComponent(latest.id)); if(rr.ok) trace=await rr.json(); } } } reset(); }
function parseTrace(txt){ const trimmed=txt.trim(); if(!trimmed) return fixture; if(trimmed.startsWith('{')) return JSON.parse(trimmed); return {meta:{id:'dropped', title:'Dropped trace'}, events:trimmed.split(new RegExp("\\\\n+")).map(l=>JSON.parse(l))}; }
document.getElementById('play').onclick=play; document.getElementById('pause').onclick=pause; document.getElementById('step').onclick=step; document.getElementById('reset').onclick=reset;
document.body.ondragover=e=>{e.preventDefault();}; document.body.ondrop=e=>{e.preventDefault(); const f=e.dataTransfer.files[0]; if(!f) return; f.text().then(t=>{trace=parseTrace(t); reset();});};
load().catch(e=>{ meta.textContent='Failed to load recording: '+e.message; reset(); });
</script>
</body></html>`;
}

function exportRecordingResponse(id: string, req: Request, json: SessionRecordingJsonResponder): Response {
  const recording = getSessionRecording(id);
  if (!recording) return json({ error: "Recording not found." }, 404);
  const format = (new URL(req.url).searchParams.get("format") || "json").toLowerCase();
  const stem = safeDownloadName(`${recording.meta.title || recording.meta.id}-${recording.meta.id}`);
  if (format === "jsonl") {
    const body = recording.events.map((event) => JSON.stringify(event)).join("\n") + "\n";
    return attachmentResponse(body, `${stem}.jsonl`, "application/x-ndjson; charset=utf-8");
  }
  if (format === "html") {
    return attachmentResponse(recordingPlaybackHtml(recording), `${stem}.html`, "text/html; charset=utf-8");
  }
  return attachmentResponse(JSON.stringify(recording, null, 2), `${stem}.json`, "application/json; charset=utf-8");
}

export async function handleSessionRecordingRoutes(
  req: Request,
  pathname: string,
  json: SessionRecordingJsonResponder,
): Promise<Response | null> {
  if (req.method === "GET" && pathname === "/recordings/playback") {
    return new Response(recordingPlaybackHtml(), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
  }

  if (!pathname.startsWith("/agent/recordings")) return null;

  if (req.method === "GET" && pathname === "/agent/recordings") {
    return json({ ok: true, recordings: listSessionRecordings(), active: listActiveSessionRecordings() }, 200);
  }

  if (req.method === "POST" && pathname === "/agent/recordings/redact-preview") {
    const body = await readJson(req);
    return json({ ok: true, preview: previewSessionRecordingRedaction(body.payload, { mode: body.mode, redaction: body.redaction }) }, 200);
  }

  if (req.method === "POST" && pathname === "/agent/recordings/start") {
    const body = await readJson(req);
    const chatJid = body.chat_jid ?? body.chatJid;
    const meta = startSessionRecording({ chatJid, title: body.title, mode: body.mode, redaction: body.redaction });
    const includeSnapshot = body.include_timeline_snapshot === true || body.includeTimelineSnapshot === true;
    if (includeSnapshot && meta.eventCount <= 1) {
      const limit = Math.min(250, Math.max(1, Number(body.timeline_snapshot_limit ?? body.timelineSnapshotLimit ?? 50) || 50));
      const snapshot = getTimeline(meta.chatJid, limit);
      recordSessionFixtureNote(meta.chatJid, { type: "timeline_snapshot", count: snapshot.length, limit });
      for (const interaction of snapshot) recordTimelineInteraction(interaction);
    }
    return json({ ok: true, recording: getActiveSessionRecording(meta.chatJid) || meta }, 201);
  }

  if (req.method === "POST" && pathname === "/agent/recordings/stop") {
    const body = await readJson(req);
    const key = typeof body.id === "string" ? body.id : (typeof body.chat_jid === "string" ? body.chat_jid : body.chatJid);
    if (typeof key !== "string" || !key.trim()) return json({ error: "Provide id or chat_jid." }, 400);
    const meta = stopSessionRecording(key);
    if (!meta) return json({ error: "Recording not active." }, 404);
    return json({ ok: true, recording: meta }, 200);
  }

  if (req.method === "GET" && pathname === "/agent/recordings/active") {
    const chatJid = new URL(req.url).searchParams.get("chat_jid") || "web:default";
    return json({ ok: true, recording: getActiveSessionRecording(chatJid) }, 200);
  }

  const id = resolveIdFromPath(pathname);
  if (!id) return json({ error: "Not found" }, 404);

  if (req.method === "GET" && pathname.endsWith("/export")) {
    return exportRecordingResponse(id, req, json);
  }

  if (req.method === "GET") {
    const recording = getSessionRecording(id);
    if (!recording) return json({ error: "Recording not found." }, 404);
    return json(recording, 200);
  }

  if (req.method === "DELETE") {
    return json({ ok: true, deleted: deleteSessionRecording(id) }, 200);
  }

  return json({ error: "Not found" }, 404);
}
