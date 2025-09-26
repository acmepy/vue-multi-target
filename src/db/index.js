import { openDB } from 'idb'
import catalogo from '@/db/catalogo'

let db

// inicializamos la base solo una vez
export async function open() {
  if (!db) {
    db = await openDB('vue', 1, {
      upgrade(db) {
        for (const c of catalogo) {
          if (!db.objectStoreNames.contains(c.name)) {
            console.log('db creando', c.name)
            db.createObjectStore(c.name, c.key)
          }
        }
      },
    })
    console.log('open', 'db inicializada')
  }
  return db
}

export async function getAll(catalogo) {
  console.log('getAll', catalogo)
  return await db.getAll(catalogo)
}

export async function get(catalogo, id) {
  return db.get(catalogo, id)
}

export async function add(catalogo, data) {
  console.log('add', catalogo, data)
  if (!Array.isArray(data)) {
    data = [data]
  }
  for (const d of data) {
    console.log('add loop', d.id)
    await db.put(catalogo, { ...d })
  }
}

export async function update(catalogo, id, updates) {
  const existing = await get(catalogo, id)
  if (!existing) return
  const updated = { ...existing, ...updates }
  await db.put('products', updated)
  return updated
}

export async function remove(catalogo, id) {
  await db.delete('products', id)
}

export async function clear(catalogo) {
  await db.clear(catalogo)
}

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
