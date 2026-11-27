// Pings IndexNow (Bing, Yandex, Seznam, Naver; Bing also feeds ChatGPT search) with every URL in the live
// sitemap, or only the URLs passed as arguments. Run after a deploy:  node scripts/indexnow.mjs [url ...]
const KEY = 'd7f3a9c1e5b24f68a0c9e1b7d4f2a6c8'; // public/<KEY>.txt must be live
const HOST = 'www.divinehomeindia.com';

let urls = process.argv.slice(2);
if (!urls.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap-static.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.includes(HOST));
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${urls.length} urls -> HTTP ${res.status} ${await res.text()}`);
