export default async function handler(req, res) {
  const GH_TOKEN = process.env.GH_TOKEN;
  const BASE = 'https://api.github.com/repos/andrepvlk2612/cx_orizon/contents/';

  // GET: busca SHA de uma imagem existente
  if (req.method === 'GET') {
    const key = req.query.key;
    if (!key) return res.status(400).json({ error: 'key obrigatório' });
    const r = await fetch(BASE + key, {
      headers: {
        Authorization: `token ${GH_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    if (!r.ok) return res.status(r.status).json({ error: 'nao encontrado' });
    const data = await r.json();
    return res.status(200).json({ sha: data.sha });
  }

  // POST: salva uma imagem
  if (req.method === 'POST') {
    const { key, content, sha } = req.body;
    if (!key || !content) return res.status(400).json({ error: 'key e content obrigatorios' });
    const body = {
      message: `Imagem: ${key}`,
      content,
      ...(sha && { sha })
    };
    const r = await fetch(BASE + key, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GH_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  }

  return res.status(405).end();
}
