import express from 'express';

const router = express.Router();
const sseSubscriptions = new Map();
const data = [
  { catalogo: 'about', data: [{ id: 0, text: 'This is an about page' }] },
  {
    catalogo: 'welcome',
    data: [
      {
        id: 0,
        title: 'Documentation',
        text: 'Vue’s <a href="https://vuejs.org/" target="_blank" rel="noopener">official documentation</a> provides you with all information you need to get started.',
      },
      {
        id: 1,
        title: 'Tooling',
        text: 'This project is served and bundled with <a href="https://vite.dev/guide/features.html" target="_blank" rel="noopener">Vite</a>. The recommended IDE setup is <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VSCode</a> + <a href="https://github.com/vuejs/language-tools" target="_blank" rel="noopener">Vue - Official</a>. If you need to test your components and web pages, check out <a href="https://vitest.dev/" target="_blank" rel="noopener">Vitest</a> and <a href="https://www.cypress.io/" target="_blank" rel="noopener">Cypress</a> / <a href="https://playwright.dev/" target="_blank" rel="noopener">Playwright</a>. <br /> More instructions are available in <a href="javascript:void(0)" @click="openReadmeInEditor"><code>README.md</code></a>.',
      },
      {
        id: 2,
        title: 'Ecosystem',
        text: 'Get official tools and libraries for your project: <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener">Pinia</a>, <a href="https://router.vuejs.org/" target="_blank" rel="noopener">Vue Router</a>, <a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener">Vue Test Utils</a>, and <a href="https://github.com/vuejs/devtools" target="_blank" rel="noopener">Vue Dev Tools</a>. If you need more resources, we suggest paying <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">Awesome Vue</a> a visit.',
      },
      {
        id: 3,
        title: 'Community',
        text: 'Got stuck? Ask your question on <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Vue Land</a> (our official Discord server), or <a href="https://stackoverflow.com/questions/tagged/vue.js" target="_blank" rel="noopener">StackOverflow</a>. You should also follow the official <a href="https://bsky.app/profile/vuejs.org" target="_blank" rel="noopener">@vuejs.org</a> Bluesky account or the <a href="https://x.com/vuejs" target="_blank" rel="noopener">@vuejs</a> X account for latest news in the Vue world.',
      },
      {
        id: 4,
        title: 'Support Vue',
        text: 'As an independent project, Vue relies on community backing for its sustainability. You can help us by <a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener">becoming a sponsor</a>.',
      },
    ],
  },
];

router.get('/:catalogo', (req, res) => {
  const { catalogo } = req.params;
  const d = data.find((d) => d.catalogo == catalogo);
  setTimeout(() => {
    res.json([d.data[0]]);
  }, 2000);
});

router.get('/:catalogo/event', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const { clientId, platform } = req.params;
  sseSubscriptions.set(clientId, { clientId, platform, res });
  res.write(`data: ${JSON.stringify({ ok: true, msg: 'escuchando eventos' })}\n\n`);
  console.log(`Cantidad escuchando el evento :${sseSubscriptions.size}`);
});

/*for (const [clientId, sse] of sseSubscriptions) {
    sse.res.write(`data: ${JSON.stringify({ ok: true, msg: 'Conectado a SSE' })}\n\n`);
  }*/

export default router;
setTimeout(() => {
  const catalogo = data[1].catalogo;
  for (let d = 1; d < data[1].data.length; d++) {
    const tmp = data[1].data[d];
    //console.log(catalogo, tmp);
    setTimeout(() => {
      for (const [clientId, sse] of sseSubscriptions) {
        sse.res.write(`data: ${JSON.stringify({ ok: true, event: 'create', catalogo, data: [tmp] })}\n\n`);
      }
    }, 1500 * d);
  }
}, 5000);

setInterval(() => {
  for (const [clientId, sse] of sseSubscriptions) {
    sse.res.write(`data: ${JSON.stringify({ ok: true, msg: 'escuchando eventos' })}\n\n`);
  }
}, 120000);
