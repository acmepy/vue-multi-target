//
//https://github.com/febkosq8/local-save/
//

import LocalSave from '@febkosq8/local-save'

export function openLocalSave() {
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
