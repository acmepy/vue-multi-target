import bus from '@/utils/bus';
import { defineStore } from 'pinia';
import { open, getAll, add, update, remove } from '@/db';

export const useWelcomeStore = defineStore('welcome', {
  state: () => ({
    table: 'welcome',
    data: [{}],
  }),
  actions: {
    async load() {
      await open();
      bus.on('change-' + this.table, async () => {
        this.data = await getAll(this.table);
      });
      this.data = await getAll(this.table);
    },

    async add(data) {
      await add(this.table, data);
      this.data.push(data);
    },

    async update(id, updates) {
      const updated = await update(this.table, id, updates);
      // reflejar en el estado de Pinia
      const idx = this.products.findIndex((p) => p.id === id);
      if (idx !== -1) this.products[idx] = updated;
    },

    async remove(id) {
      await remove(this.table, id);
      this.products = this.products.filter((p) => p.id !== id);
    },
  },
});
