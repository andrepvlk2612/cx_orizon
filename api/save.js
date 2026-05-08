const GITHUB_TOKEN = process.env.GH_TOKEN;
const GITHUB_USER = "andrepvlk2612";
const GITHUB_REPO = "cx_orizon";
const FILE_PATH = "dados.json";
 
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
 
  if (req.method === "OPTIONS") return res.status(200).end();
 
  const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
  };
 
  // GET — carrega os dados
  if (req.method === "GET") {
    const response = await fetch(apiUrl, { headers });
 
    if (response.status === 404) {
      return res.status(200).json({ content: null, sha: null });
    }
 
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: "Erro ao buscar arquivo",
        status: response.status,
        detalhe: errorData.message,
      });
    }
 
    const data = await response.json();
 
    if (!data.content) {
      return res.status(200).json({ content: null, sha: data.sha || null });
    }
 
    const content = JSON.parse(
      Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8")
    );
 
    return res.status(200).json({ content, sha: data.sha });
  }
 
  // PUT — salva os dados
  if (req.method === "PUT") {
    const { content, sha } = req.body;
 
    let currentSha = sha;
    if (!currentSha) {
      const check = await fetch(apiUrl, { headers });
      if (check.ok) {
        const existing = await check.json();
        currentSha = existing.sha;
      }
    }
 
    const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString(
      "base64"
    );
 
    const body = {
      message: "Atualização via painel CX",
      content: encoded,
      ...(currentSha && { sha: currentSha }),
    };
 
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
 
    const result = await response.json();
 
    if (!response.ok) {
      return res.status(response.status).json({ error: result.message });
    }
 
    return res.status(200).json({ ok: true, sha: result.content.sha });
  }
 
  return res.status(405).json({ error: "Método não permitido" });
};
