import { defineStore } from 'pinia';
import { open, getAll, add } from '@/db';

export const useAboutStore = defineStore('about', {
  state: () => ({
    data: { text: '' },
  }),
  actions: {
    async load() {
      await open();
      this.data = await getAll('about');
    },

    async add(data) {
      await add('about', data);
      this.data.push(data);
    },
  },
});
