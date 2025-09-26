import { defineStore } from 'pinia'
import { open, getAll, add, update, remove } from '@/db'

export const useWelcomeStore = defineStore('welcome', {
  state: () => ({
    data: [{}],
  }),
  actions: {
    async donwload() {
      console.log('donwload', 'iniciando')
      this.data = await new Promise((resolve) => {
        setTimeout(() => {
          console.log('donwload', 'descargado')
          resolve(dataDown.data)
        }, 1500)
      })
      //simular agregar nuevo registro
      const current = this.data.pop()
      await add('welcome', this.data)
      setTimeout(() => {
        this.add(current)
      }, 1000)
    },
    async load() {
      await open()
      this.data = await getAll('welcome')
      if (this.data.length == 0) {
        this.donwload()
      }
    },

    async add(data) {
      await add('welcome', data)
      this.data.push(data)
    },

    async update(id, updates) {
      const updated = await update('welcome', id, updates)
      // reflejar en el estado de Pinia
      const idx = this.products.findIndex((p) => p.id === id)
      if (idx !== -1) this.products[idx] = updated
    },

    async remove(id) {
      await remove('products', id)
      this.products = this.products.filter((p) => p.id !== id)
    },
  },
})

const dataDown = {
  data: [
    { id: 0, title: 'Documentation', text: 'Vue’s <a href="https://vuejs.org/" target="_blank" rel="noopener">official documentation</a> provides you with all information you need to get started.' },
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
}
