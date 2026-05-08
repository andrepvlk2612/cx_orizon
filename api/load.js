export default async function handler(req, res) {
  const GH_TOKEN = process.env.GH_TOKEN;
  const GH_API = 'https://api.github.com/repos/andrepvlk2612/cx_orizon/contents/dados.json';
  const r = await fetch(GH_API, {
    headers: {
      Authorization: `token ${GH_TOKEN}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });
  const data = await r.json();
  res.status(r.status).json(data);
}
