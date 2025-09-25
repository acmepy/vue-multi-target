import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
//import LocalSave from '@febkosq8/local-save'

/*const localSave = new LocalSave({
  //encryptionKey: "MyRandEncryptKeyThatIs32CharLong", // Encryption key for data
  categories: ['cuonterData'], // Define categories for data storage
  expiryThreshold: 14, // Clear data older than 14 days
})*/

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
