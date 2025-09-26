import { defineStore } from 'pinia'
import { open, getAll, add /*, update, remove */ } from '@/db'
//import { openLocalSave } from '@/db'
//const localSave = openLocalSave()
await open()

export const useAboutStore = defineStore('about', {
  state: () => ({
    data: { text: '' },
  }),
  actions: {
    async donwload() {
      console.log('download', 'init')
      this.data = await new Promise((resolve) => {
        setTimeout(() => {
          console.log('download', dataDown.data)
          resolve(dataDown.data)
        }, 1500)
      })
      await add('about', this.data)
    },
    async load() {
      this.data = await getAll('about')
      if (this.data.text != '') {
        this.donwload()
      }
    },

    async add(data) {
      await add('about', data)
      this.data.push(data)
    },

    /*async update(id, updates) {
      const updated = await update('welcome', id, updates)
      // reflejar en el estado de Pinia
      const idx = this.products.findIndex((p) => p.id === id)
      if (idx !== -1) this.products[idx] = updated
    },

    async remove(id) {
      await remove('products', id)
      this.products = this.products.filter((p) => p.id !== id)
    },*/
  },
})

const dataDown = { data: { id: 0, text: 'This is an about page' } }
