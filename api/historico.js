// Vercel Function do painel principal: entrega o histórico da totalização do TSE ao longo da noite
// (gravado pelo coletor no Supabase), com cache na CDN da Vercel: ~1 leitura no Supabase a cada 30 s.
const SUPABASE_URL = "https://hvabmapxzgdadjnruycj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2YWJtYXB4emdkYWRqbnJ1eWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1NDMxMzcsImV4cCI6MjEwODExOTEzN30.ax3AWhs7hX4Esfgs6NbfMJCFaV99ITcJvMq97PNljfc"; // chave pública (anon)
module.exports = async (req, res) => {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/snapshot?id=eq.hist-tse&select=data`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: "Bearer " + SUPABASE_ANON_KEY } });
    const corpo = await r.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", r.ok ? "public, max-age=0, s-maxage=30, stale-while-revalidate=90" : "no-store");
    res.status(r.status).send(corpo);
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ erro: "falha ao ler o histórico" });
  }
};
