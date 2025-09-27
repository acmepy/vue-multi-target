import { openDB } from 'idb'
import catalogo from '@/db/catalogo'

let _db
let _api

export async function open(api = 'localhost:3000/api/') {
  if (!_api) {
    _api = api
  }
  if (!_db) {
    _db = await openDB('vue', 1, {
      upgrade(db) {
        for (const c of catalogo) {
          if (!db.objectStoreNames.contains(c.name)) {
            db.createObjectStore(c.name, c.key)
          }
        }
      },
    })
    console.log('open', 'db inicializada')
  }
  return _db
}
export async function download(catalogo) {
  //const tmp = (await fetch(_api + catalogo)).json()
  const tmp = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.find((d) => d.catalogo == catalogo).data)
    }, 1500)
  })
  add(catalogo, tmp)
  return tmp
}

export async function getAll(catalogo) {
  let tmp = await _db.getAll(catalogo)
  if (tmp.length == 0) {
    tmp = download(catalogo)
  }
  return tmp
}

export async function get(catalogo, id) {
  return _db.get(catalogo, id)
}

export async function add(catalogo, data) {
  if (!Array.isArray(data)) {
    data = [data]
  }
  for (const d of data) {
    await _db.put(catalogo, { ...d })
  }
}

export async function update(catalogo, id, updates) {
  const existing = await get(catalogo, id)
  if (!existing) return
  const updated = { ...existing, ...updates }
  await _db.put(catalogo, updated)
  return updated
}

export async function remove(catalogo, id) {
  await _db.delete(catalogo, id)
}

export async function clear(catalogo) {
  await _db.clear(catalogo)
}

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
]

/*
//
//https://github.com/febkosq8/local-save/
//
import LocalSave from '@febkosq8/local-save'
export function open() {
  if (!localSave) {
    localSave = new LocalSave({
      dbName: 'vue',
      //encryptionKey: "MyRandEncryptKeyThatIs32CharLong", // Encryption key for data
      categories: ['aboutData', 'welcomeData'], // Define categories for data storage
      //expiryThreshold: 14, // Clear data older than 14 days
    })
  }
  return localSave
}
export let localSave = false
*/
