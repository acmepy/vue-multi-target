import { defineStore } from 'pinia'
import { open, getAll, add, update, remove } from '@/db'

export const useWelcomeStore = defineStore('welcome', {
  state: () => ({
    data: [{}],
  }),
  actions: {
    async load() {
      await open()
      this.data = await getAll('welcome')
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
