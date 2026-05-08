export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const GH_TOKEN = process.env.GH_TOKEN;
  const GH_API = 'https://api.github.com/repos/andrepvlk2612/cx_orizon/contents/dados.json';

  const { content, sha } = req.body;
  const body = {
    message: `Atualização - ${new Date().toLocaleString('pt-BR')}`,
    content,
    ...(sha && { sha })
  };

  const r = await fetch(GH_API, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GH_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await r.json();
  res.status(r.status).json(data);
}
