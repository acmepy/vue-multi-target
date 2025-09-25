import { defineStore } from 'pinia'
import { openLocalSave } from '@/db'

const localSave = openLocalSave()

export const useAboutStore = defineStore('about', {
  state: () => ({
    data: '',
  }),
  getters: {
    getData: (state) => state.data,
  },
  actions: {
    async save({ key = 'about', value }) {
      await localSave.set('aboutData', key, value)
    },
    async load() {
      let local = await localSave.get('aboutData', 'about')
      if (!local || !local.data) {
        await this.save({ value: 'This is an about page' })
        local = await localSave.get('aboutData', 'about')
      }
      this.data = local.data
    },
  },
})
