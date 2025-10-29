import bus from '@/utils/bus';
import { defineStore } from 'pinia';
import { open, getAll, add, update, remove } from '@/db';

export const useWelcomeStore = defineStore('welcome', {
  state: () => ({
    tabla: 'welcome',
    data: [{}],
  }),
  actions: {
    async load() {
      await open();
      bus.on('change-' + this.tabla, async () => {
        this.data = await getAll(this.tabla);
      });
      this.data = await getAll(this.tabla);
    },

    async add(data) {
      await add(this.tabla, data);
      this.data.push(data);
    },

    async update(id, updates) {
      const updated = await update(this.tabla, id, updates);
      // reflejar en el estado de Pinia
      const idx = this.products.findIndex((p) => p.id === id);
      if (idx !== -1) this.products[idx] = updated;
    },

    async remove(id) {
      await remove(this.tabla, id);
      this.products = this.products.filter((p) => p.id !== id);
    },
  },
});
